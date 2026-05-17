import { Link, NavLink } from "react-router-dom";

import { useAppStatus } from "../lib/app-status";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/saved", label: "Saved" }
];

export function AdaptiveNav() {
  const { canInstall, installApp, installMethod, isInstalled, isOnline } = useAppStatus();

  return (
    <header className="sticky top-0 z-30 px-4 pt-[max(env(safe-area-inset-top),1rem)] sm:px-6 lg:px-8">
      <div className="nav-surface mx-auto flex w-full max-w-6xl flex-col gap-3 rounded-[1.4rem] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <p className="eyebrow">Portable country intelligence</p>
          <Link to="/" className="mt-1 block text-[1.45rem] leading-none text-text-main sm:text-[1.7rem]">
            LandingBrief
          </Link>
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <nav className="flex min-w-0 flex-1 items-center gap-1 rounded-full border border-border-soft bg-white/3 p-1 sm:flex-initial">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex-1 rounded-full px-3 py-2 text-center text-sm font-medium transition sm:flex-none sm:px-4",
                    isActive
                      ? "bg-white text-app-bg shadow-[0_10px_22px_rgba(4,10,16,0.16)]"
                      : "text-text-muted hover:text-text-main"
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <details className="nav-utility-menu">
            <summary className="nav-utility-trigger">
              <span>More</span>
            </summary>
            <div className="nav-utility-panel">
              {!isOnline ? (
                <span className="nav-utility-status">
                  Offline mode
                </span>
              ) : null}
              <Link to="/settings" className="nav-utility-link">
                Settings
              </Link>
              {canInstall && installMethod === "native-prompt" ? (
                <button
                  type="button"
                  onClick={() => {
                    void installApp();
                  }}
                  className="nav-utility-link text-left"
                >
                  Install app
                </button>
              ) : null}
              {canInstall && installMethod !== "native-prompt" ? (
                <Link to="/settings" className="nav-utility-link">
                  Add to Home Screen
                </Link>
              ) : null}
              <span className="nav-utility-status">{isInstalled ? "Installed on this device" : "Travel mode active"}</span>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
