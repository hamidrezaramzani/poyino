import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app";
import { I18nProvider } from "./shared/i18n/i18n-provider";
import { SessionProvider } from "./shared/session/session-provider";
import "./styles/fonts.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
