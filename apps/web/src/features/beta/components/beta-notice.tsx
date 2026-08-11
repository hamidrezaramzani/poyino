import { Button } from "@poyino/ui";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useBetaNoticeDismissal } from "../hooks/use-beta-notice-dismissal";

export type BetaNoticeVariant = "landing" | "auth" | "dashboard" | "footer";

type BetaNoticeProps = {
  variant: BetaNoticeVariant;
};

export function BetaNotice({ variant }: BetaNoticeProps) {
  const { t } = useI18n();
  const { ready, visible, dismiss } = useBetaNoticeDismissal();

  if (!ready || !visible) {
    return null;
  }

  if (variant === "footer") {
    return (
      <footer className="beta-notice beta-notice--footer" role="status">
        <p>{t.beta.footer}</p>
      </footer>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className="beta-notice beta-notice--dashboard" role="status">
        <div className="beta-notice-body">
          <p className="beta-notice-title">{t.beta.dashboardTitle}</p>
          <p className="beta-notice-copy">{t.beta.dashboardBody}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="beta-notice-dismiss"
          onClick={dismiss}
          aria-label={t.beta.dismiss}
        >
          {t.beta.dismiss}
        </Button>
      </div>
    );
  }

  if (variant === "auth") {
    return (
      <div className="beta-notice beta-notice--auth" role="status">
        <div className="beta-notice-body">
          <p className="beta-notice-title">{t.beta.authTitle}</p>
          <p className="beta-notice-copy">{t.beta.authBody}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="beta-notice-dismiss"
          onClick={dismiss}
          aria-label={t.beta.dismiss}
        >
          {t.beta.dismiss}
        </Button>
      </div>
    );
  }

  return (
    <aside className="beta-notice beta-notice--landing" role="status">
      <div className="beta-notice-body">
        <p className="beta-notice-eyebrow">{t.beta.landingEyebrow}</p>
        <p className="beta-notice-title">{t.beta.landingTitle}</p>
        <div className="beta-notice-copy-stack">
          <p className="beta-notice-copy">{t.beta.landingBody}</p>
          <p className="beta-notice-copy">{t.beta.landingDetail}</p>
        </div>
        <p className="beta-notice-copy beta-notice-data-note">
          {t.beta.landingDataNote}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        className="beta-notice-dismiss"
        onClick={dismiss}
        aria-label={t.beta.dismiss}
      >
        {t.beta.dismiss}
      </Button>
    </aside>
  );
}
