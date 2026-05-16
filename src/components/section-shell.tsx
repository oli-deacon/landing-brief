import type { PropsWithChildren, ReactNode } from "react";

type SectionShellProps = PropsWithChildren<{
  id: string;
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  emphasis?: "default" | "strong";
}>;

export function SectionShell({
  id,
  title,
  eyebrow,
  action,
  emphasis = "default",
  children
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={[
        "scroll-mt-28",
        emphasis === "strong"
          ? "glass-panel rounded-[1.9rem] p-5 sm:p-6"
          : "border-t border-border-soft/70 px-1 pt-6 sm:pt-7"
      ].join(" ")}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="mt-2 text-[1.55rem] text-text-main">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
