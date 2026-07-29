import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "./features/authentication/layouts/auth-layout";
import { ForgotPasswordPage } from "./features/authentication/pages/forgot-password-page";
import { LoginPage } from "./features/authentication/pages/login-page";
import { RegisterPage } from "./features/authentication/pages/register-page";
import { ResetPasswordPage } from "./features/authentication/pages/reset-password-page";
import { VerifyEmailPage } from "./features/authentication/pages/verify-email-page";
import { DashboardPage } from "./pages/dashboard-page";
import { HomePage } from "./pages/home-page";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
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
