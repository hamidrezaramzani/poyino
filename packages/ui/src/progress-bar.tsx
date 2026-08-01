import type { CSSProperties } from "react";
import { brand } from "./brand";

type ProgressBarProps = {
  value: number;
  label?: string;
  showPercentage?: boolean;
  style?: CSSProperties;
};

export function ProgressBar({
  value,
  label,
  showPercentage = true,
  style,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

  return (
    <div
      style={{
        display: "grid",
        gap: "0.5rem",
        width: "100%",
        ...style,
      }}
    >
      {label || showPercentage ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.75rem",
            fontSize: "0.875rem",
            color: brand.muted,
          }}
        >
          <span>{label}</span>
          {showPercentage ? <span>{Math.round(clamped)}%</span> : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        aria-label={label}
        style={{
          height: "0.65rem",
          borderRadius: "999px",
          backgroundColor: brand.surfaceMuted,
          overflow: "hidden",
          border: `1px solid ${brand.border}`,
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            borderRadius: "inherit",
            background: `linear-gradient(90deg, ${brand.primary}, ${brand.accent})`,
            transition: "width 160ms ease",
          }}
        />
      </div>
    </div>
  );
}
