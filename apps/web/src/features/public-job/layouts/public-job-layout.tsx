import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";

export function PublicJobLayout({ children }: PropsWithChildren) {
  const { t, direction, locale, toggleLocale } = useI18n();
  const brandName = locale === "fa" ? "پوینو" : "Poyino";

  return (
    <div className="public-job-shell" dir={direction}>
      <header className="public-job-shell-header">
        <Link to="/" className="public-job-shell-brand">
          <span className="public-job-shell-mark" aria-hidden>
            P
          </span>
          <span>{brandName}</span>
        </Link>
        <button type="button" className="language-toggle" onClick={toggleLocale}>
          {t.switchLanguageLabel}
        </button>
      </header>
      <main className="public-job-shell-main">{children}</main>
    </div>
  );
}
