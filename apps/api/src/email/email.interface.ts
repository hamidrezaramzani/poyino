export type SendVerificationEmailInput = {
  to: string;
  organizationName: string;
  verificationUrl: string;
};

export type SendPasswordResetEmailInput = {
  to: string;
  organizationName: string;
  resetUrl: string;
  expiresInMinutes: number;
};

export type SendJobExpirationReminderEmailInput = {
  to: string;
  organizationName: string;
  jobTitle: string;
  expirationDate: string;
  jobUrl: string;
};

export interface EmailService {
  sendVerificationEmail(input: SendVerificationEmailInput): Promise<void>;
  sendPasswordResetEmail(input: SendPasswordResetEmailInput): Promise<void>;
  sendJobExpirationReminderEmail(
    input: SendJobExpirationReminderEmailInput,
  ): Promise<void>;
}

export const EMAIL_SERVICE = Symbol("EMAIL_SERVICE");
