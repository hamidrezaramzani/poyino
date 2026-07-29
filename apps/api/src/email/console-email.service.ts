import { Injectable, Logger } from "@nestjs/common";
import type { EmailService, SendVerificationEmailInput } from "./email.interface";

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
}
