import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { App } from "./app";
import { OrganizationBrandingProvider } from "./shared/branding/organization-branding-provider";
import { AppConfigProvider } from "./shared/config/app-config-provider";
import { I18nProvider } from "./shared/i18n/i18n-provider";
import { PwaPrompts, registerPwa } from "./shared/pwa";
import { SessionProvider } from "./shared/session/session-provider";
import "./styles/fonts.css";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider>
      <AppConfigProvider>
        <SessionProvider>
          <OrganizationBrandingProvider>
            <RouterProvider router={router} />
            <PwaPrompts />
            <Toaster
              theme="dark"
              position="bottom-right"
              richColors
              closeButton
              dir="auto"
              className="poyino-toaster"
              toastOptions={{
                className: "poyino-toast",
              }}
            />
          </OrganizationBrandingProvider>
        </SessionProvider>
      </AppConfigProvider>
    </I18nProvider>
  </React.StrictMode>,
);

// Register the service worker after the initial UI mounts.
registerPwa();
