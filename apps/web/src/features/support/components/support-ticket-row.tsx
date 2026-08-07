import type { SupportTicketListItem } from "@poyino/contracts";
import { Link } from "react-router-dom";
import { SupportTicketBadges } from "./support-ticket-badges";

type SupportTicketRowProps = {
  ticket: SupportTicketListItem;
  to: string;
  showOrganization?: boolean;
};

export function SupportTicketRow({
  ticket,
  to,
  showOrganization = false,
}: SupportTicketRowProps) {
  return (
    <Link to={to} className="support-ticket-row">
      <div className="support-ticket-row-main">
        <strong>{ticket.subject}</strong>
        <span className="support-ticket-row-meta">
          {showOrganization && ticket.organizationName
            ? `${ticket.organizationName} · `
            : null}
          {ticket.createdByEmail}
          {" · "}
          {new Date(ticket.createdAt).toLocaleString()}
        </span>
      </div>
      <SupportTicketBadges
        status={ticket.status}
        priority={ticket.priority}
        category={ticket.category}
      />
    </Link>
  );
}
