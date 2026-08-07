import type {
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@poyino/contracts";
import { Badge } from "@poyino/ui";
import {
  priorityTone,
  statusTone,
  useSupportLabels,
} from "../lib/support-labels";

type SupportTicketBadgesProps = {
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: SupportTicketCategory;
  size?: "default" | "lg";
};

function toneToVariant(
  tone: ReturnType<typeof statusTone> | ReturnType<typeof priorityTone>,
): "neutral" | "success" | "warning" | "danger" | "info" {
  if (tone === "muted") {
    return "neutral";
  }
  return tone;
}

export function SupportTicketBadges({
  status,
  priority,
  category,
  size = "default",
}: SupportTicketBadgesProps) {
  const labels = useSupportLabels();
  const sizeClass = size === "lg" ? " is-lg" : "";

  return (
    <div className={`support-ticket-badges${sizeClass}`}>
      <Badge
        variant={toneToVariant(statusTone(status))}
        style={size === "lg" ? largeBadgeStyle : undefined}
      >
        <span
          className={`support-badge-dot is-${statusTone(status)}`}
          aria-hidden
        />
        {labels.status(status)}
      </Badge>
      <Badge
        variant={toneToVariant(priorityTone(priority))}
        style={size === "lg" ? largeBadgeStyle : undefined}
      >
        {labels.priority(priority)}
      </Badge>
      <Badge variant="info" style={size === "lg" ? largeBadgeStyle : undefined}>
        {labels.category(category)}
      </Badge>
    </div>
  );
}

const largeBadgeStyle = {
  padding: "0.35rem 0.75rem",
  fontSize: "0.82rem",
  borderRadius: "0.65rem",
  gap: "0.4rem",
} as const;
