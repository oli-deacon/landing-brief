import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { CountryHeader } from "../components/country-header";
import { InfoList } from "../components/info-list";
import { SectionNav } from "../components/section-nav";
import { SectionShell } from "../components/section-shell";
import { useCountryBrief } from "../hooks/use-country-data";
import { useOfflineLibrary } from "../hooks/use-offline-library";
import {
  createCountrySummary,
  recordRecentCountry,
  saveCountryNote,
  toggleSavedCountry
} from "../lib/browser-storage";

const sectionNavItems = [
  { id: "arrival", label: "Arrival" },
  { id: "entry", label: "Entry" },
  { id: "airport", label: "Airport" },
  { id: "phrases", label: "Phrases" },
  { id: "business", label: "Business" },
  { id: "food", label: "Food" },
  { id: "money", label: "Money" },
  { id: "apps", label: "Apps" },
  { id: "notes", label: "Notes" },
  { id: "emergency", label: "Emergency" }
] as const;

export function CountryBriefPage() {
  const { countryCode = "" } = useParams();
  const countryState = useCountryBrief(countryCode);
  const library = useOfflineLibrary();

  useEffect(() => {
    if (countryState.status !== "ready") {
      return;
    }

    recordRecentCountry(createCountrySummary(countryState.data));
  }, [countryState]);

  if (countryState.status === "loading") {
    return (
      <SectionShell id="loading" title="Loading brief" eyebrow="Country data">
        <div className="h-48 animate-pulse rounded-[1.35rem] bg-surface-muted/60" />
      </SectionShell>
    );
  }

  if (countryState.status === "error") {
    const isMissingCountry = countryState.error.message === "not-found";

    return (
      <>
        <section className="space-y-2 px-1">
          <h1 className="text-3xl font-semibold tracking-tight text-text-main">
            {isMissingCountry ? "Country brief not found" : "Country brief unavailable offline"}
          </h1>
          <p className="max-w-xl text-sm leading-6 text-text-muted">
            {isMissingCountry
              ? "This route is working, but there is no seeded country content for that code yet."
              : "Open this destination once while connected and LandingBrief will keep it available for offline travel use later."}
          </p>
        </section>
        <SectionShell id="not-found" title="Next step">
          <p className="text-sm leading-6 text-text-muted">
            {isMissingCountry
              ? "Try one of the seeded routes like /country/sg or /country/th, or head back to the home screen to pick a card."
              : "You can still review saved briefs, recent countries, and personal notes from the offline library."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/"
              className="button-primary inline-flex rounded-full px-4 py-2 text-sm font-medium"
            >
              Back to Home
            </Link>
            {!isMissingCountry ? (
              <Link
                to="/offline"
                className="button-secondary inline-flex rounded-full px-4 py-2 text-sm font-medium"
              >
                Offline help
              </Link>
            ) : null}
          </div>
        </SectionShell>
      </>
    );
  }

  const brief = countryState.data;
  const summary = createCountrySummary(brief);
  const saved = library.savedCountries.some(
    (country) => country.countryCode.toLowerCase() === brief.countryCode.toLowerCase(),
  );
  const noteValue = library.notes[brief.countryCode.toLowerCase()]?.value ?? "";

  return (
    <>
      {countryState.source === "cache" ? (
        <SectionShell id="cached" title="Offline copy" eyebrow="Cached brief">
          <p className="text-sm leading-6 text-text-muted">
            You are viewing the cached version of this brief. Notes and saved items still work offline.
          </p>
        </SectionShell>
      ) : null}

      <CountryHeader
        countryName={brief.countryName}
        mainCity={brief.capitalOrMainCity}
        primaryAirport={brief.primaryAirport}
        lastReviewedDate={brief.lastReviewedDate}
        disclaimer={brief.disclaimer}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/country/${brief.countryCode}/landing`}
              className="button-primary inline-flex items-center rounded-full px-4 py-3 text-sm font-medium transition hover:brightness-110"
            >
              Before Landing
            </Link>
            <button
              type="button"
              onClick={() => {
                toggleSavedCountry(summary);
              }}
              className="button-secondary inline-flex items-center rounded-full px-4 py-3 text-sm font-medium"
            >
              {saved ? "Remove saved brief" : "Save for offline"}
            </button>
          </div>
        }
      />

      <SectionNav items={sectionNavItems} />

      <SectionShell
        id="arrival"
        title="Arrival Essentials"
        eyebrow="Quick start"
        action={
          <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
            First hour
          </span>
        }
      >
        <ul className="editorial-list">
          {brief.arrivalEssentials.map((item) => (
            <li key={item} className="editorial-list-item text-sm text-text-main">
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
          <ul className="editorial-list mt-3">
            {brief.entryRequirements.importantNotes.map((note) => (
              <li key={note} className="editorial-list-item text-sm text-text-main">
                {note}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Official links
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {brief.entryRequirements.officialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="pill-chip inline-flex rounded-full px-3 py-2 text-xs font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell id="airport" title="Airport to City" eyebrow="Compare your first transfer">
        <p className="mb-4 text-sm leading-6 text-text-muted">{brief.airportToCity.airportName}</p>
        <div className="space-y-3">
          {brief.airportToCity.options.map((option) => (
            <div
              key={option.mode}
              className="rounded-[1.35rem] border border-border-soft bg-surface-muted/55 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[1.35rem] text-text-main">{option.mode}</h3>
                  <p className="mt-1 text-sm text-text-muted">{option.bestFor}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
                    {option.typicalTime}
                  </span>
                  <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
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
              className="rounded-[1.35rem] border border-border-soft bg-surface-muted/55 p-4"
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
        <ul className="editorial-list mt-4">
          {brief.businessEtiquette.tips.map((tip) => (
            <li key={tip} className="editorial-list-item text-sm text-text-main">
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
          <ul className="editorial-list mt-3">
            {brief.foodAndPracticalities.usefulPhrases.map((phrase) => (
              <li key={phrase} className="editorial-list-item text-sm text-text-main">
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
            { label: "Conversion", value: brief.moneyAndPayments.conversion },
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
          <ul className="editorial-list mt-3">
            {brief.moneyAndPayments.roughCostExamples.map((example) => (
              <li key={example} className="editorial-list-item text-sm text-text-main">
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

      <SectionShell id="notes" title="Your offline notes" eyebrow="Personal reminders">
        <label className="block">
          <span className="text-sm font-medium text-text-main">
            Save reminders that should still be here after you lose signal.
          </span>
          <textarea
            value={noteValue}
            onChange={(event) => {
              saveCountryNote(brief.countryCode, event.target.value);
            }}
            rows={6}
            placeholder="Hotel transfer reminder, arrival card note, local SIM step, address in local language..."
            className="mt-3 w-full rounded-[1.35rem] border border-border-soft bg-surface-muted/35 px-4 py-4 text-sm leading-6 text-text-main outline-none transition focus:border-accent"
          />
        </label>
      </SectionShell>

      <SectionShell
        id="emergency"
        title="Emergency Numbers"
        eyebrow="Keep handy"
        action={
          <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
            High priority
          </span>
        }
      >
        <div className="rounded-[1.5rem] border border-border-strong bg-linear-to-br from-[#131f2d] via-[#162535] to-[#1d3146] p-5 text-white shadow-[0_20px_50px_rgba(2,8,18,0.34)]">
          <p className="eyebrow text-slate-300">{brief.emergencyNumbers.label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight">
            {brief.emergencyNumbers.number}
          </p>
          <ul className="editorial-list mt-4">
            {brief.emergencyNumbers.notes.map((note) => (
              <li key={note} className="editorial-list-item text-sm text-white/90">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>
    </>
  );
}
