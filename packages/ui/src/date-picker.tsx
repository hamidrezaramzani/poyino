import type { ChangeEvent, CSSProperties } from "react";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import persian_en from "react-date-object/locales/persian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import MultiDatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { baseFieldStyle } from "./form-controls";

type UiLocale = "fa" | "en";

type SharedDatePickerProps = {
  id?: string;
  value: string;
  error?: string;
  disabled?: boolean;
  style?: CSSProperties;
  placeholder?: string;
  locale?: UiLocale;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

type RenderInputProps = {
  id?: string;
  value?: string;
  openCalendar?: () => void;
  onFocus?: () => void;
  handleValueChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  style?: CSSProperties;
  placeholder?: string;
  onBlur?: () => void;
};

function pickerLocale(locale: UiLocale) {
  return locale === "en" ? persian_en : persian_fa;
}

function parseGregorianDate(value: string) {
  if (!value) return undefined;
  const parsed = new DateObject({
    date: value,
    format: "YYYY-MM-DD",
    calendar: gregorian,
  });
  if (!parsed.isValid) return undefined;
  return parsed.convert(persian);
}

function toGregorianDateValue(date: DateObject | null) {
  if (!date?.isValid) return "";
  return date.convert(gregorian).format("YYYY-MM-DD");
}

function parseLocalDateTime(value: string) {
  if (!value) return undefined;
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const parsed = new DateObject({
    date: normalized,
    format: "YYYY-MM-DDTHH:mm",
    calendar: gregorian,
  });
  if (!parsed.isValid) return undefined;
  return parsed.convert(persian);
}

function toLocalDateTimeValue(date: DateObject | null) {
  if (!date?.isValid) return "";
  return date.convert(gregorian).format("YYYY-MM-DDTHH:mm");
}

function DatePickerInput({
  id,
  value,
  openCalendar,
  onFocus,
  handleValueChange,
  disabled,
  error,
  style,
  placeholder,
  onBlur,
}: RenderInputProps) {
  return (
    <input
      id={id}
      value={value ?? ""}
      disabled={disabled}
      readOnly
      placeholder={placeholder}
      aria-invalid={Boolean(error)}
      onFocus={() => {
        onFocus?.();
        if (!disabled) openCalendar?.();
      }}
      onChange={handleValueChange}
      onBlur={onBlur}
      style={{
        ...baseFieldStyle(Boolean(error), Boolean(disabled)),
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    />
  );
}

export function DatePicker({
  id,
  value,
  error,
  disabled,
  style,
  placeholder,
  locale = "fa",
  onChange,
  onBlur,
}: SharedDatePickerProps) {
  const isRtl = locale !== "en";

  return (
    <div
      className="poyino-date-picker"
      style={{ width: "100%", direction: isRtl ? "rtl" : "ltr" }}
    >
      <MultiDatePicker
        id={id}
        value={parseGregorianDate(value)}
        calendar={persian}
        locale={pickerLocale(locale)}
        format="YYYY/MM/DD"
        calendarPosition={isRtl ? "bottom-right" : "bottom-left"}
        disabled={disabled}
        editable={false}
        containerStyle={{ width: "100%" }}
        render={
          <DatePickerInput
            id={id}
            disabled={disabled}
            error={error}
            style={style}
            placeholder={placeholder}
            onBlur={onBlur}
          />
        }
        onChange={(date) => {
          onChange(toGregorianDateValue(date as DateObject | null));
        }}
        onClose={() => onBlur?.()}
      />
    </div>
  );
}

export function DateTimePicker({
  id,
  value,
  error,
  disabled,
  style,
  placeholder,
  locale = "fa",
  onChange,
  onBlur,
}: SharedDatePickerProps) {
  const isRtl = locale !== "en";

  return (
    <div
      className="poyino-date-picker"
      style={{ width: "100%", direction: isRtl ? "rtl" : "ltr" }}
    >
      <MultiDatePicker
        id={id}
        value={parseLocalDateTime(value)}
        calendar={persian}
        locale={pickerLocale(locale)}
        format="YYYY/MM/DD HH:mm"
        calendarPosition={isRtl ? "bottom-right" : "bottom-left"}
        disabled={disabled}
        editable={false}
        containerStyle={{ width: "100%" }}
        plugins={[<TimePicker key="time" position="bottom" hideSeconds />]}
        render={
          <DatePickerInput
            id={id}
            disabled={disabled}
            error={error}
            style={style}
            placeholder={placeholder}
            onBlur={onBlur}
          />
        }
        onChange={(date) => {
          onChange(toLocalDateTimeValue(date as DateObject | null));
        }}
        onClose={() => onBlur?.()}
      />
    </div>
  );
}
