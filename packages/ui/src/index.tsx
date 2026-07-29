import type {
  ButtonHTMLAttributes,
  CSSProperties,
  FormEvent,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  PropsWithChildren,
} from "react";
import { useState } from "react";
import { brand } from "./brand";
import { baseFieldStyle } from "./form-controls";

export { Avatar } from "./avatar";
export { Badge } from "./badge";
export { EmptyState } from "./empty-state";
export { Skeleton, SkeletonText, skeletonKeyframes } from "./skeleton";
export { Spinner, spinnerKeyframes } from "./spinner";
export { StatisticCard } from "./statistic-card";
export { Table, TableSection, type TableColumn } from "./table";
export { Tooltip } from "./tooltip";
export {
  ColorPicker,
  Divider,
  ImagePreview,
  ImageUpload,
  Select,
  Switch,
  Textarea,
} from "./form-controls";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
    fullWidth?: boolean;
  }
>;

export function Button({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const variantStyle = getButtonVariantStyle(variant);

  return (
    <button
      type={type}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        width: fullWidth ? "100%" : undefined,
        padding: "0.75rem 1rem",
        borderRadius: "0.75rem",
        border: variantStyle.border,
        backgroundColor: variantStyle.backgroundColor,
        color: variantStyle.color,
        fontWeight: 600,
        fontSize: "0.95rem",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

type LoadingButtonProps = ButtonProps & {
  loading?: boolean;
  loadingLabel?: string;
};

export function LoadingButton({
  loading = false,
  loadingLabel,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || loading} aria-busy={loading} {...props}>
      {loading ? (loadingLabel ?? children) : children}
    </Button>
  );
}

type CardProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

export function Card({ children, title, description }: CardProps) {
  return (
    <section
      style={{
        boxShadow: brand.shadow,
        backgroundColor: brand.surface,
        border: `1px solid ${brand.border}`,
        borderRadius: "1rem",
        padding: "1.5rem",
      }}
    >
      {title ? (
        <h2
          style={{
            marginTop: 0,
            marginBottom: description ? "0.5rem" : "1rem",
            color: brand.text,
          }}
        >
          {title}
        </h2>
      ) : null}
      {description ? (
        <p
          style={{
            marginTop: 0,
            marginBottom: "1.25rem",
            color: brand.muted,
          }}
        >
          {description}
        </p>
      ) : null}
      {children}
    </section>
  );
}

type LabelProps = PropsWithChildren<LabelHTMLAttributes<HTMLLabelElement>>;

export function Label({ children, style, ...props }: LabelProps) {
  return (
    <label
      style={{
        display: "block",
        marginBottom: "0.4rem",
        fontSize: "0.9rem",
        fontWeight: 600,
        color: brand.text,
        ...style,
      }}
      {...props}
    >
      {children}
    </label>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ error, style, disabled, ...props }: InputProps) {
  return (
    <input
      disabled={disabled}
      aria-invalid={Boolean(error)}
      style={{
        ...baseFieldStyle(Boolean(error), Boolean(disabled)),
        ...style,
      }}
      {...props}
    />
  );
}

type PasswordInputProps = Omit<InputProps, "type"> & {
  showLabel?: string;
  hideLabel?: string;
};

export function PasswordInput({
  error,
  disabled,
  showLabel = "Show password",
  hideLabel = "Hide password",
  style,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        type={visible ? "text" : "password"}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        style={{
          ...baseFieldStyle(Boolean(error), Boolean(disabled)),
          paddingInlineEnd: "4.5rem",
          ...style,
        }}
        {...props}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? hideLabel : showLabel}
        style={{
          position: "absolute",
          insetInlineEnd: "0.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          border: "none",
          background: "transparent",
          color: brand.primary,
          fontWeight: 600,
          fontSize: "0.8rem",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {visible ? hideLabel : showLabel}
      </button>
    </div>
  );
}

type FormFieldProps = PropsWithChildren<{
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
}>;

export function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
}: FormFieldProps) {
  const errorId = `${htmlFor}-error`;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? " *" : null}
      </Label>
      {children}
      {error ? (
        <p
          id={errorId}
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

type FormProps = PropsWithChildren<{
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  style?: CSSProperties;
}>;

export function Form({ children, onSubmit, style }: FormProps) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      style={{ display: "flex", flexDirection: "column", ...style }}
    >
      {children}
    </form>
  );
}

type AlertProps = PropsWithChildren<{
  variant?: "error" | "info" | "success";
  title?: string;
}>;

export function Alert({ children, variant = "info", title }: AlertProps) {
  const palette =
    variant === "error"
      ? { bg: brand.dangerBg, color: brand.danger, border: brand.dangerBorder }
      : variant === "success"
        ? { bg: brand.successBg, color: brand.success, border: brand.successBorder }
        : { bg: brand.surfaceMuted, color: brand.text, border: brand.border };

  return (
    <div
      role="alert"
      style={{
        backgroundColor: palette.bg,
        color: palette.color,
        border: `1px solid ${palette.border}`,
        borderRadius: "0.75rem",
        padding: "0.85rem 1rem",
      }}
    >
      {title ? (
        <strong style={{ display: "block", marginBottom: "0.25rem" }}>
          {title}
        </strong>
      ) : null}
      {children}
    </div>
  );
}

export type ToastItem = {
  id: string;
  message: string;
  variant?: "success" | "error" | "info";
};

type ToastViewportProps = {
  toasts: ToastItem[];
};

export function ToastViewport({ toasts }: ToastViewportProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        insetInlineEnd: "1rem",
        bottom: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        zIndex: 1000,
        maxWidth: "22rem",
      }}
    >
      {toasts.map((toast) => (
        <Alert key={toast.id} variant={toast.variant ?? "info"}>
          {toast.message}
        </Alert>
      ))}
    </div>
  );
}

function getButtonVariantStyle(variant: "primary" | "secondary" | "ghost") {
  if (variant === "secondary") {
    return {
      backgroundColor: brand.surface,
      color: brand.primary,
      border: `1px solid ${brand.border}`,
    };
  }

  if (variant === "ghost") {
    return {
      backgroundColor: "transparent",
      color: brand.primary,
      border: "1px solid transparent",
    };
  }

  return {
    backgroundColor: brand.primary,
    color: brand.onPrimary,
    border: "1px solid transparent",
  };
}
