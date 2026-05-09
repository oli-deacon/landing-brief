import type { PropsWithChildren, ReactNode } from "react";

type CardProps = PropsWithChildren<{
  eyebrow?: string;
  title?: string;
  action?: ReactNode;
  className?: string;
}>;

export function Card({ eyebrow, title, action, className = "", children }: CardProps) {
  return (
    <section
      className={[
        "rounded-[1.75rem] border border-border-soft bg-surface-strong p-5 shadow-card",
        className
      ].join(" ")}
    >
      {(eyebrow ?? title ?? action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                {eyebrow}
              </p>
            ) : null}
            {title ? <h2 className="mt-2 text-lg font-semibold text-text-main">{title}</h2> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
