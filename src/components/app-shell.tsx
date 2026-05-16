import { Outlet } from "react-router-dom";

import { useAppStatus } from "../lib/app-status";
import { AdaptiveNav } from "./adaptive-nav";
import { PageContainer } from "./page-container";

export function AppShell() {
  const { isOnline } = useAppStatus();

  return (
    <div className="min-h-screen bg-app-bg text-text-main">
      <AdaptiveNav />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8 lg:pb-14">
        {!isOnline ? (
          <div className="section-frame mb-4 rounded-[1.2rem] px-4 py-3 text-sm text-text-soft">
            You’re offline. Saved notes and previously opened country briefs stay available on this device.
          </div>
        ) : null}
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}
