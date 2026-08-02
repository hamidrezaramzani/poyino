import { z } from "zod";
import { DashboardCandidateStatusSchema } from "../dashboard/dashboard.schema";

export const UpdateCandidateStatusSchema = z.object({
  status: DashboardCandidateStatusSchema,
});

export type UpdateCandidateStatusInput = z.infer<
  typeof UpdateCandidateStatusSchema
>;

export const UpdateCandidateStatusSuccessSchema = z.object({
  success: z.literal(true),
  status: DashboardCandidateStatusSchema,
});

export type UpdateCandidateStatusSuccess = z.infer<
  typeof UpdateCandidateStatusSuccessSchema
>;
