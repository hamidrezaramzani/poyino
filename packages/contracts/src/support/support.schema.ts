import { z } from "zod";

export const PlatformRoleSchema = z.enum(["NONE", "PLATFORM_ADMIN"]);

export type PlatformRole = z.infer<typeof PlatformRoleSchema>;

export const PlatformRole = PlatformRoleSchema.enum;

export function isPlatformAdmin(platformRole: PlatformRole | null | undefined) {
  return platformRole === "PLATFORM_ADMIN";
}

export const SupportTicketCategorySchema = z.enum([
  "GENERAL",
  "BUG_REPORT",
  "FEATURE_REQUEST",
  "BILLING",
  "AI",
  "OTHER",
]);

export type SupportTicketCategory = z.infer<typeof SupportTicketCategorySchema>;

export const SupportTicketCategory = SupportTicketCategorySchema.enum;

export const SupportTicketPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export type SupportTicketPriority = z.infer<typeof SupportTicketPrioritySchema>;

export const SupportTicketPriority = SupportTicketPrioritySchema.enum;

export const SupportTicketStatusSchema = z.enum([
  "OPEN",
  "WAITING_FOR_ADMIN",
  "WAITING_FOR_CUSTOMER",
  "RESOLVED",
  "CLOSED",
]);

export type SupportTicketStatus = z.infer<typeof SupportTicketStatusSchema>;

export const SupportTicketStatus = SupportTicketStatusSchema.enum;

export const SupportMessageAuthorTypeSchema = z.enum([
  "CUSTOMER",
  "PLATFORM_ADMIN",
  "SYSTEM",
]);

export type SupportMessageAuthorType = z.infer<
  typeof SupportMessageAuthorTypeSchema
>;

export const SupportAttachmentInputSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .refine(
      (value) =>
        value.startsWith("image/") ||
        value === "application/pdf" ||
        value === "text/plain" ||
        value ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        value === "application/msword",
      "ATTACHMENT_INVALID_TYPE",
    ),
  contentBase64: z.string().min(1).max(8_000_000),
});

export type SupportAttachmentInput = z.infer<
  typeof SupportAttachmentInputSchema
>;

export const SupportAttachmentSchema = z.object({
  id: z.string().uuid(),
  fileId: z.string().uuid(),
  fileName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  url: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export type SupportAttachment = z.infer<typeof SupportAttachmentSchema>;

export const SupportMessageSchema = z.object({
  id: z.string().uuid(),
  authorType: SupportMessageAuthorTypeSchema,
  authorUserId: z.string().uuid().nullable(),
  authorEmail: z.string().nullable(),
  content: z.string(),
  isInternal: z.boolean(),
  createdAt: z.string().datetime(),
  attachments: z.array(SupportAttachmentSchema),
});

export type SupportMessage = z.infer<typeof SupportMessageSchema>;

export const SupportTicketListItemSchema = z.object({
  id: z.string().uuid(),
  subject: z.string(),
  category: SupportTicketCategorySchema,
  priority: SupportTicketPrioritySchema,
  status: SupportTicketStatusSchema,
  organizationId: z.string().uuid(),
  organizationName: z.string().optional(),
  createdByUserId: z.string().uuid(),
  createdByEmail: z.string(),
  assignedToUserId: z.string().uuid().nullable(),
  assignedToEmail: z.string().nullable().optional(),
  lastMessageAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  messageCount: z.number().int().nonnegative().optional(),
});

export type SupportTicketListItem = z.infer<typeof SupportTicketListItemSchema>;

export const SupportTicketDetailsSchema = SupportTicketListItemSchema.extend({
  firstResponseAt: z.string().datetime().nullable(),
  resolvedAt: z.string().datetime().nullable(),
  closedAt: z.string().datetime().nullable(),
  messages: z.array(SupportMessageSchema),
});

export type SupportTicketDetails = z.infer<typeof SupportTicketDetailsSchema>;

export const CreateSupportTicketSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(3, "SUBJECT_REQUIRED")
    .max(200, "SUBJECT_TOO_LONG"),
  category: SupportTicketCategorySchema,
  priority: SupportTicketPrioritySchema.default("MEDIUM"),
  message: z
    .string()
    .trim()
    .min(1, "MESSAGE_REQUIRED")
    .max(10_000, "MESSAGE_TOO_LONG"),
  attachments: z.array(SupportAttachmentInputSchema).max(5).optional(),
});

export type CreateSupportTicketInput = z.infer<typeof CreateSupportTicketSchema>;

export const ReplySupportTicketSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "MESSAGE_REQUIRED")
    .max(10_000, "MESSAGE_TOO_LONG"),
  attachments: z.array(SupportAttachmentInputSchema).max(5).optional(),
});

export type ReplySupportTicketInput = z.infer<typeof ReplySupportTicketSchema>;

export const ListSupportTicketsQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  status: SupportTicketStatusSchema.optional(),
  priority: SupportTicketPrioritySchema.optional(),
  category: SupportTicketCategorySchema.optional(),
  organizationId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListSupportTicketsQuery = z.infer<
  typeof ListSupportTicketsQuerySchema
>;

export const CreateSupportTicketSuccessSchema = z.object({
  success: z.literal(true),
  ticket: SupportTicketDetailsSchema,
});

export type CreateSupportTicketSuccess = z.infer<
  typeof CreateSupportTicketSuccessSchema
>;

export const ListSupportTicketsSuccessSchema = z.object({
  success: z.literal(true),
  tickets: z.array(SupportTicketListItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
});

export type ListSupportTicketsSuccess = z.infer<
  typeof ListSupportTicketsSuccessSchema
>;

export const GetSupportTicketSuccessSchema = z.object({
  success: z.literal(true),
  ticket: SupportTicketDetailsSchema,
});

export type GetSupportTicketSuccess = z.infer<
  typeof GetSupportTicketSuccessSchema
>;

export const SupportTicketActionSuccessSchema = z.object({
  success: z.literal(true),
  ticket: SupportTicketDetailsSchema,
});

export type SupportTicketActionSuccess = z.infer<
  typeof SupportTicketActionSuccessSchema
>;

export const SupportAdminStatsSchema = z.object({
  openTickets: z.number().int().nonnegative(),
  waitingForReply: z.number().int().nonnegative(),
  resolvedToday: z.number().int().nonnegative(),
  averageResponseTimeMinutes: z.number().nonnegative().nullable(),
});

export type SupportAdminStats = z.infer<typeof SupportAdminStatsSchema>;

export const SupportAdminStatsSuccessSchema = z.object({
  success: z.literal(true),
  stats: SupportAdminStatsSchema,
});

export type SupportAdminStatsSuccess = z.infer<
  typeof SupportAdminStatsSuccessSchema
>;

export const SupportOrgStatsSchema = z.object({
  openTickets: z.number().int().nonnegative(),
  resolvedTickets: z.number().int().nonnegative(),
  latestReplyAt: z.string().datetime().nullable(),
});

export type SupportOrgStats = z.infer<typeof SupportOrgStatsSchema>;

export const SupportErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  TICKET_CLOSED: "TICKET_CLOSED",
  INVALID_STATUS: "INVALID_STATUS",
  ATTACHMENT_TOO_LARGE: "ATTACHMENT_TOO_LARGE",
  ATTACHMENT_INVALID_TYPE: "ATTACHMENT_INVALID_TYPE",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
} as const;

export type SupportErrorCode =
  (typeof SupportErrorCode)[keyof typeof SupportErrorCode];

export const MAX_SUPPORT_ATTACHMENT_BYTES = 5 * 1024 * 1024;
