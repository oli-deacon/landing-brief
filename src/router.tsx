import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "./components/app-shell";
import { CountryBriefPage } from "./pages/country-brief-page";
import { HomePage } from "./pages/home-page";
import { SavedBriefsPage } from "./pages/saved-briefs-page";
import { SettingsPage } from "./pages/settings-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
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
        path: "saved",
        element: <SavedBriefsPage />
      },
      {
        path: "settings",
        element: <SettingsPage />
      }
    ]
  }
]);
