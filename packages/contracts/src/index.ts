import { z } from "zod";

export const organizationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(120),
});

export const createJobSchema = z.object({
  title: z.string().min(3).max(160),
  location: z.string().min(2).max(120),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"]),
  description: z.string().min(20),
});

export type Organization = z.infer<typeof organizationSchema>;
export type CreateJob = z.infer<typeof createJobSchema>;
