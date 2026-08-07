import type {
  ListSupportTicketsQuery,
  SupportTicketListItem,
} from "@poyino/contracts";
import { Button, EmptyState, Input, Select, Skeleton } from "@poyino/ui";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { SupportTicketRow } from "../components/support-ticket-row";
import { listAdminSupportTickets } from "../services/support.service";

export function AdminSupportInboxPage() {
  const { t } = useI18n();
  const [tickets, setTickets] = useState<SupportTicketListItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [filters, setFilters] = useState<Partial<ListSupportTicketsQuery>>({
    page: 1,
    pageSize: 20,
  });

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await listAdminSupportTickets(filters);
      setTickets(response.tickets);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [filters]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="support-page support-admin-page">
      <header className="support-page-header">
        <div>
          <h1>{t.support.adminTitle}</h1>
          <p>{t.support.adminDescription}</p>
        </div>
      </header>

      <div className="support-filters support-admin-filters">
        <Input
          placeholder={t.support.searchPlaceholder}
          value={filters.search ?? ""}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              search: event.target.value || undefined,
              page: 1,
            }))
          }
        />
        <Select
          value={filters.status ?? ""}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              status: (event.target.value || undefined) as
                | ListSupportTicketsQuery["status"]
                | undefined,
              page: 1,
            }))
          }
          options={[
            { value: "", label: t.support.allStatuses },
            ...Object.entries(t.support.statuses).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <Select
          value={filters.priority ?? ""}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              priority: (event.target.value || undefined) as
                | ListSupportTicketsQuery["priority"]
                | undefined,
              page: 1,
            }))
          }
          options={[
            { value: "", label: t.support.allPriorities },
            ...Object.entries(t.support.priorities).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <Select
          value={filters.category ?? ""}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              category: (event.target.value || undefined) as
                | ListSupportTicketsQuery["category"]
                | undefined,
              page: 1,
            }))
          }
          options={[
            { value: "", label: t.support.allCategories },
            ...Object.entries(t.support.categories).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
      </div>

      {status === "loading" ? (
        <div className="support-ticket-list">
          <Skeleton height="4rem" />
          <Skeleton height="4rem" />
          <Skeleton height="4rem" />
        </div>
      ) : null}

      {status === "error" ? (
        <EmptyState
          title={t.support.loadFailed}
          description={t.support.loadFailedDescription}
        >
          <Button type="button" onClick={() => void load()}>
            {t.support.retry}
          </Button>
        </EmptyState>
      ) : null}

      {status === "ready" && tickets.length === 0 ? (
        <EmptyState
          title={t.support.adminEmptyTitle}
          description={t.support.adminEmptyDescription}
        />
      ) : null}

      {status === "ready" && tickets.length > 0 ? (
        <div className="support-ticket-list">
          {tickets.map((ticket) => (
            <SupportTicketRow
              key={ticket.id}
              ticket={ticket}
              showOrganization
              to={`/admin/support/${ticket.id}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
