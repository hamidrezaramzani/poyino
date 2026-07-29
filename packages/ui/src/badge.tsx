import type { CSSProperties, PropsWithChildren } from "react";
import { brand } from "./brand";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

type BadgeProps = PropsWithChildren<{
  variant?: BadgeVariant;
  style?: CSSProperties;
}>;

const variantStyles: Record<
  BadgeVariant,
  { backgroundColor: string; color: string; border: string }
> = {
  neutral: {
    backgroundColor: brand.surfaceMuted,
    color: brand.text,
    border: brand.border,
  },
  success: {
    backgroundColor: brand.successBg,
    color: brand.success,
    border: brand.successBorder,
  },
  warning: {
    backgroundColor: brand.warningBg,
    color: brand.warning,
    border: brand.warningBorder,
  },
  danger: {
    backgroundColor: brand.dangerBg,
    color: brand.danger,
    border: brand.dangerBorder,
  },
  info: {
    backgroundColor: brand.infoBg,
    color: brand.accent,
    border: brand.infoBorder,
  },
};

export function Badge({
  children,
  variant = "neutral",
  style,
}: BadgeProps) {
  const palette = variantStyles[variant];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.2rem 0.55rem",
        borderRadius: "999px",
        border: `1px solid ${palette.border}`,
        backgroundColor: palette.backgroundColor,
        color: palette.color,
        fontSize: "0.75rem",
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
