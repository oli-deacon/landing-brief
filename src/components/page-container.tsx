import type { PropsWithChildren } from "react";

type PageContainerProps = PropsWithChildren<{
  className?: string;
}>;

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return <main className={["flex flex-1 flex-col gap-6", className].join(" ").trim()}>{children}</main>;
}
