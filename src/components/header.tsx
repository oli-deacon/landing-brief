import { Link } from "react-router-dom";

import { useAppStatus } from "../lib/app-status";

export function Header() {
  const { canInstall, installApp, isInstalled, isOnline } = useAppStatus();

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
            {canInstall ? (
              <button
                type="button"
                onClick={() => {
                  void installApp();
                }}
                className="button-primary rounded-full px-3 py-2 text-xs font-medium transition hover:brightness-110"
              >
                Install
              </button>
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
