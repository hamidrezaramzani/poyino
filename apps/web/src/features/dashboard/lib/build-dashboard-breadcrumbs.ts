import type { Translation } from "../../../shared/i18n/translations";

export type DashboardBreadcrumb = {
  label: string;
  to?: string;
};

type BuildDashboardBreadcrumbsOptions = {
  pathname: string;
  t: Translation;
};

const SETTINGS_TABS = new Set([
  "general",
  "profile",
  "branding",
  "notifications",
]);

export function buildDashboardBreadcrumbs({
  pathname,
  t,
}: BuildDashboardBreadcrumbsOptions): DashboardBreadcrumb[] {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: t.dashboard.nav.overview }];
  }

  const [root, second, third, fourth] = segments;

  switch (root) {
    case "dashboard":
      return [{ label: t.dashboard.nav.overview }];

    case "jobs":
      return buildJobsBreadcrumbs(second, third, fourth, t);

    case "candidates":
      if (second) {
        return [
          { label: t.dashboard.nav.candidates, to: "/candidates" },
          { label: t.jobs.list.actions.details },
        ];
      }
      return [{ label: t.dashboard.nav.candidates }];

    case "interviews":
      return [{ label: t.dashboard.nav.interviews }];

    case "reports":
      return [{ label: t.dashboard.nav.reports }];

    case "settings":
      return buildSettingsBreadcrumbs(second, t);

    default:
      return [{ label: t.dashboard.nav.overview }];
  }
}

function buildJobsBreadcrumbs(
  second: string | undefined,
  third: string | undefined,
  fourth: string | undefined,
  t: Translation,
): DashboardBreadcrumb[] {
  const jobsRoot: DashboardBreadcrumb = {
    label: t.dashboard.nav.jobs,
    to: "/jobs",
  };

  if (!second) {
    return [{ label: t.dashboard.nav.jobs }];
  }

  if (second === "create" || second === "new") {
    return [jobsRoot, { label: t.dashboard.nav.createJob }];
  }

  const jobLabel = t.jobs.details.title;
  const jobCrumb: DashboardBreadcrumb = {
    label: jobLabel,
    to: `/jobs/${second}`,
  };

  if (!third) {
    return [jobsRoot, { label: jobLabel }];
  }

  if (third === "edit") {
    return [jobsRoot, jobCrumb, { label: t.jobs.details.actions.edit }];
  }

  if (third === "candidates") {
    const candidatesCrumb: DashboardBreadcrumb = {
      label: t.dashboard.nav.candidates,
      to: `/jobs/${second}/candidates`,
    };

    if (!fourth) {
      return [jobsRoot, jobCrumb, { label: t.dashboard.nav.candidates }];
    }

    return [
      jobsRoot,
      jobCrumb,
      candidatesCrumb,
      { label: t.candidates.details.title },
    ];
  }

  return [jobsRoot, { label: jobLabel }];
}

function buildSettingsBreadcrumbs(
  tab: string | undefined,
  t: Translation,
): DashboardBreadcrumb[] {
  const settingsRoot: DashboardBreadcrumb = {
    label: t.dashboard.nav.settings,
    to: "/settings/general",
  };

  if (!tab || !SETTINGS_TABS.has(tab)) {
    return [{ label: t.dashboard.nav.settings }];
  }

  return [
    settingsRoot,
    { label: t.settings.tabs[tab as keyof typeof t.settings.tabs] },
  ];
}
