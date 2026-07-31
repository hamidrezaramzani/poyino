import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { buildDashboardBreadcrumbs } from "../lib/build-dashboard-breadcrumbs";

export function DashboardBreadcrumbs() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const crumbs = buildDashboardBreadcrumbs({ pathname, t });

  return (
    <nav
      className="dashboard-breadcrumbs"
      aria-label={t.dashboard.breadcrumbsLabel}
    >
      <ol className="dashboard-breadcrumbs-list">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={`${crumb.label}-${index}`} className="dashboard-breadcrumb">
              {index > 0 ? (
                <span className="dashboard-breadcrumb-separator" aria-hidden>
                  /
                </span>
              ) : null}
              {crumb.to && !isLast ? (
                <Link to={crumb.to} className="dashboard-breadcrumb-link">
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="dashboard-breadcrumb-current"
                  aria-current={isLast ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
