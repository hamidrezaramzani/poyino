import type {
  CalendarInterviewEvent,
  InterviewStatus,
  InterviewType,
} from "@poyino/contracts";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Select,
  Skeleton,
  SkeletonText,
} from "@poyino/ui";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { ApiRequestError } from "../../../shared/api/api-client";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import {
  fetchCalendarInterviews,
  fetchInterviewRecruiters,
  updateInterviewStatus,
  type RecruiterOption,
} from "../services/interviews.service";

type CalendarView = "month" | "week" | "day";

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function startOfWeek(date: Date) {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
}

function endOfWeek(date: Date) {
  return endOfDay(addDays(startOfWeek(date), 6));
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function rangeForView(anchor: Date, view: CalendarView) {
  if (view === "day") {
    return { from: startOfDay(anchor), to: endOfDay(anchor) };
  }
  if (view === "week") {
    const from = startOfWeek(anchor);
    return { from, to: endOfWeek(anchor) };
  }
  const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const monthEnd = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  return {
    from: startOfWeek(monthStart),
    to: endOfWeek(monthEnd),
  };
}

function buildDays(from: Date, to: Date) {
  const list: Date[] = [];
  let cursor = startOfDay(from);
  const end = startOfDay(to);
  while (cursor <= end) {
    list.push(new Date(cursor));
    cursor = addDays(cursor, 1);
    if (list.length > 42) break;
  }
  return list;
}

function weekdayLabels(locale: string) {
  const monday = startOfWeek(new Date());
  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
      weekday: "short",
    }).format(addDays(monday, index)),
  );
}

function statusClass(status: InterviewStatus) {
  return `interview-cal-event status-${status.toLowerCase()}`;
}

function formatTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDayLabel(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatMonthTitle(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDayNumber(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    day: "numeric",
  }).format(date);
}

