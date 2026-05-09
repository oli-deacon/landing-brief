import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import "./styles.css";
import { AppStatusProvider } from "./lib/app-status";
import { router } from "./router";

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppStatusProvider>
      <RouterProvider router={router} />
    </AppStatusProvider>
  </React.StrictMode>,
);
