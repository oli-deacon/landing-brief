import type { PropsWithChildren, ReactNode } from "react";

type SectionShellProps = PropsWithChildren<{
  id: string;
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}>;

export function SectionShell({
  id,
  title,
  eyebrow,
  action,
  children
}: SectionShellProps) {
  return (
    <section id={id} className="scroll-mt-36">
      <div className="rounded-[1.75rem] border border-border-soft bg-surface-strong p-5 shadow-card">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-2 text-lg font-semibold text-text-main">{title}</h2>
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
