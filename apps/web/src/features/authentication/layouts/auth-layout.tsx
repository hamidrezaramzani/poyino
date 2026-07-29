import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";

export function AuthLayout({ children }: PropsWithChildren) {
  const { t, direction, toggleLocale } = useI18n();

  return (
    <div className="auth-shell" dir={direction}>
      <header className="auth-header">
        <Link to="/" className="auth-brand">
          Poyino
        </Link>
        <button type="button" className="language-toggle" onClick={toggleLocale}>
          {t.switchLanguageLabel}
        </button>
      </header>
      <main className="auth-main">{children}</main>
    </div>
  );
}
