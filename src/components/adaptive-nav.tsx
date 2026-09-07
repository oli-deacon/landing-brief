import { Link, NavLink, useLocation } from "react-router-dom";

import { useAppStatus } from "../lib/app-status";

type AdaptiveNavProps = {
  variant?: "default" | "country";
};

const defaultNavItems = [
  { to: "/", label: "Home" },
  { to: "/atlas", label: "Atlas" },
  { to: "/saved", label: "Saved" }
];

export function AdaptiveNav({ variant = "default" }: AdaptiveNavProps) {
  const { canInstall, installApp, installMethod, isInstalled, isOnline } = useAppStatus();
  const location = useLocation();
  const isCountryVariant = variant === "country";
  const countryCode = location.pathname.match(/^\/country\/([^/]+)/)?.[1];
  const navItems = countryCode
    ? [
        { to: "/", label: "Home", end: true },
        { to: `/country/${countryCode}/landing`, label: "Brief" },
        { to: `/country/${countryCode}/explore`, label: "Explore" },
        { to: `/country/${countryCode}/run`, label: "Run" },
        { to: "/saved", label: "Saved", end: true }
      ]
    : defaultNavItems;

  return (
    <header className="sticky top-0 z-30 px-4 pt-[max(env(safe-area-inset-top),1rem)] sm:px-6 lg:px-8">
      <div
        className={[
          "mx-auto flex w-full max-w-6xl flex-col gap-3 rounded-[1.4rem] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5",
          isCountryVariant ? "country-nav-surface" : "nav-surface"
        ].join(" ")}
      >
        <div className="min-w-0">
          <p className={["eyebrow", isCountryVariant ? "country-nav-eyebrow" : ""].join(" ").trim()}>
            Portable country intelligence
          </p>
          <Link
            to="/"
            className={[
              "mt-1 block leading-none text-text-main sm:text-[1.7rem]",
              isCountryVariant ? "country-nav-brand text-[1.35rem]" : "text-[1.45rem]"
            ].join(" ")}
          >
            LandingBrief
          </Link>
        </div>

        <div
          className={[
            "flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start",
            isCountryVariant ? "flex-wrap" : ""
          ].join(" ")}
        >
          <nav
            className={[
              "flex min-w-0 items-center gap-1 rounded-full p-1",
              isCountryVariant ? "w-full flex-none sm:w-auto sm:flex-initial" : "flex-1 sm:flex-initial",
              isCountryVariant
                ? "country-nav-tabs border border-white/8 bg-white/[0.03]"
                : "border border-border-soft bg-white/3"
            ].join(" ")}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "flex-1 rounded-full px-3 py-2 text-center text-sm font-medium transition sm:flex-none sm:px-4",
                    isCountryVariant
                      ? isActive
                        ? "country-nav-tab-active"
                        : "country-nav-tab"
                      : isActive
                        ? "bg-white text-app-bg shadow-[0_10px_22px_rgba(4,10,16,0.16)]"
                        : "text-text-muted hover:text-text-main"
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <details className={isCountryVariant ? "nav-utility-menu ml-auto sm:ml-0" : "nav-utility-menu"}>
            <summary className={isCountryVariant ? "nav-utility-trigger country-nav-utility-trigger" : "nav-utility-trigger"}>
              <span>More</span>
            </summary>
            <div className={isCountryVariant ? "nav-utility-panel country-nav-utility-panel" : "nav-utility-panel"}>
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
