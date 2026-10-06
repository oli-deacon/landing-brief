import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "./components/app-shell";
import { AppErrorPage } from "./pages/app-error-page";
const ArrivalCardPage = lazy(() => import("./pages/arrival-card-page").then(module => ({ default: module.ArrivalCardPage })));
import { CountryBriefPage } from "./pages/country-brief-page";
import { CountryExplorePage } from "./pages/country-explore-page";
import { CountryLandingPage } from "./pages/country-landing-page";
import { HomePage } from "./pages/home-page";
import { OfflinePage } from "./pages/offline-page";
import { SavedBriefsPage } from "./pages/saved-briefs-page";
import { SettingsPage } from "./pages/settings-page";
import { CountryRunPage } from "./pages/country-run-page";
import { CountryAtlasPage } from "./pages/country-atlas-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <AppErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "atlas",
        element: <CountryAtlasPage />
      },
      {
        path: "country/:countryCode",
        element: <CountryBriefPage />
      },
      { path: "country/:countryCode/arrival-card", element: <Suspense fallback={<p className="p-6 text-sm" role="status">Opening arrival card…</p>}><ArrivalCardPage /></Suspense> },
      {
        path: "country/:countryCode/landing",
        element: <CountryLandingPage />
      },
      {
        path: "country/:countryCode/explore",
        element: <CountryExplorePage />
      },
      {
        path: "country/:countryCode/run",
        element: <CountryRunPage />
      },
      {
        path: "saved",
        element: <SavedBriefsPage />
      },
      {
        path: "settings",
        element: <SettingsPage />
      },
      {
        path: "offline",
        element: <OfflinePage />
      }
    ]
  }
]);
