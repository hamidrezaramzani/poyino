import type { CSSProperties, PropsWithChildren } from "react";
import { brand } from "./brand";

type EmptyStateProps = PropsWithChildren<{
  title: string;
  description?: string;
  style?: CSSProperties;
}>;

export function EmptyState({
  title,
  description,
  children,
  style,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "0.75rem",
        padding: "2.5rem 1.5rem",
        borderRadius: "1rem",
        border: `1px dashed ${brand.border}`,
        backgroundColor: brand.surfaceMuted,
        ...style,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "1rem",
          fontWeight: 700,
          color: brand.text,
        }}
      >
        {title}
      </h3>
      {description ? (
        <p
          style={{
            margin: 0,
            maxWidth: "28rem",
            color: brand.muted,
            fontSize: "0.9rem",
          }}
        >
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
