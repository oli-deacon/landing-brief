import { Link } from "react-router-dom";

import { Card } from "../components/card";
import { SectionHeading } from "../components/section-heading";
import { countryBriefs } from "../data/country-briefs";

export function HomePage() {
  return (
    <>
      <SectionHeading
        title="LandingBrief"
        description="Start with a lightweight country brief built for mobile reading, clear next steps, and calm first-day context."
      />

      <Card className="bg-linear-to-br from-white to-accent-soft/60">
        <p className="text-sm font-medium text-accent">Today’s focus</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-main">
          Pick a destination and open a placeholder arrival brief.
        </h2>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          This first version keeps the experience intentionally light: cards, route structure,
          and sample data we can grow into real country intelligence later.
        </p>
      </Card>

      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-lg font-semibold text-text-main">Explore sample briefs</h2>
          <p className="mt-1 text-sm text-text-muted">
            Placeholder entries wired to the dynamic country route.
          </p>
        </div>
        <div className="space-y-3">
          {countryBriefs.map((brief) => (
            <Link key={brief.countryCode} to={`/country/${brief.countryCode}`}>
              <Card className="transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(24,49,51,0.1)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                      {brief.region}
                    </p>
                    <h3 className="text-xl font-semibold tracking-tight text-text-main">
                      {brief.name}
                    </h3>
                    <p className="text-sm leading-6 text-text-muted">{brief.tagLine}</p>
                  </div>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                    {brief.countryCode.toUpperCase()}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
