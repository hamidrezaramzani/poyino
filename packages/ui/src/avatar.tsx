import type { CSSProperties } from "react";
import { brand } from "./brand";

type AvatarProps = {
  name: string;
  size?: number;
  style?: CSSProperties;
};

export function Avatar({ name, size = 36, style }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <span
      aria-hidden={false}
      aria-label={name}
      role="img"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "999px",
        backgroundColor: brand.primary,
        color: brand.onPrimary,
        fontSize: Math.max(12, size * 0.36),
        fontWeight: 700,
        letterSpacing: "0.02em",
        flexShrink: 0,
        ...style,
      }}
    >
      {initials}
    </span>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}
