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
        "glass-panel rounded-[1.9rem] p-5",
        className
      ].join(" ")}
    >
      {(eyebrow ?? title ?? action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? <h2 className="mt-2 text-[1.55rem] text-text-main">{title}</h2> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
