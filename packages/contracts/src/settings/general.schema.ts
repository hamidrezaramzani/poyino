import { z } from "zod";

export const GeneralSettingsSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(1, "ORGANIZATION_NAME_REQUIRED")
    .min(3, "ORGANIZATION_NAME_TOO_SHORT")
    .max(80, "ORGANIZATION_NAME_TOO_LONG"),
  displayName: z
    .string()
    .trim()
    .max(80, "DISPLAY_NAME_TOO_LONG")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  description: z
    .string()
    .trim()
    .max(300, "DESCRIPTION_TOO_LONG")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
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
  country: z
    .string()
    .trim()
    .max(80, "COUNTRY_TOO_LONG")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  city: z
    .string()
    .trim()
    .max(80, "CITY_TOO_LONG")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  timezone: z.string().trim().min(1, "TIMEZONE_REQUIRED").max(64, "TIMEZONE_INVALID"),
  language: z.enum(["fa", "en"], {
    message: "LANGUAGE_REQUIRED",
  }),
});

export type GeneralSettingsInput = z.infer<typeof GeneralSettingsSchema>;

export const GeneralSettingsDataSchema = z.object({
  organizationName: z.string(),
  displayName: z.string().nullable(),
  description: z.string().nullable(),
  email: z.string(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  country: z.string().nullable(),
  city: z.string().nullable(),
  timezone: z.string(),
  language: z.enum(["fa", "en"]),
});

export type GeneralSettingsData = z.infer<typeof GeneralSettingsDataSchema>;

export const GeneralSettingsSuccessSchema = z.object({
  success: z.literal(true),
  settings: GeneralSettingsDataSchema.optional(),
});

export type GeneralSettingsSuccess = z.infer<typeof GeneralSettingsSuccessSchema>;

export const SettingsErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  EMAIL_EXISTS: "EMAIL_EXISTS",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  FILE_INVALID_TYPE: "FILE_INVALID_TYPE",
  FILE_NOT_FOUND: "FILE_NOT_FOUND",
  CURRENT_PASSWORD_INCORRECT: "CURRENT_PASSWORD_INCORRECT",
  SAME_PASSWORD: "SAME_PASSWORD",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type SettingsErrorCode =
  (typeof SettingsErrorCode)[keyof typeof SettingsErrorCode];
