import { Outlet } from "react-router-dom";

import { useAppStatus } from "../lib/app-status";
import { BottomNav } from "./bottom-nav";
import { Header } from "./header";
import { PageContainer } from "./page-container";

export function AppShell() {
  const { isOnline } = useAppStatus();

  return (
    <div className="min-h-screen bg-app-bg text-text-main">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-4 sm:max-w-2xl sm:px-6 lg:max-w-4xl">
        <Header />
        {!isOnline ? (
          <div className="mb-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-card">
            You’re offline. Saved notes and previously opened country briefs stay available on this device.
          </div>
        ) : null}
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
      <BottomNav />
    </div>
  );
}
