import { Card } from "../components/card";
import { SectionHeading } from "../components/section-heading";
import { useAppStatus } from "../lib/app-status";
import { useOfflineLibrary } from "../hooks/use-offline-library";

export function SettingsPage() {
  const {
    canInstall,
    installApp,
    installHint,
    installInstructions,
    installLabel,
    installMethod,
    isInstalled,
    isOnline
  } = useAppStatus();
  const library = useOfflineLibrary();

  return (
    <>
      <SectionHeading
        title="Settings"
        description="Install the app, check offline readiness, and confirm what is already stored on this device."
      />

      <Card title="Install app" eyebrow="PWA">
        <div className="space-y-3">
          <div className="rounded-[1.35rem] border border-border-soft bg-surface-muted/55 p-4">
            <p className="text-sm font-medium text-text-main">
              {isInstalled ? "LandingBrief is already installed." : installHint}
            </p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Installing helps the app feel native and keeps the offline-ready shell close at hand while travelling.
            </p>
          </div>
          {installMethod === "native-prompt" && canInstall ? (
            <button
              type="button"
              onClick={() => {
                void installApp();
              }}
              className="button-primary inline-flex rounded-full px-4 py-3 text-sm font-medium"
            >
              {installLabel}
            </button>
          ) : null}
          {installMethod === "ios-manual" && !isInstalled ? (
            <div className="space-y-3">
              <div className="pill-chip inline-flex rounded-full px-4 py-2 text-sm font-medium">
                {installLabel}
              </div>
              <ol className="space-y-2 text-sm leading-6 text-text-main">
                {installInstructions.map((instruction) => (
                  <li
                    key={instruction}
                    className="rounded-2xl border border-border-soft bg-surface-muted/35 px-4 py-3"
                  >
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          {installMethod === "ios-open-in-safari" && !isInstalled ? (
            <div className="space-y-3">
              <div className="pill-chip inline-flex rounded-full px-4 py-2 text-sm font-medium">
                {installLabel}
              </div>
              <ol className="space-y-2 text-sm leading-6 text-text-main">
                {installInstructions.map((instruction) => (
                  <li
                    key={instruction}
                    className="rounded-2xl border border-border-soft bg-surface-muted/35 px-4 py-3"
                  >
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          {!isInstalled && installMethod === "none" && !canInstall ? (
            <div className="pill-chip inline-flex rounded-full px-4 py-2 text-sm font-medium">
              Install prompt unavailable on this browser right now
            </div>
          ) : null}
          {isInstalled ? (
            <div className="pill-chip inline-flex rounded-full px-4 py-2 text-sm font-medium">
              Installed
            </div>
          ) : (
            null
          )}
        </div>
      </Card>

      <Card title="Offline readiness" eyebrow="Status">
        <div className="divide-y divide-border-soft">
          <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
            <div>
              <p className="text-sm font-medium text-text-main">Connectivity</p>
              <p className="mt-1 text-sm text-text-muted">
                {isOnline ? "Online and ready to refresh country data." : "Offline mode is active."}
              </p>
            </div>
            <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium text-text-main">Saved briefs</p>
              <p className="mt-1 text-sm text-text-muted">
                Pinned country briefs available from this device.
              </p>
            </div>
            <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
              {library.savedCountries.length}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium text-text-main">Recent countries</p>
              <p className="mt-1 text-sm text-text-muted">
                Most recently opened briefs that can be revisited quickly.
              </p>
            </div>
            <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
              {library.recentCountries.length}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
            <div>
              <p className="text-sm font-medium text-text-main">Saved notes</p>
              <p className="mt-1 text-sm text-text-muted">
                Per-country reminders kept offline in local storage.
              </p>
            </div>
            <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
              {Object.keys(library.notes).length}
            </span>
          </div>
        </div>
      </Card>
    </>
  );
}
