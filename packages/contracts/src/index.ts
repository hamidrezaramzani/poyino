import { z } from "zod";

export * from "./authentication/register.schema";
export * from "./authentication/login.schema";
export * from "./authentication/forgot-password.schema";
export * from "./authentication/reset-password.schema";
export * from "./authentication/session.schema";
export * from "./dashboard/dashboard.schema";
export * from "./settings/general.schema";
export * from "./settings/profile.schema";
export * from "./settings/branding.schema";
export * from "./settings/notification.schema";
export * from "./settings/change-password.schema";
export * from "./settings/file.schema";
export * from "./jobs/create-job.schema";
export * from "./public-job/public-job.schema";
export * from "./public-job/apply.schema";
export * from "./public-job/tracking.schema";

export const organizationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(120),
});

export type Organization = z.infer<typeof organizationSchema>;
