import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "./components/app-shell";
import { AppErrorPage } from "./pages/app-error-page";
import { CountryBriefPage } from "./pages/country-brief-page";
import { CountryLandingPage } from "./pages/country-landing-page";
import { HomePage } from "./pages/home-page";
import { OfflinePage } from "./pages/offline-page";
import { SavedBriefsPage } from "./pages/saved-briefs-page";
import { SettingsPage } from "./pages/settings-page";

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
        path: "country/:countryCode",
        element: <CountryBriefPage />
      },
      {
        path: "country/:countryCode/landing",
        element: <CountryLandingPage />
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
