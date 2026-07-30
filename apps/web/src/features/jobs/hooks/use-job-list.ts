import type {
  JobListItem,
  ListJobsSortBy,
  ListJobsSortOrder,
  ListJobsPagination,
} from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import { ApiRequestError, fetchJobs } from "../services/jobs.service";

const DEFAULT_PAGE_SIZE = 10;

export function useJobList() {
  const { t } = useI18n();
  const { push } = useToast();
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [pagination, setPagination] = useState<ListJobsPagination>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 0,
    totalPages: 0,
  });
  const [sortBy, setSortBy] = useState<ListJobsSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<ListJobsSortOrder>("desc");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetchJobs({
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        sortBy,
        sortOrder,
      });
      setJobs(response.jobs);
      setPagination(response.pagination);
      setStatus("success");
    } catch (error) {
      setJobs([]);
      setStatus("error");
      push(
        error instanceof ApiRequestError
          ? error.message || t.jobs.list.errors.unexpected
          : t.jobs.list.errors.unexpected,
        "error",
      );
    }
  }, [page, push, sortBy, sortOrder, t.jobs.list.errors.unexpected]);

  useEffect(() => {
    void load();
  }, [load]);

  const changeSort = useCallback(
    (nextSortBy: string, nextSortOrder: ListJobsSortOrder) => {
      const allowed: ListJobsSortBy[] = [
        "createdAt",
        "title",
        "candidateCount",
        "status",
      ];
      if (!allowed.includes(nextSortBy as ListJobsSortBy)) {
        return;
      }
      setSortBy(nextSortBy as ListJobsSortBy);
      setSortOrder(nextSortOrder);
      setPage(1);
    },
    [],
  );

  const changePage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  return {
    jobs,
    pagination,
    sortBy,
    sortOrder,
    status,
    changeSort,
    changePage,
    retry: load,
  };
}
