import type { ReactNode } from "react";

type CountryHeaderProps = {
  countryName: string;
  mainCity: string;
  primaryAirport: string;
  lastReviewedDate: string;
  disclaimer: string;
  action?: ReactNode;
};

export function CountryHeader({
  countryName,
  mainCity,
  primaryAirport,
  lastReviewedDate,
  disclaimer,
  action
}: CountryHeaderProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow">Country brief</p>
          <h1 className="text-4xl leading-[0.95] text-text-main">{countryName}</h1>
          <p className="text-sm leading-6 text-text-muted">
            Main city: <span className="font-medium text-text-main">{mainCity}</span>
          </p>
        </div>
        <div className="pill-chip rounded-full px-3 py-2 text-xs font-medium">
          Reviewed {lastReviewedDate}
        </div>
      </div>

      {action ? <div className="mt-4">{action}</div> : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.5rem] border border-border-soft bg-surface-muted/60 p-4">
          <p className="eyebrow">Primary airport</p>
          <p className="mt-2 text-base font-semibold text-text-main">{primaryAirport}</p>
        </div>
        <div className="rounded-[1.5rem] border border-border-soft bg-surface-muted/60 p-4">
          <p className="eyebrow">Travel note</p>
          <p className="mt-2 text-sm leading-6 text-text-muted">{disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
