import type { SupportMessage, SupportTicketDetails } from "@poyino/contracts";
import { Button, Textarea } from "@poyino/ui";
import { useState, type FormEvent, type ReactNode } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { SupportTicketBadges } from "./support-ticket-badges";

type SupportConversationProps = {
  ticket: SupportTicketDetails;
  replyPlaceholder: string;
  onReply: (message: string) => Promise<void>;
  canReply: boolean;
  actions?: ReactNode;
};

export function SupportConversation({
  ticket,
  replyPlaceholder,
  onReply,
  canReply,
  actions,
}: SupportConversationProps) {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onReply(message.trim());
      setMessage("");
    } catch {
      setError(t.support.replyFailed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="support-conversation">
      <header className="support-conversation-header">
        <div>
          <h1>{ticket.subject}</h1>
          <p className="support-conversation-meta">
            {ticket.organizationName ? `${ticket.organizationName} · ` : null}
            {ticket.createdByEmail}
            {" · "}
            {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>
        <SupportTicketBadges
          status={ticket.status}
          priority={ticket.priority}
          category={ticket.category}
          size="lg"
        />
      </header>

      {actions ? (
        <div className="support-conversation-actions">{actions}</div>
      ) : null}

      <div className="support-message-list" role="log" aria-live="polite">
        {ticket.messages.map((item) => (
          <SupportMessageBubble key={item.id} message={item} />
        ))}
      </div>

      {canReply ? (
        <form className="support-reply-form" onSubmit={handleSubmit}>
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={replyPlaceholder}
            rows={4}
            disabled={submitting}
          />
          {error ? <p className="support-error">{error}</p> : null}
          <div className="support-reply-form-actions">
            <Button type="submit" disabled={submitting || !message.trim()}>
              {submitting ? t.support.sending : t.support.sendReply}
            </Button>
          </div>
        </form>
      ) : (
        <p className="support-reply-disabled">{t.support.repliesDisabled}</p>
      )}
    </div>
  );
}

function SupportMessageBubble({ message }: { message: SupportMessage }) {
  const { t } = useI18n();
  const isAdmin = message.authorType === "PLATFORM_ADMIN";

  return (
    <article
      className={`support-message${isAdmin ? " is-admin" : " is-customer"}`}
    >
      <header>
        <strong>
          {isAdmin
            ? t.support.adminAuthor
            : (message.authorEmail ?? t.support.customerAuthor)}
        </strong>
        <time dateTime={message.createdAt}>
          {new Date(message.createdAt).toLocaleString()}
        </time>
      </header>
      <p>{message.content}</p>
      {message.attachments.length > 0 ? (
        <ul className="support-attachments">
          {message.attachments.map((attachment) => (
            <li key={attachment.id}>
              {attachment.url ? (
                <a href={attachment.url} target="_blank" rel="noreferrer">
                  {attachment.fileName}
                </a>
              ) : (
                attachment.fileName
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
