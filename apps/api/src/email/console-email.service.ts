import { Injectable, Logger } from "@nestjs/common";
import type {
  EmailService,
  SendPasswordResetEmailInput,
  SendVerificationEmailInput,
} from "./email.interface";

@Injectable()
export class ConsoleEmailService implements EmailService {
  private readonly logger = new Logger(ConsoleEmailService.name);

  async sendVerificationEmail(input: SendVerificationEmailInput): Promise<void> {
    this.logger.log(
      [
        "Verification email (console adapter)",
        `to=${input.to}`,
        `organization=${input.organizationName}`,
        `url=${input.verificationUrl}`,
      ].join(" | "),
    );
  }

  async sendPasswordResetEmail(
    input: SendPasswordResetEmailInput,
  ): Promise<void> {
    this.logger.log(
      [
        "Password reset email (console adapter)",
        `to=${input.to}`,
        `organization=${input.organizationName}`,
        `url=${input.resetUrl}`,
        `expiresInMinutes=${input.expiresInMinutes}`,
        "securityNotice=If you did not request this, ignore the email.",
      ].join(" | "),
    );
  }
}
