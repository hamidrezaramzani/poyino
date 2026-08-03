type AppLocale = "fa" | "en";

function localeTag(locale: AppLocale | string) {
  return locale === "fa" ? "fa-IR" : "en-US";
}

function withPersianCalendar<T extends Intl.DateTimeFormatOptions>(
  options: T,
): T & { calendar: "persian" } {
  return {
    ...options,
    calendar: "persian",
  };
}

export function formatDate(
  value: string | Date,
  locale: AppLocale | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
) {
  return new Intl.DateTimeFormat(
    localeTag(locale),
    withPersianCalendar(options),
  ).format(typeof value === "string" ? new Date(value) : value);
}

export function formatDateTime(
  value: string | Date,
  locale: AppLocale | string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  },
) {
  return new Intl.DateTimeFormat(
    localeTag(locale),
    withPersianCalendar(options),
  ).format(typeof value === "string" ? new Date(value) : value);
}

export function formatTime(
  value: string | Date,
  locale: AppLocale | string,
  options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  },
) {
  return new Intl.DateTimeFormat(localeTag(locale), options).format(
    typeof value === "string" ? new Date(value) : value,
  );
}

export function formatMonthTitle(
  value: string | Date,
  locale: AppLocale | string,
) {
  return formatDate(value, locale, {
    month: "long",
    year: "numeric",
  });
}

export function formatDayLabel(
  value: string | Date,
  locale: AppLocale | string,
) {
  return formatDate(value, locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDayNumber(
  value: string | Date,
  locale: AppLocale | string,
) {
  return formatDate(value, locale, {
    day: "numeric",
  });
}

export function formatWeekday(
  value: string | Date,
  locale: AppLocale | string,
) {
  return formatDate(value, locale, {
    weekday: "short",
  });
}

export function safeFormatDate(
  value: string,
  locale: AppLocale | string,
  options?: Intl.DateTimeFormatOptions,
) {
  try {
    return formatDate(value, locale, options);
  } catch {
    return value;
  }
}

export function safeFormatDateTime(
  value: string,
  locale: AppLocale | string,
  options?: Intl.DateTimeFormatOptions,
) {
  try {
    return formatDateTime(value, locale, options);
  } catch {
    return value;
  }
}
