import type {
  CreateSupportTicketInput,
  SupportTicketCategory,
  SupportTicketPriority,
} from "@poyino/contracts";
import { Button, Input, Select, Textarea } from "@poyino/ui";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { createSupportTicket } from "../services/support.service";

export function CreateSupportTicketPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [category, setCategory] =
    useState<SupportTicketCategory>("GENERAL");
  const [priority, setPriority] =
    useState<SupportTicketPriority>("MEDIUM");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const input: CreateSupportTicketInput = {
      subject: subject.trim(),
      category,
      priority,
      message: message.trim(),
    };
    try {
      const response = await createSupportTicket(input);
      navigate(`/dashboard/support/${response.ticket.id}`);
    } catch {
      setError(t.support.createFailed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="support-page">
      <header className="support-page-header">
        <div>
          <h1>{t.support.createTitle}</h1>
          <p>{t.support.createDescription}</p>
        </div>
        <Link
          to="/dashboard/support"
          className="poyino-button poyino-button--secondary"
        >
          {t.support.backToInbox}
        </Link>
      </header>

      <form className="support-create-form" onSubmit={handleSubmit}>
        <label className="support-field">
          <span>{t.support.fields.subject}</span>
          <Input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
            minLength={3}
            maxLength={200}
          />
        </label>

        <div className="support-field-row">
          <label className="support-field">
            <span>{t.support.fields.category}</span>
            <Select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as SupportTicketCategory)
              }
              options={Object.entries(t.support.categories).map(
                ([value, label]) => ({ value, label }),
              )}
            />
          </label>

          <label className="support-field">
            <span>{t.support.fields.priority}</span>
            <Select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as SupportTicketPriority)
              }
              options={Object.entries(t.support.priorities).map(
                ([value, label]) => ({ value, label }),
              )}
            />
          </label>
        </div>

        <label className="support-field">
          <span>{t.support.fields.message}</span>
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            rows={8}
            maxLength={10_000}
          />
        </label>

        {error ? <p className="support-error">{error}</p> : null}

        <div className="support-create-actions">
          <Button type="submit" disabled={submitting}>
            {submitting ? t.support.creating : t.support.submitTicket}
          </Button>
        </div>
      </form>
    </div>
  );
}