export function InterviewCalendarPage() {
  const { t, locale } = useI18n();
  const { push } = useToast();
  const [view, setView] = useState<CalendarView>("month");
  const [anchor, setAnchor] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarInterviewEvent[]>([]);
  const [today, setToday] = useState<CalendarInterviewEvent[]>([]);
  const [upcoming, setUpcoming] = useState<CalendarInterviewEvent[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [recruiters, setRecruiters] = useState<RecruiterOption[]>([]);
  const [recruiterUserId, setRecruiterUserId] = useState("");
  const [type, setType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<CalendarInterviewEvent | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const range = useMemo(() => rangeForView(anchor, view), [anchor, view]);
  const todayDate = useMemo(() => startOfDay(new Date()), []);
  const weekdays = useMemo(() => weekdayLabels(locale), [locale]);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [calendar, recruiterResponse] = await Promise.all([
        fetchCalendarInterviews({
          from: range.from.toISOString(),
          to: range.to.toISOString(),
          recruiterUserId: recruiterUserId || undefined,
          type: (type || undefined) as InterviewType | undefined,
          status: (statusFilter || undefined) as InterviewStatus | undefined,
        }),
        fetchInterviewRecruiters(),
      ]);
      setEvents(calendar.events);
      setToday(calendar.today);
      setUpcoming(calendar.upcoming);
      setRecruiters(recruiterResponse.recruiters);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, [range.from, range.to, recruiterUserId, statusFilter, type]);

  useEffect(() => {
    void load();
  }, [load]);

  const days = useMemo(
    () => buildDays(range.from, range.to),
    [range.from, range.to],
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarInterviewEvent[]>();
    for (const event of events) {
      const key = dayKey(new Date(event.scheduledAt));
      const bucket = map.get(key) ?? [];
      bucket.push(event);
      map.set(key, bucket);
    }
    return map;
  }, [events]);

  const shift = (direction: -1 | 1) => {
    if (view === "day") setAnchor((current) => addDays(current, direction));
    else if (view === "week")
      setAnchor((current) => addDays(current, direction * 7));
    else
      setAnchor(
        (current) =>
          new Date(current.getFullYear(), current.getMonth() + direction, 1),
      );
  };

  const updateStatus = async (nextStatus: InterviewStatus) => {
    if (!selected || statusUpdating) return;
    setStatusUpdating(true);
    try {
      await updateInterviewStatus(selected.id, { status: nextStatus });
      push(t.candidates.interview.toasts.statusUpdated, "success");
      setSelected(null);
      await load();
    } catch (error) {
      push(
        error instanceof ApiRequestError
          ? error.message || t.candidates.interview.errors.unexpected
          : t.candidates.interview.errors.unexpected,
        "error",
      );
    } finally {
      setStatusUpdating(false);
    }
  };

  const visibleEvents =
    view === "month"
      ? events.filter((event) => {
          const date = new Date(event.scheduledAt);
          return (
            date.getMonth() === anchor.getMonth() &&
            date.getFullYear() === anchor.getFullYear()
          );
        })
      : events;

  return (
    <div className="interview-calendar-page">
      <div className="interview-calendar-header">
        <div>
          <h1>{t.candidates.interviewsModule.calendar.title}</h1>
          <p>{t.candidates.interviewsModule.calendar.description}</p>
        </div>
        <div className="interview-calendar-view-toggle">
          {(["month", "week", "day"] as const).map((item) => (
            <Button
              key={item}
              type="button"
              variant={view === item ? "primary" : "secondary"}
              onClick={() => setView(item)}
            >
              {t.candidates.interviewsModule.calendar[item]}
            </Button>
          ))}
        </div>
      </div>

      <div className="interview-calendar-toolbar">
        <div className="interview-calendar-nav">
          <Button type="button" variant="secondary" onClick={() => shift(-1)}>
            {t.candidates.interviewsModule.calendar.previous}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setAnchor(new Date())}
          >
            {t.candidates.interviewsModule.calendar.today}
          </Button>
          <Button type="button" variant="secondary" onClick={() => shift(1)}>
            {t.candidates.interviewsModule.calendar.next}
          </Button>
          <h2 className="interview-calendar-month-title">
            {view === "day"
              ? formatDayLabel(anchor, locale)
              : view === "week"
                ? `${formatDayLabel(range.from, locale)} – ${formatDayLabel(range.to, locale)}`
                : formatMonthTitle(anchor, locale)}
          </h2>
        </div>
        <div className="interview-calendar-filters">
          <Select
            value={recruiterUserId}
            onChange={(event) => setRecruiterUserId(event.target.value)}
            options={[
              {
                value: "",
                label: `${t.candidates.interviewsModule.calendar.recruiter}: ${t.candidates.interviewsModule.calendar.all}`,
              },
              ...recruiters.map((user) => ({
                value: user.id,
                label: user.email,
              })),
            ]}
          />
          <Select
            value={type}
            onChange={(event) => setType(event.target.value)}
            options={[
              {
                value: "",
                label: `${t.candidates.interviewsModule.calendar.type}: ${t.candidates.interviewsModule.calendar.all}`,
              },
              ...(
                [
                  "HR",
                  "TECHNICAL",
                  "TEAM_LEAD",
                  "MANAGER",
                  "FINAL",
                  "CUSTOM",
                ] as const
              ).map((value) => ({
                value,
                label: t.candidates.interview.types[value],
              })),
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={[
              {
                value: "",
                label: `${t.candidates.interviewsModule.calendar.status}: ${t.candidates.interviewsModule.calendar.all}`,
              },
              ...(
                [
                  "SCHEDULED",
                  "IN_PROGRESS",
                  "COMPLETED",
                  "CANCELLED",
                  "NO_SHOW",
                ] as const
              ).map((value) => ({
                value,
                label: t.candidates.interview.statuses[value],
              })),
            ]}
          />
        </div>
      </div>

      {status === "loading" ? (
        <Card>
          <Skeleton height="16rem" />
          <SkeletonText lines={3} style={{ marginTop: "1rem" }} />
        </Card>
      ) : null}

      {status === "error" ? (
        <Card>
          <EmptyState title={t.candidates.interviewsModule.calendar.loadFailed}>
            <Button type="button" onClick={() => void load()}>
              {t.candidates.interviewsModule.calendar.retry}
            </Button>
          </EmptyState>
        </Card>
      ) : null}

      {status === "success" ? (
        <>
          <div className="interview-calendar-side">
            <Card title={t.candidates.interviewsModule.calendar.todayTitle}>
              {today.length === 0 ? (
                <p>—</p>
              ) : (
                <ul>
                  {today.map((event) => (
                    <li key={event.id}>
                      {formatTime(event.scheduledAt, locale)} · {event.name} ·{" "}
                      {event.candidateName}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card title={t.candidates.interviewsModule.calendar.upcomingTitle}>
              {upcoming.length === 0 ? (
                <p>—</p>
              ) : (
                <ul>
                  {upcoming.map((event) => (
                    <li key={event.id}>
                      {formatDayLabel(new Date(event.scheduledAt), locale)} ·{" "}
                      {event.name}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div className={`interview-calendar-shell view-${view}`}>
            {view === "month" ? (
              <div className="interview-calendar-weekdays" aria-hidden="true">
                {weekdays.map((label) => (
                  <div key={label} className="interview-calendar-weekday">
                    {label}
                  </div>
                ))}
              </div>
            ) : null}

            <div className={`interview-calendar-grid view-${view}`}>
              {days.map((day) => {
                const key = dayKey(day);
                const dayEvents = eventsByDay.get(key) ?? [];
                const inCurrentMonth =
                  day.getMonth() === anchor.getMonth() &&
                  day.getFullYear() === anchor.getFullYear();
                const isToday = sameDay(day, todayDate);
                const classes = [
                  "interview-calendar-day",
                  view === "month" && !inCurrentMonth
                    ? "is-outside-month"
                    : "",
                  isToday ? "is-today" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div key={key} className={classes}>
                    <div className="interview-calendar-day-label">
                      {view === "month" ? (
                        <span
                          className={
                            isToday
                              ? "interview-calendar-day-number is-today"
                              : "interview-calendar-day-number"
                          }
                        >
                          {formatDayNumber(day, locale)}
                        </span>
                      ) : (
                        formatDayLabel(day, locale)
                      )}
                    </div>
                    <div className="interview-calendar-day-events">
                      {dayEvents.length === 0 ? (
                        view === "month" ? null : (
                          <p className="interview-calendar-day-empty">—</p>
                        )
                      ) : (
                        dayEvents.map((event) => (
                          <button
                            key={event.id}
                            type="button"
                            className={statusClass(event.status)}
                            onClick={() => setSelected(event)}
                          >
                            <span>
                              {formatTime(event.scheduledAt, locale)}{" "}
                              {event.candidateName}
                            </span>
                            <span>
                              {t.candidates.interview.types[event.type]}
                              {event.hasConflict
                                ? ` · ${t.candidates.interviewsModule.calendar.conflict}`
                                : ""}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {visibleEvents.length === 0 ? (
            <EmptyState
              title={t.candidates.interviewsModule.calendar.emptyTitle}
              description={
                t.candidates.interviewsModule.calendar.emptyDescription
              }
            />
          ) : null}
        </>
      ) : null}

      {selected ? (
        <div className="dashboard-dialog-backdrop" role="presentation">
          <div
            className="dashboard-dialog interview-calendar-drawer"
            role="dialog"
            aria-modal="true"
          >
            <h2>{t.candidates.interviewsModule.calendar.drawerTitle}</h2>
            <p>
              <strong>{selected.candidateName}</strong> · {selected.jobTitle}
            </p>
            <p>
              {selected.name} · {t.candidates.interview.types[selected.type]} ·{" "}
              {t.candidates.interview.statuses[selected.status]}
            </p>
            <p>
              {formatDayLabel(new Date(selected.scheduledAt), locale)}{" "}
              {formatTime(selected.scheduledAt, locale)}
            </p>
            {selected.recruiterEmail ? <p>{selected.recruiterEmail}</p> : null}
            {selected.location ? <p>{selected.location}</p> : null}
            {selected.meetingUrl ? (
              <p>
                <a href={selected.meetingUrl} target="_blank" rel="noreferrer">
                  {selected.meetingUrl}
                </a>
              </p>
            ) : null}
            {selected.hasConflict ? (
              <Badge variant="warning">
                {t.candidates.interviewsModule.calendar.conflict}
              </Badge>
            ) : null}
            <FormFieldLike
              label={t.candidates.interviewsModule.calendar.quickStatus}
            >
              <Select
                value={selected.status}
                disabled={statusUpdating}
                onChange={(event) =>
                  void updateStatus(event.target.value as InterviewStatus)
                }
                options={(
                  [
                    "SCHEDULED",
                    "IN_PROGRESS",
                    "COMPLETED",
                    "CANCELLED",
                    "NO_SHOW",
                  ] as const
                ).map((value) => ({
                  value,
                  label: t.candidates.interview.statuses[value],
                }))}
              />
            </FormFieldLike>
            <div className="dashboard-dialog-actions">
              <Link
                to={`/jobs/${selected.jobId}/candidates/${selected.candidateId}`}
                className="button-link"
              >
                {t.candidates.interviewsModule.calendar.openProfile}
              </Link>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSelected(null)}
              >
                {t.candidates.interview.form.cancel}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FormFieldLike({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="interview-calendar-status-field">
      <span>{label}</span>
      {children}
    </label>
  );
}
