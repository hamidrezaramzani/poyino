import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { BetaNotice } from "../../beta/components/beta-notice";
import { useI18n } from "../../../shared/i18n/i18n-provider";

export function AuthLayout({ children }: PropsWithChildren) {
  const { t, direction, locale, toggleLocale } = useI18n();
  const brandName = locale === "fa" ? "پوینو" : "Poyino";

  return (
    <div className="auth-shell" dir={direction}>
      <BetaNotice variant="auth" />
      <header className="auth-header">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-mark" aria-hidden>
            P
          </span>
          <span>{brandName}</span>
        </Link>
        <button type="button" className="language-toggle" onClick={toggleLocale}>
          {t.switchLanguageLabel}
        </button>
      </header>
      <main className="auth-main">{children}</main>
    </div>
  );
}
