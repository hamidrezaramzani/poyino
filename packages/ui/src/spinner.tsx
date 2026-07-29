import type { CSSProperties } from "react";
import { brand } from "./brand";

type SpinnerProps = {
  size?: number;
  label?: string;
  style?: CSSProperties;
};

export function Spinner({
  size = 24,
  label = "Loading",
  style,
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "999px",
        border: `2px solid ${brand.border}`,
        borderTopColor: brand.primary,
        animation: "poyino-spin 0.8s linear infinite",
        ...style,
      }}
    />
  );
}

export const spinnerKeyframes = `
@keyframes poyino-spin {
  to { transform: rotate(360deg); }
}
`;
