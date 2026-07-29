import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";
import { brand } from "./brand";

type StatisticCardProps = {
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  loading?: boolean;
  error?: boolean;
  errorTooltip?: string;
  href?: string;
  onNavigate?: () => void;
  style?: CSSProperties;
};

export function StatisticCard({
  label,
  value,
  description,
  icon,
  loading = false,
  error = false,
  errorTooltip,
  href,
  onNavigate,
  style,
}: StatisticCardProps) {
  const interactive = Boolean(href || onNavigate);
  const displayValue = loading || error ? "—" : value;

  const content = (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color: brand.muted,
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "0.5rem 0 0",
            color: brand.text,
            fontSize: "1.75rem",
            fontWeight: 700,
            lineHeight: 1.2,
            minHeight: "2.1rem",
          }}
          title={error ? errorTooltip : undefined}
        >
          {displayValue}
        </p>
        {description ? (
          <p
            style={{
              margin: "0.45rem 0 0",
              color: brand.muted,
              fontSize: "0.8rem",
            }}
          >
            {description}
          </p>
        ) : null}
      </div>
      {icon ? (
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "0.75rem",
            backgroundColor: brand.iconBg,
            color: brand.primary,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      ) : null}
    </div>
  );

  const sharedStyle: CSSProperties = {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: brand.surface,
    border: `1px solid ${brand.border}`,
    borderRadius: "1rem",
    padding: "1.25rem",
    boxShadow: brand.shadow,
    textAlign: "start",
    textDecoration: "none",
    color: "inherit",
    cursor: interactive ? "pointer" : "default",
    ...style,
  };

  if (href) {
    return (
      <a
        href={href}
        style={sharedStyle}
        aria-label={label}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          if (onNavigate) {
            event.preventDefault();
            onNavigate();
          }
        }}
      >
        {content}
      </a>
    );
  }

  if (onNavigate) {
    return (
      <button
        type="button"
        style={sharedStyle}
        aria-label={label}
        onClick={onNavigate}
        onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onNavigate();
          }
        }}
      >
        {content}
      </button>
    );
  }

  return <section style={sharedStyle}>{content}</section>;
}
