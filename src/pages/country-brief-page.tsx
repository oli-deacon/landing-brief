import { Link, useParams } from "react-router-dom";

import { Card } from "../components/card";
import { SectionHeading } from "../components/section-heading";
import { getCountryBrief } from "../data/country-briefs";

const sections = [
  { key: "overview", title: "Overview" },
  { key: "travelNotes", title: "Travel Notes" },
  { key: "adminNotes", title: "Admin Notes" }
] as const;

export function CountryBriefPage() {
  const { countryCode = "" } = useParams();
  const brief = getCountryBrief(countryCode);

  if (!brief) {
    return (
      <>
        <SectionHeading
          title="Country brief not found"
          description="This placeholder route is working, but there is no sample content for that country code yet."
        />
        <Card>
          <p className="text-sm leading-6 text-text-muted">
            Try one of the seeded sample routes like <code>/country/au</code> or head back to
            the home screen to pick a card.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Back to Home
          </Link>
        </Card>
      </>
    );
  }

  return (
    <>
      <SectionHeading
        title={brief.name}
        description={`${brief.region} brief with static placeholder content for the first skeleton release.`}
      />

      <Card className="bg-linear-to-br from-white to-accent-soft/60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          Country code
        </p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-lg font-semibold text-text-main">{brief.countryCode.toUpperCase()}</p>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-accent">
            Placeholder brief
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-text-muted">{brief.tagLine}</p>
      </Card>

      {sections.map((section) => (
        <Card key={section.key} title={section.title}>
          <p className="text-sm leading-6 text-text-muted">{brief[section.key]}</p>
        </Card>
      ))}
    </>
  );
}
