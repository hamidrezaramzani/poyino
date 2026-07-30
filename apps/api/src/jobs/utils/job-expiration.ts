export function formatDateOnly(value: Date | null | undefined) {
  if (!value) {
    return null;
  }
  return value.toISOString().slice(0, 10);
}

export function getYmdInTimeZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getHourMinuteInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? "0",
  );

  return { hour, minute };
}

export function addDaysToYmd(ymd: string, days: number) {
  const date = new Date(`${ymd}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDateOnly(date)!;
}

/**
 * A job expires at 23:59 of the selected day in the organization timezone.
 */
export function isJobExpired(
  expirationDate: Date | null | undefined,
  timeZone: string,
  now = new Date(),
) {
  if (!expirationDate) {
    return false;
  }

  const expirationYmd = formatDateOnly(expirationDate);
  if (!expirationYmd) {
    return false;
  }

  const todayYmd = getYmdInTimeZone(now, timeZone);
  if (todayYmd > expirationYmd) {
    return true;
  }
  if (todayYmd < expirationYmd) {
    return false;
  }

  const { hour, minute } = getHourMinuteInTimeZone(now, timeZone);
  return hour > 23 || (hour === 23 && minute >= 59);
}

export function buildPublicJobUrl(organizationSlug: string, jobId: string) {
  return `/${organizationSlug}/jobs/${jobId}`;
}
