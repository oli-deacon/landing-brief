import { Link, NavLink, matchPath, useLocation } from "react-router-dom";

import { useAppStatus } from "../lib/app-status";

const navItems = [
  { to: "/", label: "Home", icon: "⌂" },
  { to: "/saved", label: "Saved", icon: "◫" },
  { to: "/settings", label: "Settings", icon: "⚙" }
];

function getCountryContext(pathname: string) {
  const landingMatch = matchPath("/country/:countryCode/landing", pathname);
  const briefMatch = matchPath("/country/:countryCode", pathname);

  if (landingMatch?.params.countryCode) {
    return {
      countryCode: landingMatch.params.countryCode,
      isLanding: true
    };
  }

  if (briefMatch?.params.countryCode) {
    return {
      countryCode: briefMatch.params.countryCode,
      isLanding: false
    };
  }

  return null;
}

export function AdaptiveNav() {
  const location = useLocation();
  const { canInstall, installApp, installMethod, isInstalled, isOnline } = useAppStatus();
  const countryContext = getCountryContext(location.pathname);

  const contextualAction = countryContext ? (
    <Link
      to={
        countryContext.isLanding
          ? `/country/${countryContext.countryCode}`
          : `/country/${countryContext.countryCode}/landing`
      }
      className="nav-context-pill"
    >
      {countryContext.isLanding ? "Full brief" : "Landing mode"}
    </Link>
  ) : canInstall && installMethod === "native-prompt" ? (
    <button
      type="button"
      onClick={() => {
        void installApp();
      }}
      className="nav-context-pill"
    >
      Install
    </button>
  ) : canInstall && installMethod !== "native-prompt" ? (
    <Link to="/settings" className="nav-context-pill">
      Add to Home Screen
    </Link>
  ) : (
    <span className="nav-context-pill">{isInstalled ? "Installed" : "Travel mode"}</span>
  );

  return (
    <>
      <header className="sticky top-0 z-30 px-4 pt-[max(env(safe-area-inset-top),1rem)] sm:px-6 lg:px-8">
        <div className="nav-surface mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-[1.9rem] px-4 py-3 sm:px-5 lg:px-6">
          <div className="min-w-0">
            <p className="eyebrow">Portable country intelligence</p>
            <Link to="/" className="mt-1 block text-[1.6rem] leading-none text-text-main sm:text-[1.85rem]">
              LandingBrief
            </Link>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-white text-app-bg shadow-[0_10px_25px_rgba(4,10,16,0.2)]"
                      : "text-text-muted hover:bg-white/8 hover:text-text-main"
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {!isOnline ? <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">Offline</span> : null}
            <div className="hidden sm:block">{contextualAction}</div>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 lg:hidden">
        <div className="nav-surface mx-auto flex max-w-md items-center gap-2 rounded-[1.9rem] px-2 py-2 sm:max-w-xl">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition",
                  isActive
                    ? "bg-white text-app-bg shadow-[0_10px_22px_rgba(4,10,16,0.18)]"
                    : "text-text-muted hover:bg-white/6 hover:text-text-soft"
                ].join(" ")
              }
            >
              <span className="text-base leading-none" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          <div className="sm:hidden">{contextualAction}</div>
        </div>
      </nav>
    </>
  );
}
