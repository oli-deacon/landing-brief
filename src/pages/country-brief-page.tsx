import { Link, useParams } from "react-router-dom";

import { CountryHeader } from "../components/country-header";
import { InfoList } from "../components/info-list";
import { SectionNav } from "../components/section-nav";
import { SectionShell } from "../components/section-shell";
import { getCountryByCode } from "../data/countries";

const sectionNavItems = [
  { id: "arrival", label: "Arrival" },
  { id: "entry", label: "Entry" },
  { id: "airport", label: "Airport" },
  { id: "phrases", label: "Phrases" },
  { id: "business", label: "Business" },
  { id: "food", label: "Food" },
  { id: "money", label: "Money" },
  { id: "apps", label: "Apps" },
  { id: "emergency", label: "Emergency" }
] as const;

export function CountryBriefPage() {
  const { countryCode = "" } = useParams();
  const brief = getCountryByCode(countryCode);

  if (!brief) {
    return (
      <>
        <section className="space-y-2 px-1">
          <h1 className="text-3xl font-semibold tracking-tight text-text-main">
            Country brief not found
          </h1>
          <p className="max-w-xl text-sm leading-6 text-text-muted">
            This route is working, but there is no seeded country content for that code yet.
          </p>
        </section>
        <SectionShell id="not-found" title="Try a seeded route">
          <p className="text-sm leading-6 text-text-muted">
            Try one of the seeded routes like <code>/country/sg</code> or <code>/country/th</code>,
            or head back to the home screen to pick a card.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Back to Home
          </Link>
        </SectionShell>
      </>
    );
  }

  return (
    <>
      <CountryHeader
        countryName={brief.countryName}
        mainCity={brief.capitalOrMainCity}
        primaryAirport={brief.primaryAirport}
        lastReviewedDate={brief.lastReviewedDate}
        disclaimer={brief.disclaimer}
      />

      <SectionNav items={sectionNavItems} />

      <SectionShell
        id="arrival"
        title="Arrival Essentials"
        eyebrow="Quick start"
        action={
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            First hour
          </span>
        }
      >
        <ul className="space-y-3">
          {brief.arrivalEssentials.map((item) => (
            <li
              key={item}
              className="rounded-[1.25rem] border border-border-soft bg-surface-muted/35 px-4 py-4 text-sm leading-6 text-text-main"
            >
              {item}
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell id="entry" title="Entry Requirements" eyebrow="Before you land">
        <InfoList
          items={[
            {
              label: "Passport validity",
              value: brief.entryRequirements.passportValidity
            },
            {
              label: "Visa summary",
              value: brief.entryRequirements.visaSummary
            },
            {
              label: "Arrival card or declaration",
              value: brief.entryRequirements.arrivalCardOrDeclaration
            },
            {
              label: "Official source note",
              value: brief.entryRequirements.officialSourceNote
            }
          ]}
        />
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Important notes
          </p>
          <ul className="mt-2 space-y-2">
            {brief.entryRequirements.importantNotes.map((note) => (
              <li key={note} className="rounded-2xl bg-surface-muted/50 px-3 py-3 text-sm leading-6 text-text-main">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>

      <SectionShell id="airport" title="Airport to City" eyebrow="Compare your first transfer">
        <p className="mb-4 text-sm leading-6 text-text-muted">{brief.airportToCity.airportName}</p>
        <div className="space-y-3">
          {brief.airportToCity.options.map((option) => (
            <div
              key={option.mode}
              className="rounded-[1.35rem] border border-border-soft bg-surface-muted/35 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-text-main">{option.mode}</h3>
                  <p className="mt-1 text-sm text-text-muted">{option.bestFor}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-accent">
                    {option.typicalTime}
                  </span>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                    {option.typicalCost}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-text-muted">{option.notes}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="phrases" title="Handy Phrases" eyebrow="Fast scan">
        <div className="space-y-3">
          {brief.handyPhrases.map((phrase) => (
            <div
              key={`${phrase.english}-${phrase.local}`}
              className="rounded-[1.35rem] border border-border-soft bg-surface-muted/35 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                    English
                  </p>
                  <p className="mt-1 text-sm font-semibold text-text-main">{phrase.english}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                    Local
                  </p>
                  <p className="mt-1 text-sm font-semibold text-text-main">{phrase.local}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-text-muted">
                Pronunciation: {phrase.pronunciation}
              </p>
              <p className="mt-2 text-sm leading-6 text-text-muted">{phrase.context}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="business" title="Business Etiquette" eyebrow="Meeting basics">
        <p className="text-sm leading-6 text-text-muted">{brief.businessEtiquette.summary}</p>
        <ul className="mt-4 space-y-2">
          {brief.businessEtiquette.tips.map((tip) => (
            <li key={tip} className="rounded-2xl bg-surface-muted/50 px-3 py-3 text-sm leading-6 text-text-main">
              {tip}
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell id="food" title="Food and Practicalities" eyebrow="Everyday basics">
        <InfoList
          items={[
            { label: "Tap water", value: brief.foodAndPracticalities.tapWater },
            { label: "Tipping", value: brief.foodAndPracticalities.tipping },
            { label: "Dietary notes", value: brief.foodAndPracticalities.dietaryNotes },
            {
              label: "Common food tips",
              value: brief.foodAndPracticalities.commonFoodTips
            }
          ]}
        />
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Useful phrases
          </p>
          <ul className="mt-2 space-y-2">
            {brief.foodAndPracticalities.usefulPhrases.map((phrase) => (
              <li key={phrase} className="rounded-2xl bg-surface-muted/50 px-3 py-3 text-sm leading-6 text-text-main">
                {phrase}
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>

      <SectionShell id="money" title="Money and Payments" eyebrow="Quick cost sense">
        <InfoList
          items={[
            { label: "Currency", value: brief.moneyAndPayments.currency },
            {
              label: "Card acceptance",
              value: brief.moneyAndPayments.cardAcceptance
            },
            { label: "Cash notes", value: brief.moneyAndPayments.cashNotes },
            { label: "Tipping", value: brief.moneyAndPayments.tipping }
          ]}
        />
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Rough cost examples
          </p>
          <ul className="mt-2 space-y-2">
            {brief.moneyAndPayments.roughCostExamples.map((example) => (
              <li key={example} className="rounded-2xl bg-surface-muted/50 px-3 py-3 text-sm leading-6 text-text-main">
                {example}
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>

      <SectionShell id="apps" title="Local Transport Apps" eyebrow="Get moving">
        <div className="space-y-3">
          {brief.localTransportApps.map((app) => (
            <div
              key={app.name}
              className="rounded-[1.35rem] border border-border-soft bg-surface-muted/35 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-text-main">{app.name}</h3>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-accent">
                  App
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-text-main">{app.useCase}</p>
              <p className="mt-2 text-sm leading-6 text-text-muted">{app.notes}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="emergency"
        title="Emergency Numbers"
        eyebrow="Keep handy"
        action={
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-accent">
            High priority
          </span>
        }
      >
        <div className="rounded-[1.5rem] border border-accent/15 bg-linear-to-br from-accent to-[#2f686c] p-5 text-white shadow-[0_20px_50px_rgba(47,104,108,0.28)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            {brief.emergencyNumbers.label}
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight">
            {brief.emergencyNumbers.number}
          </p>
          <ul className="mt-4 space-y-2">
            {brief.emergencyNumbers.notes.map((note) => (
              <li
                key={note}
                className="rounded-[1rem] bg-white/10 px-3 py-3 text-sm leading-6 text-white/90"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>
    </>
  );
}
