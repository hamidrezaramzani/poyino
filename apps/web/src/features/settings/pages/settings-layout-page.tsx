import { NavLink, Outlet } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";

const TABS = [
  { to: "/settings/general", key: "general" as const },
  { to: "/settings/profile", key: "profile" as const },
  { to: "/settings/branding", key: "branding" as const },
  { to: "/settings/notifications", key: "notifications" as const },
];

export function SettingsLayoutPage() {
  const { t } = useI18n();

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>{t.settings.title}</h1>
        <p>{t.settings.description}</p>
      </header>

      <nav className="settings-tabs" aria-label={t.settings.tabsLabel}>
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              ["settings-tab", isActive ? "is-active" : ""].filter(Boolean).join(" ")
            }
          >
            {t.settings.tabs[tab.key]}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
