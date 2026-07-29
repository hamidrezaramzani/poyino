import { z } from "zod";

export const ProfileSettingsSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(1, "ORGANIZATION_NAME_REQUIRED")
    .min(3, "ORGANIZATION_NAME_TOO_SHORT")
    .max(80, "ORGANIZATION_NAME_TOO_LONG"),
  email: z.string().trim().min(1, "EMAIL_REQUIRED").email("EMAIL_INVALID"),
  phone: z
    .string()
    .trim()
    .max(20, "PHONE_TOO_LONG")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  website: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null))
    .pipe(z.string().url("WEBSITE_INVALID").nullable()),
  address: z
    .string()
    .trim()
    .max(300, "ADDRESS_TOO_LONG")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  logoId: z.union([z.string().uuid("LOGO_INVALID"), z.null()]).optional(),
});

export type ProfileSettingsInput = z.infer<typeof ProfileSettingsSchema>;

export const ProfileSettingsDataSchema = z.object({
  organizationName: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  address: z.string().nullable(),
  logoId: z.string().uuid().nullable(),
  logoUrl: z.string().nullable(),
});

export type ProfileSettingsData = z.infer<typeof ProfileSettingsDataSchema>;

export const ProfileSettingsSuccessSchema = z.object({
  success: z.literal(true),
  settings: ProfileSettingsDataSchema.optional(),
});

export type ProfileSettingsSuccess = z.infer<typeof ProfileSettingsSuccessSchema>;
