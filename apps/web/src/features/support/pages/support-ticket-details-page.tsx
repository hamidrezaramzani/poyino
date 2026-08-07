import type { SupportTicketDetails } from "@poyino/contracts";
import { Button, Skeleton } from "@poyino/ui";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { SupportConversation } from "../components/support-conversation";
import {
  closeSupportTicket,
  getSupportTicket,
  reopenSupportTicket,
  replySupportTicket,
} from "../services/support.service";

export function SupportTicketDetailsPage() {
  const { t } = useI18n();
  const { ticketId = "" } = useParams();
  const [ticket, setTicket] = useState<SupportTicketDetails | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [actionBusy, setActionBusy] = useState(false);

  const load = useCallback(async () => {
    if (!ticketId) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const response = await getSupportTicket(ticketId);
      setTicket(response.ticket);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [ticketId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === "loading") {
    return (
      <div className="support-page">
        <Skeleton height="2rem" />
        <Skeleton height="16rem" />
      </div>
    );
  }

  if (status === "error" || !ticket) {
    return (
      <div className="support-page">
        <p className="support-error">{t.support.loadFailed}</p>
        <Link
          to="/dashboard/support"
          className="poyino-button poyino-button--primary"
        >
          {t.support.backToInbox}
        </Link>
      </div>
    );
  }

  const canReply = ticket.status !== "CLOSED";

  return (
    <div className="support-page">
      <div className="support-back-row">
        <Link
          to="/dashboard/support"
          className="poyino-button poyino-button--secondary"
        >
          {t.support.backToInbox}
        </Link>
      </div>
      <SupportConversation
        ticket={ticket}
        replyPlaceholder={t.support.replyPlaceholder}
        canReply={canReply}
        onReply={async (message) => {
          const response = await replySupportTicket(ticket.id, { message });
          setTicket(response.ticket);
        }}
        actions={
          <>
            {ticket.status !== "CLOSED" && ticket.status !== "RESOLVED" ? (
              <Button
                type="button"
                variant="secondary"
                disabled={actionBusy}
                onClick={() => {
                  setActionBusy(true);
                  void closeSupportTicket(ticket.id)
                    .then((response) => setTicket(response.ticket))
                    .finally(() => setActionBusy(false));
                }}
              >
                {t.support.closeTicket}
              </Button>
            ) : null}
            {ticket.status === "CLOSED" || ticket.status === "RESOLVED" ? (
              <Button
                type="button"
                variant="secondary"
                disabled={actionBusy}
                onClick={() => {
                  setActionBusy(true);
                  void reopenSupportTicket(ticket.id)
                    .then((response) => setTicket(response.ticket))
                    .finally(() => setActionBusy(false));
                }}
              >
                {t.support.reopenTicket}
              </Button>
            ) : null}
          </>
        }
      />
    </div>
  );
}
