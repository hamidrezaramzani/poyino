import { usePwaInstall } from "./use-pwa-install";
import { usePwaUpdate } from "./use-pwa-update";

/** Floating prompts for app install and service-worker updates. */
export function PwaPrompts() {
  const { canInstall, install, dismiss } = usePwaInstall();
  const { updateAvailable, applyUpdate } = usePwaUpdate();

  if (!canInstall && !updateAvailable) {
    return null;
  }

  return (
    <div className="pwa-prompts" role="region" aria-label="App updates">
      {updateAvailable ? (
        <div className="pwa-prompt pwa-prompt--update">
          <div className="pwa-prompt__copy">
            <strong>Update available</strong>
            <span>A new version of Poyino is ready.</span>
          </div>
          <div className="pwa-prompt__actions">
            <button type="button" className="pwa-prompt__button" onClick={applyUpdate}>
              Refresh
            </button>
          </div>
        </div>
      ) : null}

      {canInstall ? (
        <div className="pwa-prompt pwa-prompt--install">
          <div className="pwa-prompt__copy">
            <strong>Install Poyino</strong>
            <span>Add the app to your device for faster access.</span>
          </div>
          <div className="pwa-prompt__actions">
            <button type="button" className="pwa-prompt__button pwa-prompt__button--ghost" onClick={dismiss}>
              Not now
            </button>
            <button
              type="button"
              className="pwa-prompt__button"
              onClick={() => {
                void install();
              }}
            >
              Install
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
