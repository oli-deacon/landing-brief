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
import { getSafeExternalUrl } from "../lib/safe-url";
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
      <div className="country-page space-y-6">
        <SectionShell
          id="loading"
          title="Loading brief"
          eyebrow="Country data"
          emphasis="strong"
          variant="country"
        >
          <div className="h-48 animate-pulse rounded-[1.35rem] bg-white/6" />
        </SectionShell>
      </div>
    );
  }

  if (countryState.status === "error") {
    const isMissingCountry = countryState.error.message === "not-found";

    return (
      <div className="country-page space-y-6">
        <section className="country-empty-state rounded-[1.7rem] px-5 py-8 sm:px-7">
          <p className="country-kicker">{isMissingCountry ? "Route not found" : "Offline fallback"}</p>
          <h1 className="country-display-title mt-4 max-w-2xl text-[2.6rem] leading-[0.92] sm:text-[3.4rem]">
            {isMissingCountry ? "Country brief not found" : "Country brief unavailable offline"}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted">
            {isMissingCountry
              ? "There is no seeded country content for that code yet."
              : "Open this destination once while connected and LandingBrief will keep it available for offline use later."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/" className="button-primary country-button-primary inline-flex rounded-lg px-5 py-3 text-sm font-medium">
              Back to Home
            </Link>
            <Link
              to="/saved"
              className="button-secondary country-button-secondary inline-flex rounded-lg px-5 py-3 text-sm font-medium"
            >
              Open saved items
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const brief = countryState.data;
  const summary = createCountrySummary(brief);
  const saved = library.savedCountries.some(
    (country) => country.countryCode.toLowerCase() === brief.countryCode.toLowerCase()
  );
  const noteValue = library.notes[brief.countryCode.toLowerCase()]?.value ?? "";
  const bestArrivalOption = brief.airportToCity.options[0] ?? {
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
  const primaryEsimOption = brief.communications.esimOptions[0];
  const handyPhrasePreview = brief.handyPhrases.slice(0, 5);
  const isLandingMode = mode === "landing";
  const artwork = getCountryArtwork(brief.countryCode);
  const safeOfficialLinks = brief.entryRequirements.officialLinks.flatMap((link) => {
    const safeUrl = getSafeExternalUrl(link.url);

    return safeUrl ? [{ ...link, safeUrl }] : [];
  });

  if (isLandingMode) {
    return (
      <div className="country-page space-y-8 sm:space-y-10">
        <section className="country-hero country-arrival-hero hero-frame rounded-[2rem] border border-white/8">
          {artwork?.kind === "image" ? <img src={artwork.src} alt={artwork.alt} className="hero-media hero-media-poster" /> : null}
          <div className="hero-content country-arrival-hero-content">
            <p className="country-kicker">{brief.countryName}</p>
            <h1 className="country-display-title mt-4 text-[3.2rem] leading-[0.84] text-white sm:text-[5.2rem]">Your first hour, sorted.</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[rgba(250,250,250,0.82)]">
              The few decisions that get you from arrival to settled: entry, the best onward move, and what to keep close.
            </p>
            <div className="destination-mode-switch mt-7" aria-label="Destination modes">
              <span className="destination-mode-link is-active">Arrival brief</span>
              <Link to={`/country/${brief.countryCode}/explore`} className="destination-mode-link">Explore</Link>
              <Link to={`/country/${brief.countryCode}/run`} className="destination-mode-link">Run</Link>
            </div>
          </div>
        </section>

        <section className="country-arrival-path" aria-label="Arrival path">
          <div className="country-arrival-step">
            <span>01</span>
            <div>
              <p className="country-kicker">Clear entry</p>
              <h2>{takeFirstSentence(brief.entryRequirements.visaSummary)}</h2>
              <p>{entryReminder}</p>
            </div>
          </div>
          <div className="country-arrival-step">
            <span>02</span>
            <div>
              <p className="country-kicker">Choose your move</p>
              <h2>{bestArrivalOption.mode}</h2>
              <p>{bestArrivalOption.typicalTime} · {bestArrivalOption.typicalCost}. {bestArrivalOption.bestFor}</p>
            </div>
          </div>
          <div className="country-arrival-step">
            <span>03</span>
            <div>
              <p className="country-kicker">Keep close</p>
              <h2>{brief.moneyAndPayments.currency} and a data plan.</h2>
              <p>{takeFirstSentence(brief.moneyAndPayments.cashNotes)} {takeFirstSentence(brief.communications.networkWhy)}</p>
            </div>
          </div>
        </section>

        <section className="country-arrival-more">
          <div>
            <p className="country-kicker">Need the detail?</p>
            <h2>Transport options, useful words, payments, food and local tools.</h2>
          </div>
          <Link to={`/country/${brief.countryCode}`} className="button-primary country-button-primary inline-flex rounded-lg px-5 py-3 text-sm font-medium">Open full brief</Link>
        </section>

        {safeOfficialLinks.length > 0 ? (
          <div className="country-official-links">
            <p className="country-kicker">Before you leave</p>
            <div>
              {safeOfficialLinks.slice(0, 3).map((link) => (
                <a key={link.safeUrl} href={link.safeUrl} target="_blank" rel="noopener noreferrer">{link.label}</a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  const renderPhraseCard = (phrase: (typeof brief.handyPhrases)[number]) => (
    <div key={`${phrase.english}-${phrase.local}`} className="country-side-card rounded-[1.2rem] p-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="country-kicker">English</p>
          <p className="mt-1 text-sm font-semibold text-text-main">{phrase.english}</p>
        </div>
        <div>
          <p className="country-kicker">Local</p>
          <p className="mt-1 text-sm font-semibold text-text-main">{phrase.local}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-text-muted">Pronunciation: {phrase.pronunciation}</p>
      <p className="mt-2 text-sm leading-6 text-text-muted">{phrase.context}</p>
    </div>
  );

  return (
    <div className="country-page space-y-6 sm:space-y-8">
      <div className="country-page-orb country-page-orb-top" aria-hidden="true" />
      <div className="country-page-orb country-page-orb-bottom" aria-hidden="true" />

      {countryState.source === "cache" ? (
        <SectionShell
          id="cached"
          title="Offline copy"
          eyebrow="Cached brief"
          emphasis="strong"
          variant="country"
        >
          <p className="text-sm leading-7 text-text-muted">
            You are viewing a cached copy. Notes and saved items still work offline.
          </p>
        </SectionShell>
      ) : null}

      <section className="country-hero country-brief-hero hero-frame rounded-[2rem] border border-white/8">
        {artwork?.kind === "image" ? (
          <img src={artwork.src} alt={artwork.alt} className="hero-media hero-media-poster" />
        ) : null}
        {artwork?.kind === "placeholder" ? (
          <div className="hero-media hero-media-placeholder">
            <div className="hero-placeholder-card">
              <p className="country-kicker text-text-soft">{artwork.label}</p>
              <h2 className="mt-3 text-[1.9rem] leading-[0.92] text-white sm:text-[2.5rem]">
                {artwork.title}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-200">
                {artwork.description}
              </p>
            </div>
          </div>
        ) : null}

        <div className="hero-content country-brief-hero-content">
          <div className="max-w-3xl">
            <p className="country-kicker">Practical destination brief</p>
            <h1 className="country-display-title mt-4 max-w-3xl text-[3.1rem] leading-[0.84] text-white sm:text-[4.45rem] lg:text-[5.35rem]">
              {brief.countryName}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[rgba(250,250,250,0.82)]">
              The details that matter once you land: entry, transport, payments, data, and the practical texture of your first days.
            </p>
            <div className="destination-mode-switch mt-7" aria-label="Destination modes">
              <Link to={`/country/${brief.countryCode}/landing`} className="destination-mode-link">Arrival brief</Link>
              <Link to={`/country/${brief.countryCode}/explore`} className="destination-mode-link">Explore</Link>
              <Link to={`/country/${brief.countryCode}/run`} className="destination-mode-link">Run</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="country-brief-tools">
        <div>
          <p className="country-kicker">{brief.primaryAirport}</p>
          <p>Reviewed {brief.lastReviewedDate} · {bestArrivalOption.mode}</p>
        </div>
        <button type="button" onClick={() => { toggleSavedCountry(summary); }} className="country-text-link text-sm font-medium">
          {saved ? "Remove from offline" : "Save for offline"}
        </button>
      </section>

      <details className="country-jump-nav rounded-[1.3rem] px-4 py-4 sm:px-5" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-text-main">
          <span className="country-kicker !text-[0.68rem]">Jump to</span>
          <span className="text-text-muted">Arrive / Move / Settle</span>
        </summary>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href="#arrive" className="nav-context-pill country-nav-context-pill">
            Arrive
          </a>
          <a href="#move" className="nav-context-pill country-nav-context-pill">
            Move
          </a>
          <a href="#settle" className="nav-context-pill country-nav-context-pill">
            Settle
          </a>
        </div>
      </details>

      <SectionShell
        id="arrive"
        title="Arrive"
        eyebrow="The first decisions after arrival"
        action={<span className="pill-chip country-pill-chip rounded-full px-3 py-1 text-xs font-medium">Start here</span>}
        variant="country"
      >
        <div className="space-y-8">
          <div className="country-section-intro">
            <p className="max-w-2xl text-sm leading-7 text-text-muted">
              This section should answer the first few questions before you leave the terminal or border hall:
              what to clear, what to keep handy, and what decision gets you moving fastest.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
            <div className="country-side-card rounded-[1.3rem] p-5 sm:p-6">
              <h3 className="section-subtitle">Arrival essentials</h3>
              <ul className="editorial-list editorial-list-strong mt-5">
                {topArrivalEssentials.map((item) => (
                  <li key={item} className="editorial-list-item text-sm text-text-main">
                    {item}
                  </li>
                ))}
              </ul>
              {isLandingMode && brief.arrivalEssentials.length > topArrivalEssentials.length ? (
                <p className="mt-4 text-sm leading-7 text-text-muted">
                  Open the full brief to reveal the remaining arrival checks.
                </p>
              ) : null}
            </div>

            <aside className="space-y-4">
              <div className="country-side-card rounded-[1.3rem] p-5">
                <p className="country-kicker">Important notes</p>
                <ul className="editorial-list mt-4">
                  {brief.entryRequirements.importantNotes.map((note) => (
                    <li key={note} className="editorial-list-item text-sm text-text-main">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="country-side-card rounded-[1.3rem] p-5">
                <p className="country-kicker">Official links</p>
                <p className="mt-3 text-sm leading-7 text-text-muted">
                  {brief.entryRequirements.officialSourceNote}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {safeOfficialLinks.map((link) => (
                    <a
                      key={link.safeUrl}
                      href={link.safeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill-chip country-pill-chip inline-flex rounded-full px-3 py-2 text-xs font-medium"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                {safeOfficialLinks.length === 0 ? (
                  <p className="mt-4 text-sm leading-7 text-text-muted">
                    Official links are temporarily unavailable in this copy of the brief.
                  </p>
                ) : null}
              </div>
            </aside>
          </div>

          <div className="country-side-card rounded-[1.3rem] p-5 sm:p-6">
            <h3 className="section-subtitle">Entry requirements</h3>
            <div className="mt-4">
              <InfoList
                variant="country"
                items={[
                  { label: "Passport validity", value: brief.entryRequirements.passportValidity },
                  { label: "Visa summary", value: brief.entryRequirements.visaSummary },
                  { label: "Arrival card", value: brief.entryRequirements.arrivalCardOrDeclaration }
                ]}
              />
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="move" title="Move" eyebrow="Choose transport and local tools" variant="country">
        <div className="space-y-8">
          <div className="country-section-intro">
            <p className="max-w-2xl text-sm leading-7 text-text-muted">
              Once you are through formalities, the goal is speed and confidence: pick the right
              arrival transfer, keep one or two trusted local tools handy, and defer the rest.
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="section-subtitle">Arrival route options</h3>
                <p className="mt-1 text-sm leading-6 text-text-muted">{brief.airportToCity.airportName}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {brief.airportToCity.options.map((option, index) => (
                <div key={option.mode} className="decision-card country-decision-card rounded-[1.3rem] px-5 py-5 sm:px-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <p className="country-kicker">{index === 0 ? "Recommended first look" : `Option ${index + 1}`}</p>
                      <h4 className="mt-2 text-[1.22rem] font-semibold text-text-main">{option.mode}</h4>
                      <p className="mt-3 text-sm leading-7 text-text-soft">{option.bestFor}</p>
                    </div>
                    <div className="decision-card-meta">
                      <span>{option.typicalTime}</span>
                      <span>{option.typicalCost}</span>
                    </div>
                  </div>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-text-muted">{option.notes}</p>
                </div>
              ))}
            </div>
          </div>

          <details className="group disclosure-block country-disclosure-block" open={!isLandingMode}>
            <summary className="liquid-summary country-liquid-summary">
              <span>Transport apps and city navigation</span>
              <span className="text-text-muted transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {brief.localTransportApps.map((app) => (
                <div key={app.name} className="country-side-card rounded-[1.2rem] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h4 className="text-base font-semibold text-text-main">{app.name}</h4>
                    <span className="country-kicker">App</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-text-main">{app.useCase}</p>
                  <p className="mt-2 text-sm leading-6 text-text-muted">{app.notes}</p>
                </div>
              ))}
            </div>
          </details>

          {isLandingMode ? (
            <div className="country-side-card rounded-[1.3rem] p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="country-kicker">Local language quick card</p>
                  <h3 className="section-subtitle mt-2">Handy words and phrases</h3>
                </div>
                <span className="country-meta-pill">{handyPhrasePreview.length} phrases</span>
              </div>
              <div className="mt-5 grid gap-3">
                {handyPhrasePreview.map(renderPhraseCard)}
              </div>
            </div>
          ) : null}

          <details className="group disclosure-block country-disclosure-block" open={!isLandingMode}>
            <summary className="liquid-summary country-liquid-summary">
              <span>Handy phrases</span>
              <span className="text-text-muted transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-5 grid gap-3">
              {brief.handyPhrases.map(renderPhraseCard)}
            </div>
          </details>
        </div>
      </SectionShell>

      <SectionShell
        id="settle"
        title="Settle"
        eyebrow="Money, food, notes, and backup details"
        variant="country"
      >
        <div className="space-y-8">
          <div className="country-section-intro">
            <p className="max-w-2xl text-sm leading-7 text-text-muted">
              This is the calm-down layer: how to pay, what to remember once signal drops, and the
              practical reference details worth keeping for later in the day.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(19rem,0.95fr)]">
            <div className="space-y-4">
              <div className="country-side-card rounded-[1.3rem] p-5">
                <p className="country-kicker">Money and payments</p>
                <p className="mt-3 text-base leading-7 text-text-main">{paymentNote}</p>
                <p className="mt-4 text-sm leading-6 text-text-muted">
                  {brief.moneyAndPayments.currency} · {brief.moneyAndPayments.conversion}
                </p>
              </div>
              <div className="country-side-card rounded-[1.3rem] p-5">
                <p className="country-kicker">Food and water</p>
                <p className="mt-3 text-base leading-7 text-text-main">{foodAndWaterNote}</p>
              </div>
              <div className="country-side-card rounded-[1.3rem] p-5">
                <p className="country-kicker">Communications</p>
                <p className="mt-3 text-base leading-7 text-text-main">{brief.communications.bestMobileNetwork}</p>
                <p className="mt-3 text-sm leading-6 text-text-muted">{brief.communications.networkWhy}</p>
                {primaryEsimOption ? (
                  <p className="mt-4 text-sm leading-6 text-text-soft">
                    Best first eSIM look: {primaryEsimOption.name} for {primaryEsimOption.bestFor.toLowerCase()}.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="country-side-card rounded-[1.3rem] p-5">
              <p className="country-kicker">{brief.emergencyNumbers.label}</p>
              <p className="mt-3 text-[2rem] font-semibold tracking-tight text-text-main sm:text-[2.35rem]">
                {brief.emergencyNumbers.number}
              </p>
              <ul className="editorial-list mt-4">
                {brief.emergencyNumbers.notes.map((note) => (
                  <li key={note} className="editorial-list-item text-sm text-text-main">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <label className="country-notes-panel block rounded-[1.4rem] px-5 py-5 sm:px-6">
            <span className="section-subtitle">Your offline notes</span>
            <span className="mt-2 block max-w-xl text-sm leading-6 text-text-muted">
              Keep the one or two reminders you really need after signal drops.
            </span>
            <textarea
              value={noteValue}
              onChange={(event) => {
                saveCountryNote(brief.countryCode, event.target.value);
              }}
              rows={5}
              placeholder="Hotel transfer reminder, address in local language, SIM pickup note..."
              className="country-notes-input mt-4 w-full rounded-[1rem] px-4 py-4 text-sm leading-6 text-text-main outline-none"
            />
          </label>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.9fr)]">
            <details className="group disclosure-block country-disclosure-block" open={!isLandingMode}>
              <summary className="liquid-summary country-liquid-summary">
                <span>Practical details and etiquette</span>
                <span className="text-text-muted transition group-open:rotate-45">+</span>
              </summary>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="country-side-card rounded-[1.3rem] p-5">
                  <h3 className="section-subtitle">Food and practicalities</h3>
                  <div className="mt-4">
                    <InfoList
                      variant="country"
                      items={[
                        { label: "Tap water", value: brief.foodAndPracticalities.tapWater },
                        { label: "Tipping", value: brief.foodAndPracticalities.tipping },
                        { label: "Dietary notes", value: brief.foodAndPracticalities.dietaryNotes },
                        { label: "Common food tips", value: brief.foodAndPracticalities.commonFoodTips }
                      ]}
                    />
                  </div>
                </div>

                <div className="country-side-card rounded-[1.3rem] p-5">
                  <p className="country-kicker">Signal setup</p>
                  <h3 className="mt-3 text-[1.5rem] text-text-main">Communications</h3>
                  <p className="mt-3 text-sm leading-7 text-text-muted">
                    Best mobile network: <span className="font-semibold text-text-main">{brief.communications.bestMobileNetwork}</span>
                  </p>
                  <p className="mt-2 text-sm leading-7 text-text-muted">{brief.communications.networkWhy}</p>

                  <div className="mt-5 space-y-3">
                    {brief.communications.esimOptions.map((option, index) => (
                      <div key={option.name} className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 py-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-text-main">{option.name}</p>
                            <p className="mt-1 text-sm text-text-soft">{option.bestFor}</p>
                          </div>
                          <span className="country-kicker">{index === 0 ? "Top pick" : `Option ${index + 1}`}</span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-text-muted">{option.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </details>

            <details
              className="group disclosure-block country-disclosure-block"
              id="business-etiquette"
            >
              <summary className="liquid-summary country-liquid-summary">
                <span>Expand: Work-travel reference</span>
                <span className="text-text-main">Business etiquette</span>
                <span className="text-text-muted transition group-open:rotate-45">+</span>
              </summary>
              <div className="mt-5 country-side-card rounded-[1.3rem] p-5">
                <p className="country-kicker">Work-travel reference</p>
                <h3 className="mt-3 text-[1.5rem] text-text-main">Business etiquette</h3>
                <p className="mt-3 text-sm leading-7 text-text-muted">{brief.businessEtiquette.summary}</p>
                <ul className="editorial-list mt-4">
                  {brief.businessEtiquette.tips.map((tip) => (
                    <li key={tip} className="editorial-list-item text-sm text-text-main">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
