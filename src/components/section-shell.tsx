import type { PropsWithChildren, ReactNode } from "react";

type SectionShellProps = PropsWithChildren<{
  id: string;
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  emphasis?: "default" | "strong";
  variant?: "default" | "country";
}>;

export function SectionShell({
  id,
  title,
  eyebrow,
  action,
  emphasis = "default",
  variant = "default",
  children
}: SectionShellProps) {
  const isCountryVariant = variant === "country";

  return (
    <section
      id={id}
      className={[
        "scroll-mt-28",
        isCountryVariant
          ? emphasis === "strong"
            ? "country-section-shell country-section-shell-strong rounded-[1.5rem] p-5 sm:p-6"
            : "country-section-shell border border-white/8 rounded-[1.5rem] px-5 py-6 sm:px-6 sm:py-7"
          : emphasis === "strong"
            ? "glass-panel rounded-[1.9rem] p-5 sm:p-6"
            : "border-t border-border-soft/70 px-1 pt-6 sm:pt-7"
      ].join(" ")}
    >
      <div className={["mb-4 flex items-start justify-between gap-3", isCountryVariant ? "country-section-shell-header" : ""].join(" ").trim()}>
        <div>
          {eyebrow ? <p className={["eyebrow", isCountryVariant ? "country-kicker" : ""].join(" ").trim()}>{eyebrow}</p> : null}
          <h2 className={["mt-2 text-text-main", isCountryVariant ? "country-section-title" : "text-[1.55rem]"].join(" ")}>
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
