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
    <section id={id} className="scroll-mt-36">
      <div
        className={[
          emphasis === "strong" ? "glass-panel rounded-[1.9rem] p-5" : "section-frame rounded-[1.75rem] p-5"
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
      </div>
    </section>
  );
}
