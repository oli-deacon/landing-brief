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
    <section className="rounded-[2rem] border border-border-soft bg-linear-to-br from-white via-white to-accent-soft/70 p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            Country brief
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-text-main">{countryName}</h1>
          <p className="text-sm leading-6 text-text-muted">
            Main city: <span className="font-medium text-text-main">{mainCity}</span>
          </p>
        </div>
        <div className="rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-accent shadow-sm">
          Reviewed {lastReviewedDate}
        </div>
      </div>

      {action ? <div className="mt-4">{action}</div> : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.5rem] border border-border-soft bg-white/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            Primary airport
          </p>
          <p className="mt-2 text-base font-semibold text-text-main">{primaryAirport}</p>
        </div>
        <div className="rounded-[1.5rem] border border-border-soft bg-white/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            Travel note
          </p>
          <p className="mt-2 text-sm leading-6 text-text-muted">{disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
