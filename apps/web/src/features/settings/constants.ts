export const LANGUAGE_OPTIONS = [
  { value: "fa", labelKey: "persian" as const },
  { value: "en", labelKey: "english" as const },
];

export const TIMEZONE_OPTIONS = [
  { value: "Asia/Tehran", label: "Asia/Tehran (IRST)" },
  { value: "UTC", label: "UTC" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Europe/Berlin", label: "Europe/Berlin" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "Asia/Dubai", label: "Asia/Dubai" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
];

export const COUNTRY_OPTIONS = [
  { value: "Iran", labelKey: "iran" as const },
  { value: "United Arab Emirates", labelKey: "uae" as const },
  { value: "Turkey", labelKey: "turkey" as const },
  { value: "Germany", labelKey: "germany" as const },
  { value: "United Kingdom", labelKey: "uk" as const },
  { value: "United States", labelKey: "usa" as const },
  { value: "Canada", labelKey: "canada" as const },
  { value: "Other", labelKey: "other" as const },
];

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
];
