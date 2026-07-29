import { z } from "zod";

const hexColor = (code: string) =>
  z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, code);

const optionalFileId = z
  .union([z.string().uuid("LOGO_INVALID"), z.null()])
  .optional();

export const BrandingSettingsSchema = z.object({
  logoId: optionalFileId,
  darkLogoId: optionalFileId,
  primaryColor: hexColor("PRIMARY_COLOR_INVALID"),
  secondaryColor: hexColor("SECONDARY_COLOR_INVALID"),
});

export type BrandingSettingsInput = z.infer<typeof BrandingSettingsSchema>;

export const BrandingSettingsDataSchema = z.object({
  logoId: z.string().uuid().nullable(),
  darkLogoId: z.string().uuid().nullable(),
  logoUrl: z.string().nullable(),
  darkLogoUrl: z.string().nullable(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
});

export type BrandingSettingsData = z.infer<typeof BrandingSettingsDataSchema>;

export const BrandingSettingsSuccessSchema = z.object({
  success: z.literal(true),
  settings: BrandingSettingsDataSchema.optional(),
});

export type BrandingSettingsSuccess = z.infer<
  typeof BrandingSettingsSuccessSchema
>;
