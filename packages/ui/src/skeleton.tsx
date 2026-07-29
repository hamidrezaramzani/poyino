import type { CSSProperties } from "react";
import { brand } from "./brand";

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: CSSProperties;
};

export function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius = "0.5rem",
  style,
}: SkeletonProps) {
  return (
    <span
      aria-hidden
      style={{
        display: "block",
        width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, ${brand.skeletonFrom} 0%, ${brand.skeletonVia} 50%, ${brand.skeletonFrom} 100%)`,
        backgroundSize: "200% 100%",
        animation: "poyino-skeleton-pulse 1.4s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

type SkeletonTextProps = {
  lines?: number;
  style?: CSSProperties;
};

export function SkeletonText({ lines = 3, style }: SkeletonTextProps) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "0.6rem", ...style }}
    >
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? "70%" : "100%"}
          height="0.85rem"
        />
      ))}
    </div>
  );
}

export const skeletonKeyframes = `
@keyframes poyino-skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;
