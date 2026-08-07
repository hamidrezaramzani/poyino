-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('NONE', 'PLATFORM_ADMIN');

-- CreateEnum
CREATE TYPE "SupportTicketCategory" AS ENUM (
  'GENERAL',
  'BUG_REPORT',
  'FEATURE_REQUEST',
  'BILLING',
  'AI',
  'OTHER'
);

-- CreateEnum
CREATE TYPE "SupportTicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM (
  'OPEN',
  'WAITING_FOR_ADMIN',
  'WAITING_FOR_CUSTOMER',
  'RESOLVED',
  'CLOSED'
);

-- CreateEnum
CREATE TYPE "SupportMessageAuthorType" AS ENUM (
  'CUSTOMER',
  'PLATFORM_ADMIN',
  'SYSTEM'
);

-- CreateEnum
CREATE TYPE "SupportAuditAction" AS ENUM (
  'TICKET_CREATED',
  'TICKET_REPLIED',
  'STATUS_CHANGED',
  'RESOLVED',
  'CLOSED',
  'REOPENED',
  'ASSIGNED'
);

-- AlterTable
ALTER TABLE "users"
  ADD COLUMN "platform_role" "PlatformRole" NOT NULL DEFAULT 'NONE';

-- CreateIndex
CREATE INDEX "users_platform_role_idx" ON "users"("platform_role");

-- CreateTable
CREATE TABLE "support_tickets" (
  "id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "created_by_user_id" UUID NOT NULL,
  "assigned_to_user_id" UUID,
  "subject" VARCHAR(200) NOT NULL,
  "category" "SupportTicketCategory" NOT NULL,
  "priority" "SupportTicketPriority" NOT NULL DEFAULT 'MEDIUM',
  "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
  "first_response_at" TIMESTAMP(3),
  "resolved_at" TIMESTAMP(3),
  "closed_at" TIMESTAMP(3),
  "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_messages" (
  "id" UUID NOT NULL,
  "ticket_id" UUID NOT NULL,
  "author_user_id" UUID,
  "author_type" "SupportMessageAuthorType" NOT NULL,
  "content" TEXT NOT NULL,
  "is_internal" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_attachments" (
  "id" UUID NOT NULL,
  "ticket_id" UUID NOT NULL,
  "message_id" UUID,
  "file_id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "support_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_audit_events" (
  "id" UUID NOT NULL,
  "ticket_id" UUID NOT NULL,
  "actor_user_id" UUID,
  "action" "SupportAuditAction" NOT NULL,
  "from_status" "SupportTicketStatus",
  "to_status" "SupportTicketStatus",
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "support_audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "support_tickets_organization_id_created_at_idx" ON "support_tickets"("organization_id", "created_at");

-- CreateIndex
CREATE INDEX "support_tickets_organization_id_status_idx" ON "support_tickets"("organization_id", "status");

-- CreateIndex
CREATE INDEX "support_tickets_status_priority_created_at_idx" ON "support_tickets"("status", "priority", "created_at");

-- CreateIndex
CREATE INDEX "support_tickets_assigned_to_user_id_idx" ON "support_tickets"("assigned_to_user_id");

-- CreateIndex
CREATE INDEX "support_tickets_last_message_at_idx" ON "support_tickets"("last_message_at");

-- CreateIndex
CREATE INDEX "support_messages_ticket_id_created_at_idx" ON "support_messages"("ticket_id", "created_at");

-- CreateIndex
CREATE INDEX "support_messages_author_user_id_idx" ON "support_messages"("author_user_id");

-- CreateIndex
CREATE INDEX "support_attachments_ticket_id_idx" ON "support_attachments"("ticket_id");

-- CreateIndex
CREATE INDEX "support_attachments_message_id_idx" ON "support_attachments"("message_id");

-- CreateIndex
CREATE INDEX "support_attachments_file_id_idx" ON "support_attachments"("file_id");

-- CreateIndex
CREATE INDEX "support_audit_events_ticket_id_created_at_idx" ON "support_audit_events"("ticket_id", "created_at");

-- CreateIndex
CREATE INDEX "support_audit_events_actor_user_id_idx" ON "support_audit_events"("actor_user_id");

-- AddForeignKey
ALTER TABLE "support_tickets"
  ADD CONSTRAINT "support_tickets_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets"
  ADD CONSTRAINT "support_tickets_created_by_user_id_fkey"
  FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets"
  ADD CONSTRAINT "support_tickets_assigned_to_user_id_fkey"
  FOREIGN KEY ("assigned_to_user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages"
  ADD CONSTRAINT "support_messages_ticket_id_fkey"
  FOREIGN KEY ("ticket_id") REFERENCES "support_tickets"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages"
  ADD CONSTRAINT "support_messages_author_user_id_fkey"
  FOREIGN KEY ("author_user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_attachments"
  ADD CONSTRAINT "support_attachments_ticket_id_fkey"
  FOREIGN KEY ("ticket_id") REFERENCES "support_tickets"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_attachments"
  ADD CONSTRAINT "support_attachments_message_id_fkey"
  FOREIGN KEY ("message_id") REFERENCES "support_messages"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_attachments"
  ADD CONSTRAINT "support_attachments_file_id_fkey"
  FOREIGN KEY ("file_id") REFERENCES "stored_files"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_audit_events"
  ADD CONSTRAINT "support_audit_events_ticket_id_fkey"
  FOREIGN KEY ("ticket_id") REFERENCES "support_tickets"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_audit_events"
  ADD CONSTRAINT "support_audit_events_actor_user_id_fkey"
  FOREIGN KEY ("actor_user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
