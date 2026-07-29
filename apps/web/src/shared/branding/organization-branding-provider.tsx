import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useSession } from "../session/session-provider";
import {
  fetchBrandingSettings,
  resolveAuthenticatedImageUrl,
} from "../../features/settings/services/settings.service";

type OrganizationBranding = {
  logoUrl: string | null;
  darkLogoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  status: "idle" | "loading" | "ready" | "error";
  refresh: () => Promise<void>;
};

const OrganizationBrandingContext =
  createContext<OrganizationBranding | null>(null);

const DEFAULT_PRIMARY = "#150578";
const DEFAULT_SECONDARY = "#3943B7";

export function OrganizationBrandingProvider({
  children,
}: PropsWithChildren) {
  const { status: sessionStatus } = useSession();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [darkLogoUrl, setDarkLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string | null>(null);
  const [secondaryColor, setSecondaryColor] = useState<string | null>(null);
  const [status, setStatus] = useState<OrganizationBranding["status"]>("idle");

  const refresh = useCallback(async () => {
    if (sessionStatus !== "authenticated") {
      setLogoUrl(null);
      setDarkLogoUrl(null);
      setPrimaryColor(null);
      setSecondaryColor(null);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetchBrandingSettings();
      const settings = response.settings;
      if (!settings) {
        throw new Error("Missing branding settings");
      }

      const [logo, darkLogo] = await Promise.all([
        resolveAuthenticatedImageUrl(settings.logoUrl),
        resolveAuthenticatedImageUrl(settings.darkLogoUrl),
      ]);

      setLogoUrl(logo);
      setDarkLogoUrl(darkLogo);
      setPrimaryColor(settings.primaryColor);
      setSecondaryColor(settings.secondaryColor);
      document.documentElement.style.setProperty(
        "--ui-primary",
        settings.primaryColor || DEFAULT_PRIMARY,
      );
      document.documentElement.style.setProperty(
        "--ui-accent",
        settings.secondaryColor || DEFAULT_SECONDARY,
      );
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [sessionStatus]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<OrganizationBranding>(
    () => ({
      logoUrl,
      darkLogoUrl,
      primaryColor,
      secondaryColor,
      status,
      refresh,
    }),
    [darkLogoUrl, logoUrl, primaryColor, refresh, secondaryColor, status],
  );

  return (
    <OrganizationBrandingContext.Provider value={value}>
      {children}
    </OrganizationBrandingContext.Provider>
  );
}

export function useOrganizationBranding() {
  const context = useContext(OrganizationBrandingContext);
  if (!context) {
    throw new Error(
      "useOrganizationBranding must be used within OrganizationBrandingProvider",
    );
  }
  return context;
}
