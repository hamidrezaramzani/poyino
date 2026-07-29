import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "./features/authentication/layouts/auth-layout";
import { LoginPage } from "./features/authentication/pages/login-page";
import { RegisterPage } from "./features/authentication/pages/register-page";
import { VerifyEmailPage } from "./features/authentication/pages/verify-email-page";
import { HomePage } from "./pages/home-page";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
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
