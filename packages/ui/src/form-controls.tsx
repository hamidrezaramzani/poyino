import type {
  CSSProperties,
  InputHTMLAttributes,
  KeyboardEvent,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useEffect, useId, useRef, useState } from "react";
import { brand } from "./brand";

export function baseFieldStyle(
  hasError: boolean,
  disabled: boolean,
): CSSProperties {
  return {
    width: "100%",
    boxSizing: "border-box",
    padding: "0.75rem 0.9rem",
    borderRadius: "0.75rem",
    border: `1px solid ${hasError ? brand.danger : brand.border}`,
    backgroundColor: disabled ? brand.surfaceMuted : brand.surface,
    color: brand.text,
    fontSize: "0.95rem",
    fontFamily: "inherit",
    outline: "none",
  };
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export function Textarea({ error, style, disabled, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      disabled={disabled}
      rows={rows}
      aria-invalid={Boolean(error)}
      style={{
        ...baseFieldStyle(Boolean(error), Boolean(disabled)),
        resize: "vertical",
        minHeight: "6rem",
        fontFamily: "inherit",
        ...style,
      }}
      {...props}
    />
  );
}

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

export function Select({
  error,
  style,
  disabled,
  options,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <select
      disabled={disabled}
      aria-invalid={Boolean(error)}
      style={{
        ...baseFieldStyle(Boolean(error), Boolean(disabled)),
        ...style,
      }}
      {...props}
    >
      {placeholder ? (
        <option value="" disabled={props.required}>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

type SwitchProps = {
  id?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export function Switch({
  id,
  checked,
  disabled,
  onChange,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        width: "2.75rem",
        height: "1.55rem",
        borderRadius: "999px",
        border: "none",
        padding: 0,
        backgroundColor: checked ? brand.primary : brand.border,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        flexShrink: 0,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "0.2rem",
          insetInlineStart: checked ? "1.35rem" : "0.2rem",
          width: "1.15rem",
          height: "1.15rem",
          borderRadius: "999px",
          backgroundColor: brand.surface,
          transition: "inset-inline-start 120ms ease",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.2)",
        }}
      />
    </button>
  );
}

export function Divider({ label }: { label?: string }) {
  if (!label) {
    return (
      <hr
        style={{
          border: "none",
          borderTop: `1px solid ${brand.border}`,
          margin: "1.25rem 0",
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        margin: "1.25rem 0",
        color: brand.muted,
        fontSize: "0.85rem",
        fontWeight: 600,
      }}
    >
      <span style={{ flex: 1, height: 1, backgroundColor: brand.border }} />
      <span>{label}</span>
      <span style={{ flex: 1, height: 1, backgroundColor: brand.border }} />
    </div>
  );
}

type DatePickerProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value"
> & {
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export function DatePicker({
  value,
  error,
  disabled,
  style,
  onChange,
  ...props
}: DatePickerProps) {
  return (
    <input
      type="date"
      value={value}
      disabled={disabled}
      aria-invalid={Boolean(error)}
      onChange={(event) => onChange(event.target.value)}
      style={{
        ...baseFieldStyle(Boolean(error), Boolean(disabled)),
        ...style,
      }}
      {...props}
    />
  );
}

type MultiSelectProps = {
  id?: string;
  values: string[];
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  suggestions?: string[];
  addLabel?: string;
  onChange: (values: string[]) => void;
  onBlur?: () => void;
};

export function MultiSelect({
  id,
  values,
  disabled,
  error,
  placeholder,
  suggestions = [],
  addLabel = "Add",
  onChange,
  onBlur,
}: MultiSelectProps) {
  const [draft, setDraft] = useState("");
  const listId = useId();

  const commit = (raw: string) => {
    const next = raw.trim().replace(/\s+/g, " ");
    if (!next || disabled) {
      return;
    }
    const exists = values.some(
      (value) => value.toLocaleLowerCase("en") === next.toLocaleLowerCase("en"),
    );
    if (!exists) {
      onChange([...values, next]);
    }
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit(draft);
    }
    if (event.key === "Backspace" && draft.length === 0 && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div>
      <div
        style={{
          ...baseFieldStyle(Boolean(error), Boolean(disabled)),
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          alignItems: "center",
          minHeight: "2.85rem",
          padding: "0.45rem 0.6rem",
        }}
      >
        {values.map((value) => (
          <span
            key={value}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.2rem 0.55rem",
              borderRadius: "999px",
              backgroundColor: brand.iconBg,
              color: brand.primary,
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {value}
            <button
              type="button"
              disabled={disabled}
              aria-label={`Remove ${value}`}
              onClick={() => onChange(values.filter((item) => item !== value))}
              style={{
                border: "none",
                background: "transparent",
                color: brand.primary,
                cursor: disabled ? "not-allowed" : "pointer",
                padding: 0,
                lineHeight: 1,
                fontSize: "1rem",
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          list={suggestions.length > 0 ? listId : undefined}
          value={draft}
          disabled={disabled}
          placeholder={values.length === 0 ? placeholder : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            commit(draft);
            onBlur?.();
          }}
          style={{
            flex: 1,
            minWidth: "8rem",
            border: "none",
            outline: "none",
            background: "transparent",
            color: brand.text,
            fontSize: "0.95rem",
            fontFamily: "inherit",
            padding: "0.35rem 0.25rem",
          }}
        />
        <button
          type="button"
          disabled={disabled || draft.trim().length === 0}
          onClick={() => commit(draft)}
          style={{
            border: "none",
            background: "transparent",
            color: brand.primary,
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {addLabel}
        </button>
      </div>
      {suggestions.length > 0 ? (
        <datalist id={listId}>
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      ) : null}
    </div>
  );
}

type RichTextEditorProps = {
  id?: string;
  value: string;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  minHeight?: number;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

export function RichTextEditor({
  id,
  value,
  disabled,
  error,
  placeholder,
  minHeight = 160,
  onChange,
  onBlur,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor) {
      return;
    }
    if (editor.innerHTML !== value) {
      editor.innerHTML = value || "";
    }
  }, [value]);

  const runCommand = (command: string) => {
    if (disabled) {
      return;
    }
    editorRef.current?.focus();
    document.execCommand(command, false);
    onChange(editorRef.current?.innerHTML ?? "");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          marginBottom: "0.45rem",
          flexWrap: "wrap",
        }}
      >
        {(
          [
            ["bold", "B"],
            ["italic", "I"],
            ["insertUnorderedList", "• List"],
          ] as const
        ).map(([command, label]) => (
          <button
            key={command}
            type="button"
            disabled={disabled}
            onMouseDown={(event) => {
              event.preventDefault();
              runCommand(command);
            }}
            style={{
              border: `1px solid ${brand.border}`,
              backgroundColor: brand.surface,
              color: brand.text,
              borderRadius: "0.55rem",
              padding: "0.3rem 0.55rem",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        id={id}
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        aria-invalid={Boolean(error)}
        contentEditable={!disabled}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML ?? "")}
        onBlur={() => onBlur?.()}
        style={{
          ...baseFieldStyle(Boolean(error), Boolean(disabled)),
          minHeight,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
        }}
      />
    </div>
  );
}

type ColorPickerProps = {
  id?: string;
  value: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

export function ColorPicker({
  id,
  value,
  disabled,
  error,
  onChange,
}: ColorPickerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <input
        id={id}
        type="color"
        value={value}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "3rem",
          height: "3rem",
          padding: 0,
          border: `1px solid ${error ? brand.danger : brand.border}`,
          borderRadius: "0.75rem",
          background: "transparent",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
      <input
        type="text"
        value={value}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        style={baseFieldStyle(Boolean(error), Boolean(disabled))}
      />
    </div>
  );
}

type ImagePreviewProps = {
  src?: string | null;
  alt: string;
  size?: number;
  emptyLabel?: string;
};

export function ImagePreview({
  src,
  alt,
  size = 96,
  emptyLabel = "No image",
}: ImagePreviewProps) {
  if (!src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "0.9rem",
          border: `1px dashed ${brand.border}`,
          backgroundColor: brand.surfaceMuted,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: brand.muted,
          fontSize: "0.8rem",
          textAlign: "center",
          padding: "0.5rem",
        }}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        borderRadius: "0.9rem",
        border: `1px solid ${brand.border}`,
        backgroundColor: brand.surfaceMuted,
      }}
    />
  );
}

type ImageUploadProps = {
  id?: string;
  label: string;
  accept?: string;
  disabled?: boolean;
  uploading?: boolean;
  previewUrl?: string | null;
  error?: string;
  emptyLabel?: string;
  uploadLabel: string;
  removeLabel: string;
  onSelect: (file: File) => void;
  onRemove?: () => void;
};

export function ImageUpload({
  id,
  label,
  accept = "image/png,image/jpeg,image/svg+xml",
  disabled,
  uploading,
  previewUrl,
  error,
  emptyLabel,
  uploadLabel,
  removeLabel,
  onSelect,
  onRemove,
}: ImageUploadProps) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          display: "block",
          marginBottom: "0.4rem",
          fontSize: "0.9rem",
          fontWeight: 600,
          color: brand.text,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <ImagePreview
          src={previewUrl}
          alt={label}
          emptyLabel={emptyLabel}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label
            htmlFor={id}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.65rem 0.9rem",
              borderRadius: "0.75rem",
              border: `1px solid ${brand.border}`,
              backgroundColor: brand.surface,
              color: brand.primary,
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: disabled || uploading ? "not-allowed" : "pointer",
              opacity: disabled || uploading ? 0.7 : 1,
            }}
          >
            {uploading ? "..." : uploadLabel}
          </label>
          <input
            id={id}
            type="file"
            accept={accept}
            disabled={disabled || uploading}
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) {
                onSelect(file);
              }
            }}
          />
          {previewUrl && onRemove ? (
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={onRemove}
              style={{
                border: "none",
                background: "transparent",
                color: brand.danger,
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: disabled || uploading ? "not-allowed" : "pointer",
                textAlign: "start",
                padding: 0,
              }}
            >
              {removeLabel}
            </button>
          ) : null}
        </div>
      </div>
      {error ? (
        <p
          role="alert"
          style={{
            margin: "0.4rem 0 0",
            color: brand.danger,
            fontSize: "0.85rem",
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
