import type { SupportTicketDetails } from "@poyino/contracts";
import { Button, Skeleton } from "@poyino/ui";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { SupportConversation } from "../components/support-conversation";
import {
  assignAdminSupportTicket,
  closeAdminSupportTicket,
  getAdminSupportTicket,
  reopenAdminSupportTicket,
  replyAdminSupportTicket,
  resolveAdminSupportTicket,
} from "../services/support.service";

export function AdminSupportTicketDetailsPage() {
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
      const response = await getAdminSupportTicket(ticketId);
      setTicket(response.ticket);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [ticketId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(
    action: () => Promise<{ ticket: SupportTicketDetails }>,
  ) {
    setActionBusy(true);
    try {
      const response = await action();
      setTicket(response.ticket);
    } finally {
      setActionBusy(false);
    }
  }

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
          to="/admin/support"
          className="poyino-button poyino-button--primary"
        >
          {t.support.backToAdmin}
        </Link>
      </div>
    );
  }

  return (
    <div className="support-page support-admin-page">
      <div className="support-back-row">
        <Link
          to="/admin/support"
          className="poyino-button poyino-button--secondary"
        >
          {t.support.backToAdmin}
        </Link>
      </div>
      <SupportConversation
        ticket={ticket}
        replyPlaceholder={t.support.adminReplyPlaceholder}
        canReply={ticket.status !== "CLOSED"}
        onReply={async (message) => {
          const response = await replyAdminSupportTicket(ticket.id, {
            message,
          });
          setTicket(response.ticket);
        }}
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              disabled={actionBusy}
              onClick={() =>
                void runAction(() => assignAdminSupportTicket(ticket.id))
              }
            >
              {t.support.assignToMe}
            </Button>
            {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" ? (
              <Button
                type="button"
                variant="secondary"
                disabled={actionBusy}
                onClick={() =>
                  void runAction(() => resolveAdminSupportTicket(ticket.id))
                }
              >
                {t.support.resolveTicket}
              </Button>
            ) : null}
            {ticket.status !== "CLOSED" ? (
              <Button
                type="button"
                variant="secondary"
                disabled={actionBusy}
                onClick={() =>
                  void runAction(() => closeAdminSupportTicket(ticket.id))
                }
              >
                {t.support.closeTicket}
              </Button>
            ) : null}
            {ticket.status === "CLOSED" || ticket.status === "RESOLVED" ? (
              <Button
                type="button"
                variant="secondary"
                disabled={actionBusy}
                onClick={() =>
                  void runAction(() => reopenAdminSupportTicket(ticket.id))
                }
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
