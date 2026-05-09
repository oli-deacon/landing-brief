import type { PropsWithChildren } from "react";

export function PageContainer({ children }: PropsWithChildren) {
  return <main className="flex flex-1 flex-col gap-4">{children}</main>;
}
