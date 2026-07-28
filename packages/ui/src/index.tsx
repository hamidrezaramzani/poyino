import type { PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{
  type?: "button" | "submit" | "reset";
}>;

type CardProps = PropsWithChildren<{
  title: string;
}>;

export function Button({ children, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      style={{
        padding: "0.75rem 1rem",
        borderRadius: "0.75rem",
        border: "none",
        backgroundColor: "#150578",
        color: "#ffffff",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function Card({ children, title }: CardProps) {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "1rem",
        padding: "1.5rem",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {children}
    </section>
  );
}
