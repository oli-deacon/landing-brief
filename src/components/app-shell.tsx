import { Outlet } from "react-router-dom";

import { BottomNav } from "./bottom-nav";
import { Header } from "./header";
import { PageContainer } from "./page-container";

export function AppShell() {
  return (
    <div className="min-h-screen bg-app-bg text-text-main">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-4 sm:max-w-2xl sm:px-6 lg:max-w-4xl">
        <Header />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
      <BottomNav />
    </div>
  );
}
