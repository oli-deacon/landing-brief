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
import { getCountryArtwork } from "../lib/country-art";
import { InfoList } from "./info-list";
import { SectionShell } from "./section-shell";

type CountryExperienceProps = {
  mode: "landing" | "full";
};

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
  const artwork = getCountryArtwork(brief.countryCode);
  const modeToggleLabel = isLandingMode ? "Open full brief" : "Switch to landing mode";
  const modeToggleHref = isLandingMode ? `/country/${brief.countryCode}` : `/country/${brief.countryCode}/landing`;
  const heroMetadata = [
    brief.countryCode.toUpperCase(),
    `Reviewed ${brief.lastReviewedDate}`,
    `${brief.capitalOrMainCity} via ${brief.primaryAirport}`
  ];

  return (
    <>
      {countryState.source === "cache" ? (
        <SectionShell id="cached" title="Offline copy" eyebrow="Cached brief">
          <p className="text-sm leading-6 text-text-muted">
            You are viewing a cached copy. Notes and saved items still work offline.
          </p>
        </SectionShell>
      ) : null}

      <section className="hero-frame rounded-[2.2rem] border border-border-soft/70">
        {artwork ? (
          <img src={artwork.src} alt={artwork.alt} className="hero-media hero-media-poster" />
        ) : null}
        <div className="hero-content flex min-h-[24rem] flex-col justify-end px-5 pb-6 pt-10 sm:px-7 sm:pb-8">
          <div className="max-w-3xl">
            <p className="eyebrow">{isLandingMode ? "90-second mode" : "Progressive country brief"}</p>
            <h1 className="mt-3 max-w-2xl text-[3rem] leading-[0.88] text-white sm:text-[4rem]">
              {brief.countryName}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200">
              Start with the fastest arrival path, then open deeper detail only if it earns your attention.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[0.77rem] font-medium tracking-[0.16em] text-slate-300/78 uppercase">
              {heroMetadata.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to={modeToggleHref}
              className="button-primary inline-flex rounded-full px-4 py-3 text-sm font-medium transition hover:brightness-110"
            >
              {modeToggleLabel}
            </Link>
            <button
              type="button"
              onClick={() => {
                toggleSavedCountry(summary);
              }}
              className="button-secondary inline-flex rounded-full px-4 py-3 text-sm font-medium transition hover:border-border-strong hover:text-text-main"
            >
              {saved ? "Remove saved brief" : "Save for offline"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <a
              href="#arrive"
              className="text-slate-200 underline decoration-white/25 underline-offset-4 transition hover:text-white"
            >
              Jump to arrival essentials
            </a>
          </div>

          <div className="mt-7 max-w-3xl">
            <div className="hero-snapshot rounded-[1.5rem] px-4 py-4 sm:px-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Arrival snapshot</p>
                  <p className="mt-2 text-[1.15rem] font-semibold text-text-main">
                    {bestAirportOption.mode} to {brief.capitalOrMainCity}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-text-soft">
                  <span>{bestAirportOption.typicalTime}</span>
                  <span className="text-text-muted">/</span>
                  <span>{bestAirportOption.typicalCost}</span>
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">{bestAirportOption.bestFor}</p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-main">{entryReminder}</p>
            </div>
          </div>
        </div>
      </section>

      <details className="section-frame rounded-[1.25rem] px-4 py-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-text-main">
          <span>Jump to</span>
          <span className="text-text-muted">Arrive / Move / Settle</span>
        </summary>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href="#arrive" className="nav-context-pill">
            Arrive
          </a>
          <a href="#move" className="nav-context-pill">
            Move
          </a>
          <a href="#settle" className="nav-context-pill">
            Settle
          </a>
        </div>
      </details>

      <SectionShell
        id="arrive"
        title="Arrive"
        eyebrow="The first decisions after touchdown"
        action={<span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">Start here</span>}
      >
        <div className="space-y-10">
          <div className="country-section-intro">
            <p className="max-w-2xl text-sm leading-7 text-text-muted">
              This section should answer the first few questions before you leave the arrivals hall:
              what to clear, what to keep handy, and what decision gets you moving fastest.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
            <div className="space-y-8">
              <div>
                <h3 className="section-subtitle">Arrival essentials</h3>
                <ul className="editorial-list editorial-list-strong mt-4">
                  {topArrivalEssentials.map((item) => (
                    <li key={item} className="editorial-list-item text-sm text-text-main">
                      {item}
                    </li>
                  ))}
                </ul>
                {isLandingMode && brief.arrivalEssentials.length > topArrivalEssentials.length ? (
                  <p className="mt-3 text-sm text-text-muted">
                    Open the full brief to reveal the remaining arrival checks.
                  </p>
                ) : null}
              </div>

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
            </div>

            <aside className="space-y-4">
              <div className="muted-module rounded-[1.4rem] p-4">
                <p className="eyebrow">Important notes</p>
                <ul className="editorial-list mt-4">
                  {brief.entryRequirements.importantNotes.map((note) => (
                    <li key={note} className="editorial-list-item text-sm text-text-main">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="muted-module rounded-[1.4rem] p-4">
                <p className="eyebrow">Official links</p>
                <div className="mt-4 flex flex-wrap gap-2">
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
            </aside>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="move" title="Move" eyebrow="Choose transport and local tools">
        <div className="space-y-10">
          <div className="country-section-intro">
            <p className="max-w-2xl text-sm leading-7 text-text-muted">
              Once you are through formalities, the goal is speed and confidence: pick the right
              airport transfer, keep one or two trusted local tools handy, and defer the rest.
            </p>
          </div>

          <div>
            <h3 className="section-subtitle">Airport to city</h3>
            <p className="mt-1 text-sm leading-6 text-text-muted">{brief.airportToCity.airportName}</p>
            <div className="mt-5 space-y-3">
              {brief.airportToCity.options.map((option, index) => (
                <div key={option.mode} className="decision-card rounded-[1.35rem] px-4 py-4 sm:px-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <p className="eyebrow">{index === 0 ? "Recommended first look" : `Option ${index + 1}`}</p>
                      <h4 className="mt-2 text-[1.2rem] text-text-main">{option.mode}</h4>
                      <p className="mt-2 text-sm text-text-soft">{option.bestFor}</p>
                    </div>
                    <div className="decision-card-meta">
                      <span>{option.typicalTime}</span>
                      <span>{option.typicalCost}</span>
                    </div>
                  </div>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-text-muted">{option.notes}</p>
                </div>
              ))}
            </div>
          </div>

          <details className="group disclosure-block" open={!isLandingMode}>
            <summary className="liquid-summary">
              <span>Transport apps and city navigation</span>
              <span className="text-text-muted transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {brief.localTransportApps.map((app) => (
                <div key={app.name} className="muted-module rounded-[1.2rem] p-4">
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

          <details className="group disclosure-block" open={false}>
            <summary className="liquid-summary">
              <span>Handy phrases</span>
              <span className="text-text-muted transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 grid gap-3">
              {brief.handyPhrases.map((phrase) => (
                <div key={`${phrase.english}-${phrase.local}`} className="muted-module rounded-[1.2rem] p-4">
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
        <div className="space-y-10">
          <div className="country-section-intro">
            <p className="max-w-2xl text-sm leading-7 text-text-muted">
              This is the calm-down layer: how to pay, what to remember once signal drops, and the
              practical reference details worth keeping for later in the day.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
            <div className="space-y-4">
              <div className="muted-module rounded-[1.35rem] p-4">
                <p className="eyebrow">Money and payments</p>
                <p className="mt-2 text-base leading-7 text-text-main">{paymentNote}</p>
                <p className="mt-3 text-sm text-text-muted">
                  {brief.moneyAndPayments.currency} · {brief.moneyAndPayments.conversion}
                </p>
              </div>
              <div className="muted-module rounded-[1.35rem] p-4">
                <p className="eyebrow">Food and water</p>
                <p className="mt-2 text-base leading-7 text-text-main">{foodAndWaterNote}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="muted-module rounded-[1.35rem] p-4">
                <p className="eyebrow">{brief.emergencyNumbers.label}</p>
                <p className="mt-2 text-[1.85rem] font-semibold tracking-tight text-text-main sm:text-[2rem]">
                  {brief.emergencyNumbers.number}
                </p>
                <ul className="editorial-list mt-3">
                  {brief.emergencyNumbers.notes.map((note) => (
                    <li key={note} className="editorial-list-item text-sm text-text-main">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <label className="block rounded-[1.45rem] border border-border-soft/80 bg-[rgba(10,18,29,0.28)] px-4 py-4 sm:px-5">
            <span className="section-subtitle">Your offline notes</span>
            <span className="mt-1 block max-w-xl text-sm leading-6 text-text-muted">
              Keep the one or two reminders you really need after signal drops.
            </span>
            <textarea
              value={noteValue}
              onChange={(event) => {
                saveCountryNote(brief.countryCode, event.target.value);
              }}
              rows={5}
              placeholder="Hotel transfer reminder, address in local language, SIM pickup note..."
              className="mt-4 w-full rounded-[1.1rem] border border-border-soft/80 bg-transparent px-4 py-4 text-sm leading-6 text-text-main outline-none transition focus:border-accent"
            />
          </label>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
            <details className="group disclosure-block" open={!isLandingMode}>
              <summary className="liquid-summary">
                <span>Practical details and etiquette</span>
                <span className="text-text-muted transition group-open:rotate-45">+</span>
              </summary>
              <div className="mt-4">
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
            </details>

            <div className="muted-module rounded-[1.35rem] p-4" id="business-etiquette">
              <p className="eyebrow">Work-travel reference</p>
              <h3 className="mt-2 text-[1.4rem] text-text-main">Business etiquette</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">{brief.businessEtiquette.summary}</p>
              <ul className="editorial-list mt-4">
                {brief.businessEtiquette.tips.map((tip) => (
                  <li key={tip} className="editorial-list-item text-sm text-text-main">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionShell>
    </>
  );
}
