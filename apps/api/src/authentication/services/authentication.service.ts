import { createHash, randomBytes, randomUUID } from "node:crypto";
import { ConflictException, Inject, Injectable } from "@nestjs/common";
import {
  RegisterErrorCode,
  type RegisterInput,
} from "@poyino/contracts";
import { createOrganizationSlug, formatWorkspaceName } from "@poyino/utils";
import * as bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import {
  EMAIL_SERVICE,
  type EmailService,
} from "../../email/email.interface";

const EMAIL_TOKEN_EXPIRATION_MS = 15 * 60 * 1000;
const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthenticationService {
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
