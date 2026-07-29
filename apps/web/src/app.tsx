import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthLayout } from "./features/authentication/layouts/auth-layout";
import { ForgotPasswordPage } from "./features/authentication/pages/forgot-password-page";
import { LoginPage } from "./features/authentication/pages/login-page";
import { RegisterPage } from "./features/authentication/pages/register-page";
import { ResetPasswordPage } from "./features/authentication/pages/reset-password-page";
import { VerifyEmailPage } from "./features/authentication/pages/verify-email-page";
import { DashboardLayout } from "./features/dashboard/layouts/dashboard-layout";
import { DashboardOverviewPage } from "./features/dashboard/pages/dashboard-overview-page";
import { ModulePlaceholderPage } from "./features/dashboard/pages/module-placeholder-page";
import { BrandingSettingsPage } from "./features/settings/pages/branding-settings-page";
import { GeneralSettingsPage } from "./features/settings/pages/general-settings-page";
import { NotificationSettingsPage } from "./features/settings/pages/notification-settings-page";
import { ProfileSettingsPage } from "./features/settings/pages/profile-settings-page";
import { SettingsLayoutPage } from "./features/settings/pages/settings-layout-page";
import { HomePage } from "./pages/home-page";
import { useI18n } from "./shared/i18n/i18n-provider";
import { ProtectedRoute } from "./shared/session/protected-route";

function AuthenticatedShell() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function JobsPlaceholder() {
  const { t } = useI18n();
  return (
    <ModulePlaceholderPage
      title={t.dashboard.nav.jobList}
      description={t.dashboard.nav.jobs}
    />
  );
}

function CreateJobPlaceholder() {
  const { t } = useI18n();
  return <ModulePlaceholderPage title={t.dashboard.nav.createJob} />;
}

function CandidatesPlaceholder() {
  const { t } = useI18n();
  return <ModulePlaceholderPage title={t.dashboard.nav.candidates} />;
}

function InterviewsPlaceholder() {
  const { t } = useI18n();
  return <ModulePlaceholderPage title={t.dashboard.nav.interviews} />;
}

function ReportsPlaceholder() {
  const { t } = useI18n();
  return <ModulePlaceholderPage title={t.dashboard.nav.reports} />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<AuthenticatedShell />}>
        <Route path="/dashboard" element={<DashboardOverviewPage />} />
        <Route path="/jobs" element={<JobsPlaceholder />} />
        <Route path="/jobs/create" element={<CreateJobPlaceholder />} />
        <Route path="/jobs/new" element={<Navigate to="/jobs/create" replace />} />
        <Route path="/jobs/:jobId" element={<JobsPlaceholder />} />
        <Route path="/jobs/:jobId/edit" element={<JobsPlaceholder />} />
        <Route path="/candidates" element={<CandidatesPlaceholder />} />
        <Route path="/candidates/:candidateId" element={<CandidatesPlaceholder />} />
        <Route path="/interviews" element={<InterviewsPlaceholder />} />
        <Route path="/reports" element={<ReportsPlaceholder />} />
        <Route path="/settings" element={<SettingsLayoutPage />}>
          <Route index element={<Navigate to="general" replace />} />
          <Route path="general" element={<GeneralSettingsPage />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
          <Route path="branding" element={<BrandingSettingsPage />} />
          <Route path="notifications" element={<NotificationSettingsPage />} />
        </Route>
        <Route path="/profile" element={<Navigate to="/settings/profile" replace />} />
      </Route>
      <Route
        path="/auth/register"
        element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        }
      />
      <Route
        path="/auth/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/auth/forgot-password"
        element={
          <AuthLayout>
            <ForgotPasswordPage />
          </AuthLayout>
        }
      />
      <Route
        path="/auth/reset-password"
        element={
          <AuthLayout>
            <ResetPasswordPage />
          </AuthLayout>
        }
      />
      <Route
        path="/auth/verify-email"
        element={
          <AuthLayout>
            <VerifyEmailPage />
          </AuthLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
