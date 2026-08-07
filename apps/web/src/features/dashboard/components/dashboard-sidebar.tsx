import { Avatar, Skeleton, Tooltip } from "@poyino/ui";
import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useOrganizationBranding } from "../../../shared/branding/organization-branding-provider";
import { useAppConfig } from "../../../shared/config/app-config-provider";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useCan } from "../../../shared/permissions/can";
import { useIsPlatformAdmin } from "../../../shared/permissions/use-platform-admin";
import { useSession } from "../../../shared/session/session-provider";
import { logoutUser } from "../services/auth-session.service";
import {
  CalendarIcon,
  ChevronDownIcon,
  FileSpreadsheetIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  ListIcon,
  MessageSquareIcon,
  PanelLeftIcon,
  PlusIcon,
  SettingsIcon,
  UsersIcon,
} from "./dashboard-icons";
import { LogoutConfirmDialog } from "./logout-confirm-dialog";

const COLLAPSED_STORAGE_KEY = "poyino.sidebar.collapsed";

type DashboardSidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function DashboardSidebar({
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const { t } = useI18n();
  const { user, status, clearSession } = useSession();
  const { logoUrl, darkLogoUrl } = useOrganizationBranding();
  const canCreateJob = useCan("jobs:create");
  const canViewReports = useCan("reports:view");
  const canViewSettings = useCan("organization:view");
  const canViewSupport = useCan("support:view");
  const canViewFeedback = useCan("feedback:view");
  const { isBeta } = useAppConfig();
  const isPlatformAdmin = useIsPlatformAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(readCollapsedPreference);
  const [jobsOpen, setJobsOpen] = useState(
    location.pathname.startsWith("/jobs"),
  );
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/jobs")) {
      setJobsOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    window.localStorage.setItem(
      COLLAPSED_STORAGE_KEY,
      collapsed ? "1" : "0",
    );
  }, [collapsed]);

  const organizationName =
    user?.organization.name ?? t.dashboard.sidebar.organizationFallback;
  const email = user?.email ?? "";
  const brandLogoUrl = darkLogoUrl ?? logoUrl;

  async function confirmLogout() {
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch {
      // Still clear local session so the user can leave the app.
    } finally {
      clearSession();
      setLoggingOut(false);
      setLogoutOpen(false);
      navigate("/auth/login", { replace: true });
    }
  }

  const loading = status === "loading";

  return (
    <>
      <aside
        className={[
          "dashboard-sidebar",
          collapsed ? "is-collapsed" : "",
          mobileOpen ? "is-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={t.dashboard.sidebarLabel}
      >
        <div className="dashboard-sidebar-brand">
          <Link
            to="/dashboard"
            className="dashboard-brand"
            onClick={onMobileClose}
          >
            <span className="dashboard-brand-mark" aria-hidden>
              {brandLogoUrl ? (
                <img
                  src={brandLogoUrl}
                  alt=""
                  className="dashboard-brand-logo"
                />
              ) : (
                "P"
              )}
            </span>
            {!collapsed ? (
              <span className="dashboard-brand-copy">
                <strong>Poyino</strong>
                <span>{organizationName}</span>
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="dashboard-sidebar-close"
            onClick={onMobileClose}
            aria-label={t.dashboard.closeSidebar}
          >
            ×
          </button>
          <button
            type="button"
            className="dashboard-collapse-toggle"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={
              collapsed
                ? t.dashboard.sidebar.expand
                : t.dashboard.sidebar.collapse
            }
          >
            <PanelLeftIcon size={18} />
          </button>
        </div>

        <nav className="dashboard-nav" aria-label={t.dashboard.sidebarLabel}>
          {loading ? (
            <div className="dashboard-sidebar-skeleton">
              <Skeleton height="2.25rem" />
              <Skeleton height="2.25rem" />
              <Skeleton height="2.25rem" />
              <Skeleton height="2.25rem" />
            </div>
          ) : (
            <>
              <SidebarLink
                to="/dashboard"
                label={t.dashboard.nav.overview}
                icon={<LayoutDashboardIcon size={18} />}
                collapsed={collapsed}
                end
                onNavigate={onMobileClose}
              />

              <div className="dashboard-nav-group">
                <button
                  type="button"
                  className={`dashboard-nav-group-trigger${
                    location.pathname.startsWith("/jobs") ? " is-active" : ""
                  }`}
                  aria-expanded={jobsOpen}
                  onClick={() => {
                    if (collapsed) {
                      navigate("/jobs");
                      onMobileClose();
                      return;
                    }
                    setJobsOpen((open) => !open);
                  }}
                  title={collapsed ? t.dashboard.nav.jobs : undefined}
                >
                  <ListIcon size={18} />
                  {!collapsed ? <span>{t.dashboard.nav.jobs}</span> : null}
                  {!collapsed ? (
                    <ChevronDownIcon
                      size={16}
                      style={{
                        marginInlineStart: "auto",
                        transform: jobsOpen ? "rotate(180deg)" : undefined,
                        transition: "transform 0.15s ease",
                      }}
                    />
                  ) : null}
                </button>
                {!collapsed && jobsOpen ? (
                  <div className="dashboard-nav-children">
                    {canCreateJob ? (
                      <SidebarLink
                        to="/jobs/create"
                        label={t.dashboard.nav.createJob}
                        icon={<PlusIcon size={16} />}
                        collapsed={false}
                        onNavigate={onMobileClose}
                      />
                    ) : null}
                    <SidebarLink
                      to="/jobs"
                      label={t.dashboard.nav.jobList}
                      icon={<ListIcon size={16} />}
                      collapsed={false}
                      end
                      onNavigate={onMobileClose}
                    />
                  </div>
                ) : null}
              </div>

              <SidebarLink
                to="/candidates"
                label={t.dashboard.nav.candidates}
                icon={<UsersIcon size={18} />}
                collapsed={collapsed}
                onNavigate={onMobileClose}
              />
              <SidebarLink
                to="/interviews"
                label={t.dashboard.nav.interviews}
                icon={<CalendarIcon size={18} />}
                collapsed={collapsed}
                onNavigate={onMobileClose}
              />
              {canViewSupport ? (
                <SidebarLink
                  to="/dashboard/support"
                  label={t.dashboard.nav.support}
                  icon={<LifeBuoyIcon size={18} />}
                  collapsed={collapsed}
                  onNavigate={onMobileClose}
                />
              ) : null}
              {canViewFeedback && isBeta ? (
                <SidebarLink
                  to="/dashboard/feedback"
                  label={t.dashboard.nav.feedback}
                  icon={<MessageSquareIcon size={18} />}
                  collapsed={collapsed}
                  onNavigate={onMobileClose}
                />
              ) : null}
              {isPlatformAdmin ? (
                <SidebarLink
                  to="/admin/support"
                  label={t.dashboard.nav.supportTickets}
                  icon={<LifeBuoyIcon size={18} />}
                  collapsed={collapsed}
                  onNavigate={onMobileClose}
                />
              ) : null}
              {isPlatformAdmin && isBeta ? (
                <SidebarLink
                  to="/admin/feedback"
                  label={t.dashboard.nav.adminFeedback}
                  icon={<MessageSquareIcon size={18} />}
                  collapsed={collapsed}
                  onNavigate={onMobileClose}
                />
              ) : null}
              {canViewReports ? (
                <SidebarLink
                  to="/reports"
                  label={t.dashboard.nav.reports}
                  icon={<FileSpreadsheetIcon size={18} />}
                  collapsed={collapsed}
                  onNavigate={onMobileClose}
                />
              ) : null}
              {canViewSettings ? (
                collapsed ? (
                  <Tooltip content={t.dashboard.nav.settings}>
                    <NavLink
                      to="/settings/general"
                      className={() =>
                        `dashboard-nav-link${
                          location.pathname.startsWith("/settings")
                            ? " is-active"
                            : ""
                        }`
                      }
                      onClick={onMobileClose}
                      title={t.dashboard.nav.settings}
                    >
                      <SettingsIcon size={18} />
                    </NavLink>
                  </Tooltip>
                ) : (
                  <NavLink
                    to="/settings/general"
                    className={() =>
                      `dashboard-nav-link${
                        location.pathname.startsWith("/settings")
                          ? " is-active"
                          : ""
                      }`
                    }
                    onClick={onMobileClose}
                  >
                    <SettingsIcon size={18} />
                    <span>{t.dashboard.nav.settings}</span>
                  </NavLink>
                )
              ) : null}
            </>
          )}
        </nav>

        <div className="dashboard-sidebar-footer">
          {loading ? (
            <Skeleton height="3.25rem" borderRadius="0.9rem" />
          ) : (
            <div className="dashboard-sidebar-user">
              <button
                type="button"
                className="dashboard-sidebar-user-trigger"
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                onClick={() => setUserMenuOpen((open) => !open)}
                title={collapsed ? email || organizationName : undefined}
              >
                <Avatar name={email || organizationName} size={36} />
                {!collapsed ? (
                  <span className="dashboard-sidebar-user-copy">
                    <strong>{organizationName}</strong>
                    <span>{email}</span>
                  </span>
                ) : null}
              </button>
              {userMenuOpen ? (
                <div className="dashboard-user-dropdown" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onMobileClose();
                      navigate("/settings/profile");
                    }}
                  >
                    {t.dashboard.userMenu.profile}
                  </button>
                  {canViewSettings ? (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onMobileClose();
                        navigate("/settings/general");
                      }}
                    >
                      {t.dashboard.userMenu.settings}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setLogoutOpen(true);
                    }}
                  >
                    {t.dashboard.userMenu.logout}
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </aside>

      <LogoutConfirmDialog
        open={logoutOpen}
        loading={loggingOut}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          void confirmLogout();
        }}
      />
    </>
  );
}

type SidebarLinkProps = {
  to: string;
  label: string;
  icon: ReactNode;
  collapsed: boolean;
  end?: boolean;
  onNavigate: () => void;
};

function SidebarLink({
  to,
  label,
  icon,
  collapsed,
  end,
  onNavigate,
}: SidebarLinkProps) {
  const link = (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `dashboard-nav-link${isActive ? " is-active" : ""}`
      }
      onClick={onNavigate}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed ? <span>{label}</span> : null}
    </NavLink>
  );

  if (!collapsed) {
    return link;
  }

  return <Tooltip content={label}>{link}</Tooltip>;
}

function readCollapsedPreference() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === "1";
}
