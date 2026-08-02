import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AnalyticsPage } from "./features/analytics/pages/analytics-page";
import { AuthLayout } from "./features/authentication/layouts/auth-layout";
import { ForgotPasswordPage } from "./features/authentication/pages/forgot-password-page";
import { LoginPage } from "./features/authentication/pages/login-page";
import { RegisterPage } from "./features/authentication/pages/register-page";
import { ResetPasswordPage } from "./features/authentication/pages/reset-password-page";
import { VerifyEmailPage } from "./features/authentication/pages/verify-email-page";
import { CandidateDetailsPage } from "./features/candidates/pages/candidate-details-page";
import { CandidateListPage } from "./features/candidates/pages/candidate-list-page";
import { OrgCandidatesPage } from "./features/candidates/pages/org-candidates-page";
import { DashboardLayout } from "./features/dashboard/layouts/dashboard-layout";
import { DashboardOverviewPage } from "./features/dashboard/pages/dashboard-overview-page";
import { InterviewCalendarPage } from "./features/interviews/pages/interview-calendar-page";
import { InterviewProcessPage } from "./features/interviews/pages/interview-process-page";
import { CreateJobPage } from "./features/jobs/pages/create-job-page";
import { EditJobPage } from "./features/jobs/pages/edit-job-page";
import { JobDetailsPage } from "./features/jobs/pages/job-details-page";
import { JobListPage } from "./features/jobs/pages/job-list-page";
import { BrandingSettingsPage } from "./features/settings/pages/branding-settings-page";
import { GeneralSettingsPage } from "./features/settings/pages/general-settings-page";
import { MembersSettingsPage } from "./features/settings/pages/members-settings-page";
import { NotificationSettingsPage } from "./features/settings/pages/notification-settings-page";
import { ProfileSettingsPage } from "./features/settings/pages/profile-settings-page";
import { SettingsLayoutPage } from "./features/settings/pages/settings-layout-page";
import { ApplyPage } from "./features/public-job/pages/apply-page";
import { ApplySuccessPage } from "./features/public-job/pages/apply-success-page";
import { PublicJobPage } from "./features/public-job/pages/public-job-page";
import { TrackingPage } from "./features/public-job/pages/tracking-page";
import { HomePage } from "./pages/home-page";
import { PermissionGate } from "./shared/permissions/permission-gate";
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

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<AuthenticatedShell />}>
        <Route path="/dashboard" element={<DashboardOverviewPage />} />
        <Route path="/jobs" element={<JobListPage />} />
        <Route
          path="/jobs/create"
          element={
            <PermissionGate permission="jobs:create" fallback="redirect">
              <CreateJobPage />
            </PermissionGate>
          }
        />
        <Route path="/jobs/new" element={<Navigate to="/jobs/create" replace />} />
        <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
        <Route
          path="/jobs/:jobId/edit"
          element={
            <PermissionGate permission="jobs:update" fallback="redirect">
              <EditJobPage />
            </PermissionGate>
          }
        />
        <Route
          path="/jobs/:jobId/candidates"
          element={<CandidateListPage />}
        />
        <Route
          path="/jobs/:jobId/candidates/:candidateId"
          element={<CandidateDetailsPage />}
        />
        <Route
          path="/jobs/:jobId/candidates/:candidateId/interviews"
          element={<InterviewProcessPage />}
        />
        <Route path="/candidates" element={<OrgCandidatesPage />} />
        <Route path="/interviews" element={<InterviewCalendarPage />} />
        <Route
          path="/reports"
          element={
            <PermissionGate permission="reports:view" fallback="redirect">
              <AnalyticsPage />
            </PermissionGate>
          }
        />
        <Route path="/settings" element={<SettingsLayoutPage />}>
          <Route index element={<Navigate to="general" replace />} />
          <Route path="general" element={<GeneralSettingsPage />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
          <Route path="branding" element={<BrandingSettingsPage />} />
          <Route path="notifications" element={<NotificationSettingsPage />} />
          <Route
            path="members"
            element={
              <PermissionGate permission="members:view" fallback="redirect">
                <MembersSettingsPage />
              </PermissionGate>
            }
          />
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
      <Route path="/tracking/:token" element={<TrackingPage />} />
      <Route path="/:orgSlug/jobs/:jobId" element={<PublicJobPage />} />
      <Route path="/:orgSlug/jobs/:jobId/apply" element={<ApplyPage />} />
      <Route
        path="/:orgSlug/jobs/:jobId/apply/success"
        element={<ApplySuccessPage />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
