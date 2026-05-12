import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { useCountryBrief } from "../hooks/use-country-data";
import { useOfflineLibrary } from "../hooks/use-offline-library";
import {
  createCountrySummary,
  recordRecentCountry,
  saveCountryNote,
  toggleSavedCountry
} from "../lib/browser-storage";
import { InfoList } from "./info-list";
import { SectionNav } from "./section-nav";
import { SectionShell } from "./section-shell";

type CountryExperienceProps = {
  mode: "landing" | "full";
};

const flowNavItems = [
  { id: "arrive", label: "Arrive" },
  { id: "move", label: "Move" },
  { id: "settle", label: "Settle" }
] as const;

function takeFirstSentence(value: string) {
  const match = value.match(/^[^.?!]+[.?!]/);

  return match ? match[0] : value;
}

export function CountryExperience({ mode }: CountryExperienceProps) {
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
      <SectionShell id="loading" title="Loading brief" eyebrow="Country data" emphasis="strong">
        <div className="h-48 animate-pulse rounded-[1.35rem] bg-surface-muted/60" />
      </SectionShell>
    );
  }

  if (countryState.status === "error") {
    const isMissingCountry = countryState.error.message === "not-found";

    return (
      <>
        <section className="space-y-2 px-1">
          <p className="eyebrow">{isMissingCountry ? "Route not found" : "Offline fallback"}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-text-main">
            {isMissingCountry ? "Country brief not found" : "Country brief unavailable offline"}
          </h1>
          <p className="max-w-xl text-sm leading-6 text-text-muted">
            {isMissingCountry
              ? "There is no seeded country content for that code yet."
              : "Open this destination once while connected and LandingBrief will keep it available for offline use later."}
          </p>
        </section>
        <SectionShell id="not-found" title="Next step" emphasis="strong">
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="button-primary inline-flex rounded-full px-4 py-3 text-sm font-medium">
              Back to Home
            </Link>
            <Link to="/saved" className="button-secondary inline-flex rounded-full px-4 py-3 text-sm font-medium">
              Open saved items
            </Link>
          </div>
        </SectionShell>
      </>
    );
  }

  const brief = countryState.data;
  const summary = createCountrySummary(brief);
  const saved = library.savedCountries.some(
    (country) => country.countryCode.toLowerCase() === brief.countryCode.toLowerCase()
  );
  const noteValue = library.notes[brief.countryCode.toLowerCase()]?.value ?? "";
  const bestAirportOption = brief.airportToCity.options[0] ?? {
    mode: "Check local transport",
    typicalTime: "Varies",
    typicalCost: "Varies",
    bestFor: "First arrival decision",
    notes: "Transport details are temporarily unavailable in this cached copy."
  };
  const topArrivalEssentials = mode === "landing" ? brief.arrivalEssentials.slice(0, 4) : brief.arrivalEssentials;
  const entryReminder = takeFirstSentence(brief.entryRequirements.arrivalCardOrDeclaration);
  const paymentNote = `${brief.moneyAndPayments.cardAcceptance} ${brief.moneyAndPayments.cashNotes}`;
  const foodAndWaterNote = `Tap water: ${brief.foodAndPracticalities.tapWater} ${brief.foodAndPracticalities.commonFoodTips}`;
  const isLandingMode = mode === "landing";

  return (
    <>
      {countryState.source === "cache" ? (
        <SectionShell id="cached" title="Offline copy" eyebrow="Cached brief" emphasis="strong">
          <p className="text-sm leading-6 text-text-muted">
            You are viewing a cached copy. Notes and saved items still work offline.
          </p>
        </SectionShell>
      ) : null}

      <section className="hero-frame rounded-[2.2rem] border border-border-soft/70">
        <div className="hero-content flex min-h-[24rem] flex-col justify-end px-5 pb-7 pt-10 sm:px-7 sm:pb-8">
          <div className="max-w-3xl">
            <p className="eyebrow">{isLandingMode ? "90-second mode" : "Progressive country brief"}</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-[3rem] leading-[0.88] text-white sm:text-[4rem]">{brief.countryName}</h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200">
                  {brief.capitalOrMainCity} via {brief.primaryAirport}. Start with the fastest arrival path, then open deeper details only when you need them.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="pill-chip rounded-full px-3 py-2 text-xs font-medium">
                  {brief.countryCode.toUpperCase()}
                </span>
                <span className="pill-chip rounded-full px-3 py-2 text-xs font-medium">
                  Reviewed {brief.lastReviewedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={isLandingMode ? `/country/${brief.countryCode}` : `/country/${brief.countryCode}/landing`}
              className="button-primary inline-flex rounded-full px-4 py-3 text-sm font-medium transition hover:brightness-110"
            >
              {isLandingMode ? "Open full brief" : "Switch to landing mode"}
            </Link>
            <button
              type="button"
              onClick={() => {
                toggleSavedCountry(summary);
              }}
              className="button-secondary inline-flex rounded-full px-4 py-3 text-sm font-medium"
            >
              {saved ? "Remove saved brief" : "Save for offline"}
            </button>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="subtle-panel rounded-[1.4rem] p-4">
              <p className="eyebrow">First move</p>
              <p className="mt-2 text-base font-semibold text-text-main">{bestAirportOption.mode}</p>
              <p className="mt-1 text-sm text-text-muted">
                {bestAirportOption.typicalTime} · {bestAirportOption.typicalCost}
              </p>
            </div>
            <div className="subtle-panel rounded-[1.4rem] p-4">
              <p className="eyebrow">Entry reminder</p>
              <p className="mt-2 text-sm leading-6 text-text-main">{entryReminder}</p>
            </div>
            <div className="subtle-panel rounded-[1.4rem] p-4">
              <p className="eyebrow">Travel note</p>
              <p className="mt-2 text-sm leading-6 text-text-main">{brief.disclaimer}</p>
            </div>
          </div>
        </div>
      </section>

      <SectionNav items={flowNavItems} />

      <SectionShell
        id="arrive"
        title="Arrive"
        eyebrow="The first decisions after touchdown"
        action={<span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">Start here</span>}
      >
        <div className="space-y-8">
          <div>
            <h3 className="section-subtitle">Arrival essentials</h3>
            <ul className="editorial-list mt-3">
              {topArrivalEssentials.map((item) => (
                <li key={item} className="editorial-list-item text-sm text-text-main">
                  {item}
                </li>
              ))}
            </ul>
            {isLandingMode && brief.arrivalEssentials.length > topArrivalEssentials.length ? (
              <p className="mt-3 text-sm text-text-muted">Open the full brief to reveal the remaining arrival checks.</p>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div>
              <h3 className="section-subtitle">Entry requirements</h3>
              <InfoList
                items={[
                  { label: "Passport validity", value: brief.entryRequirements.passportValidity },
                  { label: "Visa summary", value: brief.entryRequirements.visaSummary },
                  { label: "Arrival card", value: brief.entryRequirements.arrivalCardOrDeclaration }
                ]}
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="section-subtitle">Important notes</h3>
                <ul className="editorial-list mt-3">
                  {brief.entryRequirements.importantNotes.map((note) => (
                    <li key={note} className="editorial-list-item text-sm text-text-main">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="section-subtitle">Official links</h3>
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
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="move" title="Move" eyebrow="Choose transport and local tools">
        <div className="space-y-8">
          <div>
            <h3 className="section-subtitle">Airport to city</h3>
            <p className="mt-1 text-sm leading-6 text-text-muted">{brief.airportToCity.airportName}</p>
            <div className="mt-4 space-y-3">
              {brief.airportToCity.options.map((option) => (
                <div key={option.mode} className="subtle-panel rounded-[1.35rem] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-[1.2rem] text-text-main">{option.mode}</h4>
                      <p className="mt-1 text-sm text-text-muted">{option.bestFor}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">{option.typicalTime}</span>
                      <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">{option.typicalCost}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-text-muted">{option.notes}</p>
                </div>
              ))}
            </div>
          </div>

          <details className="group" open={!isLandingMode}>
            <summary className="liquid-summary">
              <span>Transport apps and city navigation</span>
              <span className="text-text-muted transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 space-y-3">
              {brief.localTransportApps.map((app) => (
                <div key={app.name} className="subtle-panel rounded-[1.35rem] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h4 className="text-base font-semibold text-text-main">{app.name}</h4>
                    <span className="eyebrow">App</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-text-main">{app.useCase}</p>
                  <p className="mt-2 text-sm leading-6 text-text-muted">{app.notes}</p>
                </div>
              ))}
            </div>
          </details>

          <details className="group" open={!isLandingMode}>
            <summary className="liquid-summary">
              <span>Handy phrases</span>
              <span className="text-text-muted transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 grid gap-3">
              {brief.handyPhrases.map((phrase) => (
                <div key={`${phrase.english}-${phrase.local}`} className="subtle-panel rounded-[1.35rem] p-4">
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div>
                      <p className="eyebrow">English</p>
                      <p className="mt-1 text-sm font-semibold text-text-main">{phrase.english}</p>
                    </div>
                    <div>
                      <p className="eyebrow">Local</p>
                      <p className="mt-1 text-sm font-semibold text-text-main">{phrase.local}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-text-muted">Pronunciation: {phrase.pronunciation}</p>
                  <p className="mt-2 text-sm leading-6 text-text-muted">{phrase.context}</p>
                </div>
              ))}
            </div>
          </details>
        </div>
      </SectionShell>

      <SectionShell id="settle" title="Settle" eyebrow="Money, food, notes, and backup details">
        <div className="space-y-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="subtle-panel rounded-[1.35rem] p-4">
              <p className="eyebrow">Money and payments</p>
              <p className="mt-2 text-base leading-7 text-text-main">{paymentNote}</p>
              <p className="mt-3 text-sm text-text-muted">
                {brief.moneyAndPayments.currency} · {brief.moneyAndPayments.conversion}
              </p>
            </div>
            <div className="subtle-panel rounded-[1.35rem] p-4">
              <p className="eyebrow">Food and water</p>
              <p className="mt-2 text-base leading-7 text-text-main">{foodAndWaterNote}</p>
            </div>
          </div>

          <label className="block">
            <span className="section-subtitle">Your offline notes</span>
            <span className="mt-1 block text-sm leading-6 text-text-muted">
              Keep the one or two reminders you really need after signal drops.
            </span>
            <textarea
              value={noteValue}
              onChange={(event) => {
                saveCountryNote(brief.countryCode, event.target.value);
              }}
              rows={5}
              placeholder="Hotel transfer reminder, address in local language, SIM pickup note..."
              className="subtle-panel mt-3 w-full rounded-[1.35rem] px-4 py-4 text-sm leading-6 text-text-main outline-none transition focus:border-accent"
            />
          </label>

          <details className="group" open={!isLandingMode}>
            <summary className="liquid-summary">
              <span>Practical details and etiquette</span>
              <span className="text-text-muted transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="section-subtitle">Food and practicalities</h3>
                <InfoList
                  items={[
                    { label: "Tap water", value: brief.foodAndPracticalities.tapWater },
                    { label: "Tipping", value: brief.foodAndPracticalities.tipping },
                    { label: "Dietary notes", value: brief.foodAndPracticalities.dietaryNotes },
                    { label: "Common food tips", value: brief.foodAndPracticalities.commonFoodTips }
                  ]}
                />
              </div>
              <div>
                <h3 className="section-subtitle">Business etiquette</h3>
                <p className="text-sm leading-6 text-text-muted">{brief.businessEtiquette.summary}</p>
                <ul className="editorial-list mt-3">
                  {brief.businessEtiquette.tips.map((tip) => (
                    <li key={tip} className="editorial-list-item text-sm text-text-main">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          <SectionShell
            id="emergency"
            title="Emergency"
            eyebrow="Keep handy"
            emphasis="strong"
            action={<span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">Immediate</span>}
          >
            <div className="rounded-[1.5rem] border border-border-strong bg-linear-to-br from-[#131f2d] via-[#162535] to-[#1d3146] p-5 text-white shadow-[0_20px_50px_rgba(2,8,18,0.34)]">
              <p className="eyebrow text-slate-300">{brief.emergencyNumbers.label}</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight">{brief.emergencyNumbers.number}</p>
              <ul className="editorial-list mt-4">
                {brief.emergencyNumbers.notes.map((note) => (
                  <li key={note} className="editorial-list-item text-sm text-white/90">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </SectionShell>
        </div>
      </SectionShell>
    </>
  );
}
