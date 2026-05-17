import { Link } from "react-router-dom";

import { useAppStatus } from "../lib/app-status";

export function Header() {
  const { canInstall, installApp, installMethod, isInstalled, isOnline } = useAppStatus();

  return (
    <header className="sticky top-0 z-20 mb-6 pt-[max(env(safe-area-inset-top),0px)]">
      <div className="glass-panel rounded-[1.75rem] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">
              Mobile briefing app
            </p>
            <Link
              to="/"
              className="mt-1 block text-[2rem] leading-none text-text-main"
            >
              LandingBrief
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
                Offline
              </span>
            ) : null}
            {canInstall && installMethod === "native-prompt" ? (
              <button
                type="button"
                onClick={() => {
                  void installApp();
                }}
                className="button-primary rounded-full px-3 py-2 text-xs font-medium transition hover:brightness-110"
              >
                Install
              </button>
            ) : canInstall && installMethod === "ios-manual" ? (
              <Link
                to="/settings"
                className="button-primary rounded-full px-3 py-2 text-xs font-medium transition hover:brightness-110"
              >
                Add to Home Screen
              </Link>
            ) : (
              <div className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
                {isInstalled ? "Installed" : "Travel mode"}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function HomeTopChrome() {
  return (
    <header className="home-top-chrome px-4 pt-[max(env(safe-area-inset-top),1rem)] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="home-top-chrome-mark flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">Portable country intelligence</p>
            <Link to="/" className="mt-1 block text-[1.35rem] leading-none text-text-main sm:text-[1.55rem]">
              LandingBrief
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
