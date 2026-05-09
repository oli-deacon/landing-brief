import { Link } from "react-router-dom";

import { useAppStatus } from "../lib/app-status";

export function Header() {
  const { canInstall, installApp, isInstalled, isOnline } = useAppStatus();

  return (
    <header className="sticky top-0 z-10 mb-6">
      <div className="rounded-[1.75rem] border border-border-soft bg-surface px-5 py-4 shadow-card backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Mobile briefing app
            </p>
            <Link to="/" className="mt-1 block text-2xl font-semibold tracking-tight text-text-main">
              LandingBrief
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                Offline
              </span>
            ) : null}
            {canInstall ? (
              <button
                type="button"
                onClick={() => {
                  void installApp();
                }}
                className="rounded-full bg-accent px-3 py-2 text-xs font-medium text-white transition hover:brightness-105"
              >
                Install
              </button>
            ) : (
              <div className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                {isInstalled ? "Installed" : "Travel mode"}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
