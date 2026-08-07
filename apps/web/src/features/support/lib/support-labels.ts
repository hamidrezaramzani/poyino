import type {
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@poyino/contracts";
import { useI18n } from "../../../shared/i18n/i18n-provider";

export function useSupportLabels() {
  const { t } = useI18n();

  return {
    category: (value: SupportTicketCategory) => t.support.categories[value],
    priority: (value: SupportTicketPriority) => t.support.priorities[value],
    status: (value: SupportTicketStatus) => t.support.statuses[value],
  };
}

export function statusTone(status: SupportTicketStatus) {
  switch (status) {
    case "OPEN":
      return "info";
    case "WAITING_FOR_ADMIN":
      return "warning";
    case "WAITING_FOR_CUSTOMER":
      return "info";
    case "RESOLVED":
      return "success";
    case "CLOSED":
      return "muted";
    default:
      return "neutral";
  }
}

export function priorityTone(priority: SupportTicketPriority) {
  switch (priority) {
    case "HIGH":
      return "danger";
    case "MEDIUM":
      return "warning";
    case "LOW":
      return "muted";
    default:
      return "neutral";
  }
}
