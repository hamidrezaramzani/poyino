import { z } from "zod";

export const UploadFileSchema = z.object({
  fileName: z.string().trim().min(1, "FILE_NAME_REQUIRED").max(255),
  mimeType: z.enum(["image/png", "image/jpeg", "image/svg+xml"], {
    message: "FILE_INVALID_TYPE",
  }),
  contentBase64: z.string().min(1, "FILE_REQUIRED"),
});

export type UploadFileInput = z.infer<typeof UploadFileSchema>;

export const UploadedFileSchema = z.object({
  id: z.string().uuid(),
  url: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().int().nonnegative(),
});

export type UploadedFile = z.infer<typeof UploadedFileSchema>;

export const UploadFileSuccessSchema = z.object({
  success: z.literal(true),
  file: UploadedFileSchema,
});

export type UploadFileSuccess = z.infer<typeof UploadFileSuccessSchema>;

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
