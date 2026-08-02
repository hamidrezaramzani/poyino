import { z } from "zod";

export const CreateCandidateNoteSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "NOTE_REQUIRED")
    .max(5000, "NOTE_TOO_LONG"),
});

export type CreateCandidateNoteInput = z.infer<
  typeof CreateCandidateNoteSchema
>;

export const UpdateCandidateNoteSchema = CreateCandidateNoteSchema;

export type UpdateCandidateNoteInput = z.infer<
  typeof UpdateCandidateNoteSchema
>;

export const CandidateNoteSchema = z.object({
  id: z.string().uuid(),
  body: z.string(),
  authorUserId: z.string().uuid(),
  authorEmail: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CandidateNote = z.infer<typeof CandidateNoteSchema>;

export const CandidateNoteSuccessSchema = z.object({
  success: z.literal(true),
  note: CandidateNoteSchema,
});

export type CandidateNoteSuccess = z.infer<typeof CandidateNoteSuccessSchema>;

export const DeleteCandidateNoteSuccessSchema = z.object({
  success: z.literal(true),
});

export type DeleteCandidateNoteSuccess = z.infer<
  typeof DeleteCandidateNoteSuccessSchema
>;
