import type {
  DashboardCandidateStatus,
  ListCandidatesPagination,
  ListCandidatesSortBy,
  ListCandidatesSortOrder,
  OrgCandidateListItem,
} from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import { ApiRequestError, fetchOrgCandidates } from "../services/candidates.service";

const DEFAULT_PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

export function useOrgCandidates() {
  const { t } = useI18n();
  const { push } = useToast();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DashboardCandidateStatus | "">("");
  const [sortBy, setSortBy] = useState<ListCandidatesSortBy>("appliedAt");
  const [sortOrder, setSortOrder] = useState<ListCandidatesSortOrder>("desc");
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<OrgCandidateListItem[]>([]);
  const [pagination, setPagination] = useState<ListCandidatesPagination>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 0,
    totalPages: 0,
  });
  const [loadStatus, setLoadStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoadStatus("loading");
    try {
      const response = await fetchOrgCandidates({
        search,
        status: status || undefined,
        sortBy,
        sortOrder,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      setItems(response.items);
      setPagination(response.pagination);
      setLoadStatus("success");
    } catch (error) {
      setItems([]);
      setLoadStatus("error");
      push(
        error instanceof ApiRequestError
          ? error.message || t.candidates.org.errors.unexpected
          : t.candidates.org.errors.unexpected,
        "error",
      );
    }
  }, [page, push, search, sortBy, sortOrder, status, t.candidates.org.errors.unexpected]);

  useEffect(() => {
    void load();
  }, [load]);

  const changeSort = useCallback(
    (nextSortBy: string, nextSortOrder: ListCandidatesSortOrder) => {
      const allowed: ListCandidatesSortBy[] = ["aiScore", "appliedAt", "fullName"];
      if (!allowed.includes(nextSortBy as ListCandidatesSortBy)) {
        return;
      }
      setSortBy(nextSortBy as ListCandidatesSortBy);
      setSortOrder(nextSortOrder);
      setPage(1);
    },
    [],
  );

  const changePage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const changeStatus = useCallback((value: DashboardCandidateStatus | "") => {
    setStatus(value);
    setPage(1);
  }, []);

  return {
    items,
    pagination,
    sortBy,
    sortOrder,
    status: loadStatus,
    searchInput,
    filters: { status },
    setSearchInput,
    changeSort,
    changePage,
    changeStatus,
    retry: load,
  };
}
