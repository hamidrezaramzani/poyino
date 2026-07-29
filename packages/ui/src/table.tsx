import type { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { brand } from "./brand";

export type TableColumn<T> = {
  key: string;
  header: string;
  width?: string | number;
  render: (row: T) => ReactNode;
};

type TableProps<T> = {
  columns: Array<TableColumn<T>>;
  rows: T[];
  getRowKey: (row: T) => string;
  caption?: string;
  style?: CSSProperties;
};

export function Table<T>({
  columns,
  rows,
  getRowKey,
  caption,
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
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
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
                {column.header}
              </th>
            ))}
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
