import type {
  CandidateExperienceLevel,
  CandidateListItem,
  CandidateListStats,
  DashboardCandidateStatus,
  ListCandidatesDateRange,
  ListCandidatesPagination,
  ListCandidatesSortBy,
  ListCandidatesSortOrder,
} from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import { ApiRequestError, fetchCandidates } from "../services/candidates.service";

const DEFAULT_PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

export function useCandidateList() {
  const { t } = useI18n();
  const { push } = useToast();
  const { jobId = "" } = useParams<{ jobId: string }>();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DashboardCandidateStatus | "">("");
  const [experienceLevel, setExperienceLevel] = useState<
    CandidateExperienceLevel | ""
  >("");
  const [education, setEducation] = useState("");
  const [dateRange, setDateRange] = useState<ListCandidatesDateRange | "">("");
  const [sortBy, setSortBy] = useState<ListCandidatesSortBy>("aiScore");
  const [sortOrder, setSortOrder] = useState<ListCandidatesSortOrder>("desc");
  const [page, setPage] = useState(1);

  const [jobTitle, setJobTitle] = useState("");
  const [items, setItems] = useState<CandidateListItem[]>([]);
  const [stats, setStats] = useState<CandidateListStats | null>(null);
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
    if (!jobId) {
      return;
    }

    setLoadStatus("loading");
    try {
      const response = await fetchCandidates(jobId, {
        search,
        status: status || undefined,
        experienceLevel: experienceLevel || undefined,
        education: education || undefined,
        dateRange: dateRange || undefined,
        sortBy,
        sortOrder,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      });
      setJobTitle(response.job.title);
      setItems(response.items);
      setStats(response.stats);
      setPagination(response.pagination);
      setLoadStatus("success");
    } catch (error) {
      setItems([]);
      setStats(null);
      setLoadStatus("error");
      push(
        error instanceof ApiRequestError
          ? error.message || t.candidates.list.errors.unexpected
          : t.candidates.list.errors.unexpected,
        "error",
      );
    }
  }, [
    dateRange,
    education,
    experienceLevel,
    jobId,
    page,
    push,
    search,
    sortBy,
    sortOrder,
    status,
    t.candidates.list.errors.unexpected,
  ]);

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

  const changeExperienceLevel = useCallback(
    (value: CandidateExperienceLevel | "") => {
      setExperienceLevel(value);
      setPage(1);
    },
    [],
  );

  const changeEducation = useCallback((value: string) => {
    setEducation(value);
    setPage(1);
  }, []);

  const changeDateRange = useCallback((value: ListCandidatesDateRange | "") => {
    setDateRange(value);
    setPage(1);
  }, []);

  return {
    jobId,
    jobTitle,
    items,
    stats,
    pagination,
    sortBy,
    sortOrder,
    status: loadStatus,
    searchInput,
    filters: { status, experienceLevel, education, dateRange },
    setSearchInput,
    changeSort,
    changePage,
    changeStatus,
    changeExperienceLevel,
    changeEducation,
    changeDateRange,
    retry: load,
  };
}
