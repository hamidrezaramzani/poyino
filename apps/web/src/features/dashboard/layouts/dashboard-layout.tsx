import { useState, type PropsWithChildren } from "react";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useSession } from "../../../shared/session/session-provider";
import { DashboardSidebar } from "../components/dashboard-sidebar";

export function DashboardLayout({ children }: PropsWithChildren) {
  const { t, direction, toggleLocale } = useI18n();
  const { user } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const organizationName =
    user?.organization.name ?? t.dashboard.sidebar.organizationFallback;

  return (
    <div className="dashboard-shell" dir={direction}>
      <DashboardSidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen ? (
        <button
          type="button"
          className="dashboard-sidebar-backdrop"
          aria-label={t.dashboard.closeSidebar}
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="dashboard-main-column">
        <header className="dashboard-header">
          <div className="dashboard-header-start">
            <button
              type="button"
              className="dashboard-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label={t.dashboard.openSidebar}
            >
              ☰
            </button>
            <div>
              <p className="dashboard-org-name">{organizationName}</p>
              <p className="dashboard-page-label">{t.dashboard.nav.overview}</p>
            </div>
          </div>

          <div className="dashboard-header-actions">
            <button
              type="button"
              className="language-toggle"
              onClick={toggleLocale}
            >
              {t.switchLanguageLabel}
            </button>
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
