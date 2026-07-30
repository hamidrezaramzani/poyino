import type { CSSProperties } from "react";
import { useState } from "react";
import { brand } from "./brand";

type CopyLinkButtonProps = {
  value: string;
  label: string;
  copiedLabel: string;
  disabled?: boolean;
  style?: CSSProperties;
  onCopied?: () => void;
};

export function CopyLinkButton({
  value,
  label,
  copiedLabel,
  disabled,
  style,
  onCopied,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (disabled) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopied?.();
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => void copy()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "0.75rem 1rem",
        borderRadius: "0.75rem",
        border: `1px solid ${brand.border}`,
        backgroundColor: brand.surface,
        color: brand.primary,
        fontWeight: 600,
        fontSize: "0.95rem",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        ...style,
      }}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
