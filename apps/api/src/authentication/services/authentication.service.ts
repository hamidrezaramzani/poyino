import { createHash, randomBytes, randomUUID } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import {
  LoginErrorCode,
  RegisterErrorCode,
  ForgotPasswordErrorCode,
  ResetPasswordErrorCode,
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
} from "@poyino/contracts";
import { createOrganizationSlug, formatWorkspaceName } from "@poyino/utils";
import * as bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import {
  EMAIL_SERVICE,
  type EmailService,
} from "../../email/email.interface";
import {
  FAILED_LOGIN_LIMIT,
  FAILED_LOGIN_LOCK_MS,
  FORGOT_PASSWORD_LIMIT,
  FORGOT_PASSWORD_LOCK_MS,
  PASSWORD_RESET_TOKEN_EXPIRATION_MS,
  RESET_PASSWORD_LIMIT,
  RESET_PASSWORD_LOCK_MS,
  SESSION_EXPIRATION_MS,
} from "../authentication.constants";

const EMAIL_TOKEN_EXPIRATION_MS = 15 * 60 * 1000;
const BCRYPT_ROUNDS = 12;
const DUMMY_PASSWORD_HASH =
  "$2b$12$fdaugNTrXS2.uJe7N2Ipk.O3fxvyCjncr/N5bUB2v3UGOk2XDZNBG";

type AttemptState = {
  count: number;
  lockedUntil?: number;
};

type LoginContext = {
  ip: string;
  userAgent?: string;
};

type ForgotPasswordContext = {
  ip: string;
};

type ResetPasswordContext = {
  ip: string;
};

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);
  private readonly failedLoginAttempts = new Map<string, AttemptState>();
  private readonly forgotPasswordAttempts = new Map<string, AttemptState>();
  private readonly resetPasswordAttempts = new Map<string, AttemptState>();

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(EMAIL_SERVICE) private readonly emailService: EmailService,
  ) {}

  async register(input: RegisterInput) {
    const organizationName = formatWorkspaceName(input.organizationName);
    const email = input.email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw emailAlreadyExistsException();
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + EMAIL_TOKEN_EXPIRATION_MS);

    let result: {
      organization: { name: string };
      user: { email: string };
    };

    try {
      result = await this.prisma.$transaction(async (tx) => {
        const organizationId = randomUUID();
        const slug = await resolveUniqueSlug(
          tx,
          createOrganizationSlug(organizationName, organizationId),
        );

        const organization = await tx.organization.create({
          data: {
            id: organizationId,
            name: organizationName,
            slug,
          },
        });

        const user = await tx.user.create({
          data: {
            email,
            passwordHash,
            role: "ADMINISTRATOR",
            isEmailVerified: false,
            organizationId: organization.id,
          },
        });

        await tx.emailVerificationToken.create({
          data: {
            userId: user.id,
            tokenHash,
            expiresAt,
          },
        });

        return { organization, user };
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw emailAlreadyExistsException();
      }
      throw error;
    }

    const webAppUrl = process.env.WEB_APP_URL ?? "http://localhost:5173";
    const verificationUrl = `${webAppUrl}/auth/verify-email?token=${rawToken}`;

    await this.emailService.sendVerificationEmail({
      to: result.user.email,
      organizationName: result.organization.name,
      verificationUrl,
    });

    return { success: true as const };
  }

  async login(input: LoginInput, context: LoginContext) {
    const email = input.email.trim().toLowerCase();
    const attemptKey = `${context.ip}:${email}`;

    this.assertNotRateLimited(
      this.failedLoginAttempts,
      attemptKey,
      tooManyLoginRequestsException,
    );

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
    const passwordMatches = await bcrypt.compare(input.password, passwordHash);

    if (!user || !passwordMatches) {
      this.recordAttempt(
        this.failedLoginAttempts,
        attemptKey,
        email,
        context.ip,
        FAILED_LOGIN_LIMIT,
        FAILED_LOGIN_LOCK_MS,
        "login",
      );
      throw invalidCredentialsException();
    }

    if (!user.isEmailVerified) {
      this.logger.warn(
        `Login blocked for unverified email=${email} ip=${context.ip}`,
      );
      throw emailNotVerifiedException();
    }

    this.failedLoginAttempts.delete(attemptKey);

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_MS);
    const now = new Date();

    await this.prisma.$transaction([
      this.prisma.session.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
          ipAddress: context.ip.slice(0, 45),
          userAgent: context.userAgent?.slice(0, 512),
        },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: now },
      }),
    ]);

    this.logger.log(`Login successful email=${email} ip=${context.ip}`);

    return {
      success: true as const,
      sessionToken: rawToken,
      expiresAt,
    };
  }

  async forgotPassword(
    input: ForgotPasswordInput,
    context: ForgotPasswordContext,
  ) {
    const email = input.email.trim().toLowerCase();
    const attemptKey = `${context.ip}:${email}`;

    this.assertNotRateLimited(
      this.forgotPasswordAttempts,
      attemptKey,
      tooManyForgotPasswordRequestsException,
    );

    this.recordAttempt(
      this.forgotPasswordAttempts,
      attemptKey,
      email,
      context.ip,
      FORGOT_PASSWORD_LIMIT,
      FORGOT_PASSWORD_LOCK_MS,
      "forgot-password",
    );

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (user) {
      const rawToken = randomBytes(32).toString("hex");
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(
        Date.now() + PASSWORD_RESET_TOKEN_EXPIRATION_MS,
      );
      const now = new Date();

      await this.prisma.$transaction([
        this.prisma.passwordResetToken.updateMany({
          where: {
            userId: user.id,
            usedAt: null,
          },
          data: { usedAt: now },
        }),
        this.prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            tokenHash,
            expiresAt,
          },
        }),
      ]);

      const webAppUrl = process.env.WEB_APP_URL ?? "http://localhost:5173";
      const resetUrl = `${webAppUrl}/auth/reset-password?token=${rawToken}`;

      await this.emailService.sendPasswordResetEmail({
        to: user.email,
        organizationName: user.organization.name,
        resetUrl,
        expiresInMinutes: PASSWORD_RESET_TOKEN_EXPIRATION_MS / 60_000,
      });

      this.logger.log(
        `Password reset email sent email=${email} ip=${context.ip}`,
      );
    } else {
      this.logger.log(
        `Password reset requested for unknown email ip=${context.ip}`,
      );
    }

    return { success: true as const };
  }

  async validateResetToken(token: string) {
    await this.resolveResetToken(token);
    return { success: true as const };
  }

  async resetPassword(
    input: ResetPasswordInput,
    context: ResetPasswordContext,
  ) {
    const attemptKey = context.ip;

    this.assertNotRateLimited(
      this.resetPasswordAttempts,
      attemptKey,
      tooManyResetPasswordRequestsException,
    );

    this.recordAttempt(
      this.resetPasswordAttempts,
      attemptKey,
      "n/a",
      context.ip,
      RESET_PASSWORD_LIMIT,
      RESET_PASSWORD_LOCK_MS,
      "reset-password",
    );

    const resetToken = await this.resolveResetToken(input.token);
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const now = new Date();

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          usedAt: null,
        },
        data: { usedAt: now },
      }),
    ]);

    this.logger.log(
      `Password reset successful userId=${resetToken.userId} ip=${context.ip}`,
    );

    return { success: true as const };
  }

  private async resolveResetToken(rawToken: string) {
    const token = rawToken.trim();
    if (!token) {
      throw invalidResetTokenException();
    }

    const tokenHash = hashToken(token);
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.usedAt) {
      throw invalidResetTokenException();
    }

    if (resetToken.expiresAt.getTime() <= Date.now()) {
      throw expiredResetTokenException();
    }

    return resetToken;
  }

  private assertNotRateLimited(
    store: Map<string, AttemptState>,
    attemptKey: string,
    createException: () => HttpException,
  ) {
    const state = store.get(attemptKey);
    if (!state?.lockedUntil) {
      return;
    }

    if (Date.now() < state.lockedUntil) {
      throw createException();
    }

    store.delete(attemptKey);
  }

  private recordAttempt(
    store: Map<string, AttemptState>,
    attemptKey: string,
    email: string,
    ip: string,
    limit: number,
    lockMs: number,
    kind: "login" | "forgot-password" | "reset-password",
  ) {
    const current = store.get(attemptKey) ?? { count: 0 };
    const count = current.count + 1;
    const next: AttemptState = { count };

    if (count >= limit) {
      next.lockedUntil = Date.now() + lockMs;
      this.logger.warn(
        `${kind} rate limit reached email=${email} ip=${ip} attempts=${count}`,
      );
    } else if (kind === "login") {
      this.logger.warn(
        `Failed login attempt email=${email} ip=${ip} attempts=${count}`,
      );
    }

    store.set(attemptKey, next);
  }
}

