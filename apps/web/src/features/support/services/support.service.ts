import type {
  CreateSupportTicketInput,
  CreateSupportTicketSuccess,
  GetSupportTicketSuccess,
  ListSupportTicketsQuery,
  ListSupportTicketsSuccess,
  ReplySupportTicketInput,
  SupportAdminStatsSuccess,
  SupportTicketActionSuccess,
} from "@poyino/contracts";
import { apiRequest } from "../../../shared/api/api-client";

function toQuery(params?: Partial<ListSupportTicketsQuery>) {
  const search = new URLSearchParams();
  if (!params) {
    return "";
  }
  if (params.search) search.set("search", params.search);
  if (params.status) search.set("status", params.status);
  if (params.priority) search.set("priority", params.priority);
  if (params.category) search.set("category", params.category);
  if (params.organizationId) search.set("organizationId", params.organizationId);
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  const value = search.toString();
  return value ? `?${value}` : "";
}

export function listSupportTickets(query?: Partial<ListSupportTicketsQuery>) {
  return apiRequest<ListSupportTicketsSuccess>(
    `/support/tickets${toQuery(query)}`,
  );
}

export function getSupportTicket(ticketId: string) {
  return apiRequest<GetSupportTicketSuccess>(`/support/tickets/${ticketId}`);
}

export function createSupportTicket(input: CreateSupportTicketInput) {
  return apiRequest<CreateSupportTicketSuccess>("/support/tickets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function replySupportTicket(
  ticketId: string,
  input: ReplySupportTicketInput,
) {
  return apiRequest<SupportTicketActionSuccess>(
    `/support/tickets/${ticketId}/messages`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function closeSupportTicket(ticketId: string) {
  return apiRequest<SupportTicketActionSuccess>(
    `/support/tickets/${ticketId}/close`,
    { method: "POST" },
  );
}

export function reopenSupportTicket(ticketId: string) {
  return apiRequest<SupportTicketActionSuccess>(
    `/support/tickets/${ticketId}/reopen`,
    { method: "POST" },
  );
}

export function listAdminSupportTickets(
  query?: Partial<ListSupportTicketsQuery>,
) {
  return apiRequest<ListSupportTicketsSuccess>(
    `/support/admin/tickets${toQuery(query)}`,
  );
}

export function getAdminSupportTicket(ticketId: string) {
  return apiRequest<GetSupportTicketSuccess>(
    `/support/admin/tickets/${ticketId}`,
  );
}

export function replyAdminSupportTicket(
  ticketId: string,
  input: ReplySupportTicketInput,
) {
  return apiRequest<SupportTicketActionSuccess>(
    `/support/admin/tickets/${ticketId}/messages`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function assignAdminSupportTicket(ticketId: string) {
  return apiRequest<SupportTicketActionSuccess>(
    `/support/admin/tickets/${ticketId}/assign`,
    { method: "POST" },
  );
}

export function resolveAdminSupportTicket(ticketId: string) {
  return apiRequest<SupportTicketActionSuccess>(
    `/support/admin/tickets/${ticketId}/resolve`,
    { method: "POST" },
  );
}

export function closeAdminSupportTicket(ticketId: string) {
  return apiRequest<SupportTicketActionSuccess>(
    `/support/admin/tickets/${ticketId}/close`,
    { method: "POST" },
  );
}

export function reopenAdminSupportTicket(ticketId: string) {
  return apiRequest<SupportTicketActionSuccess>(
    `/support/admin/tickets/${ticketId}/reopen`,
    { method: "POST" },
  );
}

export function fetchAdminSupportStats() {
  return apiRequest<SupportAdminStatsSuccess>("/support/admin/stats");
}
