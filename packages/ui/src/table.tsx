import type { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { brand } from "./brand";

export type TableSortOrder = "asc" | "desc";

export type TableColumn<T> = {
  key: string;
  header: string;
  width?: string | number;
  sortable?: boolean;
  render: (row: T) => ReactNode;
};

type TableProps<T> = {
  columns: Array<TableColumn<T>>;
  rows: T[];
  getRowKey: (row: T) => string;
  caption?: string;
  sortBy?: string;
  sortOrder?: TableSortOrder;
  onSortChange?: (sortBy: string, sortOrder: TableSortOrder) => void;
  style?: CSSProperties;
};

export function Table<T>({
  columns,
  rows,
  getRowKey,
  caption,
  sortBy,
  sortOrder = "asc",
  onSortChange,
  style,
}: TableProps<T>) {
  return (
    <div
      style={{
        overflowX: "auto",
        border: `1px solid ${brand.border}`,
        borderRadius: "1rem",
        backgroundColor: brand.surface,
        ...style,
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "40rem",
        }}
      >
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr style={{ backgroundColor: brand.surfaceMuted }}>
            {columns.map((column) => {
              const isActive = sortBy === column.key;
              const nextOrder =
                isActive && sortOrder === "asc" ? "desc" : "asc";
              const sortable = Boolean(column.sortable && onSortChange);

              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    isActive
                      ? sortOrder === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  style={{
                    textAlign: "start",
                    padding: "0.85rem 1rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: brand.muted,
                    borderBottom: `1px solid ${brand.border}`,
                    width: column.width,
                    whiteSpace: "nowrap",
                  }}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => onSortChange?.(column.key, nextOrder)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        color: isActive ? brand.primary : brand.muted,
                        font: "inherit",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {column.header}
                      <span aria-hidden style={{ fontSize: "0.7rem" }}>
                        {isActive ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    padding: "0.9rem 1rem",
                    borderBottom: `1px solid ${brand.border}`,
                    color: brand.text,
                    fontSize: "0.9rem",
                    verticalAlign: "middle",
                  }}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type TableSectionProps = PropsWithChildren<{
  title: string;
  description?: string;
  actions?: ReactNode;
  style?: CSSProperties;
}>;

export function TableSection({
  title,
  description,
  actions,
  children,
  style,
}: TableSectionProps) {
  return (
    <section style={{ ...style }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.1rem",
              fontWeight: 700,
              color: brand.text,
            }}
          >
            {title}
          </h2>
          {description ? (
            <p
              style={{
                margin: "0.35rem 0 0",
                color: brand.muted,
                fontSize: "0.9rem",
              }}
            >
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  disabled?: boolean;
  previousLabel: string;
  nextLabel: string;
  summaryLabel: string;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  disabled,
  previousLabel,
  nextLabel,
  summaryLabel,
  onPageChange,
}: PaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  const safeTotalPages = Math.max(totalPages, 1);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
        marginTop: "1rem",
      }}
    >
      <p
        style={{
          margin: 0,
          color: brand.muted,
          fontSize: "0.88rem",
        }}
      >
        {summaryLabel
          .replace("{from}", String(from))
          .replace("{to}", String(to))
          .replace("{total}", String(totalItems))}
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          style={paginationButtonStyle(disabled || page <= 1)}
        >
          {previousLabel}
        </button>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0 0.5rem",
            color: brand.text,
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          {page} / {safeTotalPages}
        </span>
        <button
          type="button"
          disabled={disabled || page >= safeTotalPages}
          onClick={() => onPageChange(page + 1)}
          style={paginationButtonStyle(disabled || page >= safeTotalPages)}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

function paginationButtonStyle(disabled: boolean): CSSProperties {
  return {
    padding: "0.55rem 0.85rem",
    borderRadius: "0.7rem",
    border: `1px solid ${brand.border}`,
    backgroundColor: brand.surface,
    color: brand.primary,
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
  };
}
