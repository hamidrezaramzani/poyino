import { appMetadata } from "@poyino/config";
import { Button, Card } from "@poyino/ui";
import { Link } from "react-router-dom";
import poyinoLogo from "../../../../docs/brand/logo/logo.png";
import { useI18n } from "../shared/i18n/i18n-provider";

export function HomePage() {
  const { direction, locale, messages, toggleLocale } = useI18n();

  return (
    <main className="page-shell" dir={direction}>
      <section className="hero-section">
        <header className="topbar">
          <div className="brand-lockup">
            <img
              alt={locale === "fa" ? "لوگوی پوینو" : "Poyino logo"}
              className="brand-logo"
              src={poyinoLogo}
            />
            <div>
              <strong className="brand-name">
                {locale === "fa" ? "پوینو" : appMetadata.name}
              </strong>
              <p className="brand-tagline">{appMetadata.tagline}</p>
            </div>
          </div>

          <button className="locale-toggle" onClick={toggleLocale} type="button">
            {messages.switchLanguageLabel}
          </button>
        </header>

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="hero-badge">{messages.heroBadge}</span>
            <h1>{messages.heroTitle}</h1>
            <p className="hero-description">{messages.heroDescription}</p>

            <div className="hero-actions">
              <Link to="/auth/register">
                <Button>{messages.primaryCta}</Button>
              </Link>
              <a className="secondary-action" href="#highlights">
                {messages.secondaryCta}
              </a>
            </div>

            <div className="social-proof">
              <span>{messages.socialProofLabel}</span>
              <strong>{messages.socialProofValue}</strong>
            </div>
          </div>

          <aside className="hero-panel">
            <div className="panel-header">
              <span className="panel-label">{messages.languageLabel}</span>
              <span className="panel-status">AI</span>
            </div>

            <div className="panel-stack">
              {messages.metrics.map((metric) => (
                <div className="metric-row" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="content-section" id="highlights">
        <div className="section-heading">
          <h2>{messages.highlightsTitle}</h2>
          <p>{messages.highlightsDescription}</p>
        </div>

        <div className="card-grid">
          {messages.highlights.map((highlight) => (
            <Card key={highlight.title} title={highlight.title}>
              <p>{highlight.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="content-section workflow-section">
        <div className="section-heading">
          <h2>{messages.workflowTitle}</h2>
          <p>{messages.workflowDescription}</p>
        </div>

        <div className="workflow-list">
          {messages.workflowSteps.map((step) => (
            <article className="workflow-item" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section trust-section">
        <div className="section-heading">
          <h2>{messages.trustTitle}</h2>
          <p>{messages.trustDescription}</p>
        </div>

        <ul className="trust-list">
          {messages.trustItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="final-cta">
        <div>
          <h2>{messages.finalCtaTitle}</h2>
          <p>{messages.finalCtaDescription}</p>
        </div>
        <Link to="/auth/register">
          <Button>{messages.finalCtaButton}</Button>
        </Link>
      </section>
    </main>
  );
}