function emailAlreadyExistsException() {
  return new ConflictException({
    success: false,
    error: {
      code: RegisterErrorCode.EMAIL_ALREADY_EXISTS,
      message: "پست الکترونیکی قبلاً ثبت شده است.",
    },
  });
}

function invalidCredentialsException() {
  return new UnauthorizedException({
    success: false,
    error: {
      code: LoginErrorCode.INVALID_CREDENTIALS,
      message: "پست الکترونیکی یا رمز عبور اشتباه است.",
    },
  });
}

function emailNotVerifiedException() {
  return new ForbiddenException({
    success: false,
    error: {
      code: LoginErrorCode.EMAIL_NOT_VERIFIED,
      message:
        "حساب کاربری شما هنوز فعال نشده است. لطفاً ایمیل خود را بررسی کنید.",
    },
  });
}

function invalidResetTokenException() {
  return new BadRequestException({
    success: false,
    error: {
      code: ResetPasswordErrorCode.INVALID_TOKEN,
      message: "لینک بازیابی معتبر نیست.",
    },
  });
}

function expiredResetTokenException() {
  return new BadRequestException({
    success: false,
    error: {
      code: ResetPasswordErrorCode.EXPIRED_TOKEN,
      message: "اعتبار لینک بازیابی به پایان رسیده است.",
    },
  });
}

function tooManyLoginRequestsException() {
  return new HttpException(
    {
      success: false,
      error: {
        code: LoginErrorCode.TOO_MANY_REQUESTS,
        message:
          "تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.",
      },
    },
    HttpStatus.TOO_MANY_REQUESTS,
  );
}

function tooManyForgotPasswordRequestsException() {
  return new HttpException(
    {
      success: false,
      error: {
        code: ForgotPasswordErrorCode.TOO_MANY_REQUESTS,
        message:
          "تعداد درخواست‌های بازیابی رمز عبور بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.",
      },
    },
    HttpStatus.TOO_MANY_REQUESTS,
  );
}

function tooManyResetPasswordRequestsException() {
  return new HttpException(
    {
      success: false,
      error: {
        code: ResetPasswordErrorCode.TOO_MANY_REQUESTS,
        message:
          "تعداد تلاش‌های بازنشانی رمز عبور بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.",
      },
    },
    HttpStatus.TOO_MANY_REQUESTS,
  );
}

async function resolveUniqueSlug(
  tx: Prisma.TransactionClient,
  baseSlug: string,
) {
  let slug = baseSlug;
  let suffix = 1;

  while (await tx.organization.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
