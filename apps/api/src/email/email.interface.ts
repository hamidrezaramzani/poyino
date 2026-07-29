export type SendVerificationEmailInput = {
  to: string;
  organizationName: string;
  verificationUrl: string;
};

export interface EmailService {
  sendVerificationEmail(input: SendVerificationEmailInput): Promise<void>;
}

export const EMAIL_SERVICE = Symbol("EMAIL_SERVICE");
