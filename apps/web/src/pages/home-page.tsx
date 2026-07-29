import { appMetadata } from "@poyino/config";
import { Button } from "@poyino/ui";
import { Link } from "react-router-dom";
import { useI18n } from "../shared/i18n/i18n-provider";

export function HomePage() {
  const { direction, locale, messages, toggleLocale } = useI18n();
  const brandName = locale === "fa" ? "پوینو" : appMetadata.name;
  const year = new Date().getFullYear();

  return (
    <div className="landing-shell" dir={direction}>
      <div className="landing-glow" aria-hidden />

      <header className="landing-topbar">
        <a className="landing-brand" href="#top">
          <span className="landing-brand-mark" aria-hidden>
            P
          </span>
          <span className="landing-brand-name">{brandName}</span>
        </a>

        <div className="landing-topbar-actions">
          <button
            className="landing-locale"
            onClick={toggleLocale}
            type="button"
          >
            {messages.switchLanguageLabel}
          </button>
          <Link className="landing-nav-link" to="/auth/login">
            {messages.loginNav}
          </Link>
          <Link to="/auth/register">
            <Button type="button">{messages.primaryCta}</Button>
          </Link>
        </div>
      </header>

      <main id="top">
        <section className="landing-hero">
          <p className="landing-hero-brand">{brandName}</p>
          <h1 className="landing-hero-title">{messages.heroTitle}</h1>
          <p className="landing-hero-copy">{messages.heroDescription}</p>

          <div className="landing-hero-actions">
            <Link to="/auth/register">
              <Button type="button">{messages.primaryCta}</Button>
            </Link>
            <a className="landing-secondary" href="#highlights">
              {messages.secondaryCta}
            </a>
          </div>

          <p className="landing-hero-promise">
            <span>{messages.socialProofLabel}</span>
            {messages.socialProofValue}
          </p>
        </section>

        <section className="landing-section" id="highlights">
          <div className="landing-section-heading">
            <h2>{messages.highlightsTitle}</h2>
            <p>{messages.highlightsDescription}</p>
          </div>

          <div className="landing-feature-grid">
            {messages.highlights.map((highlight, index) => (
              <article className="landing-feature" key={highlight.title}>
                <span className="landing-feature-index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="workflow">
          <div className="landing-section-heading">
            <h2>{messages.workflowTitle}</h2>
            <p>{messages.workflowDescription}</p>
          </div>

          <div className="landing-workflow">
            {messages.workflowSteps.map((step, index) => (
              <article className="landing-workflow-step" key={step.title}>
                <span className="landing-workflow-number" aria-hidden>
                  {index + 1}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="trust">
          <div className="landing-trust">
            <div className="landing-section-heading">
              <h2>{messages.trustTitle}</h2>
              <p>{messages.trustDescription}</p>
            </div>
            <ul className="landing-trust-list">
              {messages.trustItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="landing-cta">
          <div className="landing-cta-copy">
            <h2>{messages.finalCtaTitle}</h2>
            <p>{messages.finalCtaDescription}</p>
          </div>
          <Link to="/auth/register">
            <Button type="button">{messages.finalCtaButton}</Button>
          </Link>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-grid">
          <div className="landing-footer-brand">
            <div className="landing-brand">
              <span className="landing-brand-mark" aria-hidden>
                P
              </span>
              <span className="landing-brand-name">{brandName}</span>
            </div>
            <p>{messages.footer.tagline}</p>
          </div>

          <div className="landing-footer-col">
            <h3>{messages.footer.product}</h3>
            <a href="#highlights">{messages.footer.highlights}</a>
            <a href="#workflow">{messages.footer.workflow}</a>
            <a href="#trust">{messages.footer.trust}</a>
          </div>

          <div className="landing-footer-col">
            <h3>{messages.footer.company}</h3>
            <Link to="/auth/register">{messages.footer.register}</Link>
            <Link to="/auth/login">{messages.footer.login}</Link>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <span>
            © {year} {brandName}. {messages.footer.rights}
          </span>
        </div>
      </footer>
    </div>
  );
}
