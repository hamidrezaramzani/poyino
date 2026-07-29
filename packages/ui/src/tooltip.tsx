import type { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { brand } from "./brand";

type TooltipProps = PropsWithChildren<{
  content: ReactNode;
  style?: CSSProperties;
}>;

export function Tooltip({ content, children, style }: TooltipProps) {
  return (
    <span
      className="poyino-tooltip"
      style={{ position: "relative", display: "inline-flex", ...style }}
    >
      {children}
      <span
        role="tooltip"
        className="poyino-tooltip-content"
        style={{
          position: "absolute",
          insetInlineStart: "50%",
          bottom: "calc(100% + 0.45rem)",
          transform: "translateX(-50%)",
          backgroundColor: brand.text,
          color: "#ffffff",
          fontSize: "0.75rem",
          fontWeight: 600,
          lineHeight: 1.4,
          padding: "0.4rem 0.6rem",
          borderRadius: "0.5rem",
          whiteSpace: "nowrap",
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.15s ease",
          zIndex: 40,
        }}
      >
        {content}
      </span>
    </span>
  );
}
