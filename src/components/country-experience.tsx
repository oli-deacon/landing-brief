import { useEffect, useState } from "react";
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
import { ArrivalDetails, PracticalFacts } from "./arrival-details";
import { SectionShell } from "./section-shell";
import { BriefContents } from "./brief-contents";

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
  const [copyStatus, setCopyStatus] = useState("");
  const [noteStatus, setNoteStatus] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => { setCopyStatus(""); setNoteStatus(""); setSaveStatus(""); }, [countryCode]);

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
  const entryReminder = takeFirstSentence(brief.entryRequirements.arrivalCardOrDeclaration);
  const paymentNote = `${brief.moneyAndPayments.cardAcceptance} ${brief.moneyAndPayments.cashNotes}`;
  const costContext = brief.moneyAndPayments.roughCostContext;
  const costSources = (costContext?.sources ?? []).flatMap((source) => {
    const safeUrl = getSafeExternalUrl(source.url);
    return safeUrl ? [{ ...source, safeUrl }] : [];
  });
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

        <ArrivalDetails guide={brief.arrivalGuide} compact />
        <PracticalFacts facts={brief.quickFacts} />

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

  const destinationName = brief.countryCode.toLowerCase() === "in" ? "Goa, India" : brief.countryName;
  const isMacau = brief.countryCode.toLowerCase() === "mo";
  const renderPhrase = (phrase: (typeof brief.handyPhrases)[number]) => (
    <div key={phrase.english} className="brief-phrase">
      <div>
        <h3>{phrase.english}</h3>
        <p className="brief-phrase-local">{phrase.local}</p>
        <p className="text-sm text-text-muted">{phrase.pronunciation}</p>
        <details className="brief-inline-detail"><summary>When to use it</summary><p>{phrase.context}</p></details>
      </div>
      <button type="button" className="brief-small-button" aria-label={`Copy ${phrase.english}`} onClick={async () => {
        try { await navigator.clipboard.writeText(phrase.local); setCopyStatus(`Copied “${phrase.english}”.`); }
        catch { setCopyStatus("Could not copy. Select the phrase to copy it manually."); }
      }}>{copyStatus === `Copied “${phrase.english}”.` ? "Copied" : "Copy"}</button>
    </div>
  );

  return (
    <div className="country-page full-brief space-y-6 sm:space-y-8">
      {countryState.source === "cache" ? <p className="brief-status">Offline copy · Notes and saved items work on this device.</p> : null}
      <section className="country-hero country-brief-hero hero-frame rounded-[2rem] border border-white/8">
        {artwork?.kind === "image" ? <img src={artwork.src} alt={artwork.alt} className="hero-media hero-media-poster" /> : null}
        <div className="hero-content country-brief-hero-content">
          <p className="country-kicker">Full destination brief</p>
          <h1 className="country-display-title text-white">{destinationName}</h1>
          <p className="brief-hero-scope">{brief.capitalOrMainCity !== brief.countryName && !destinationName.includes(brief.capitalOrMainCity) ? `${brief.capitalOrMainCity} · ` : ""}{brief.primaryAirport}</p>
          <p className="brief-hero-description">Your practical guide to arriving, getting around and settling in.</p>
        </div>
      </section>

      <div className="country-brief-tools">
        <p>Brief reviewed {brief.lastReviewedDate}</p>
        <div className="brief-save-actions">
          <button type="button" aria-pressed={saved} className="brief-small-button" onClick={() => {
            try { const next = toggleSavedCountry(summary); setSaveStatus(next ? "Saved for offline use on this device." : "Removed from your saved briefs."); }
            catch { setSaveStatus("Could not update saved briefs. Check that browser storage is available."); }
          }}>{saved ? "Saved offline · Remove" : "Save for offline"}</button>
          <span role="status">{saveStatus}</span>
        </div>
      </div>

      <BriefContents />

      <SectionShell id="arrive" title="Entry & arrival" eyebrow={brief.primaryAirport} variant="country">
        <div className="brief-entry-grid">
          <div>
            <h3 className="section-subtitle">Before you leave arrivals</h3>
            <ul className="editorial-list editorial-list-strong mt-4">{brief.arrivalEssentials.map(item => <li key={item} className="editorial-list-item text-sm text-text-main">{item}</li>)}</ul>
          </div>
          <div>
            <h3 className="section-subtitle">Entry requirements</h3>
            <div className="mt-4"><InfoList variant="country" items={[
              { label: "Passport validity", value: brief.entryRequirements.passportValidity },
              { label: "Visa", value: brief.entryRequirements.visaSummary },
              { label: "Arrival card", value: brief.entryRequirements.arrivalCardOrDeclaration }
            ]} /></div>
          </div>
        </div>
        <details className="brief-inline-detail mt-5"><summary>Important notes & official guidance</summary>
          <ul className="editorial-list mt-4">{brief.entryRequirements.importantNotes.map(note => <li className="editorial-list-item" key={note}>{note}</li>)}</ul>
          <p>{brief.entryRequirements.officialSourceNote}</p>
          <div className="brief-source-links">{safeOfficialLinks.map(link => <a key={link.safeUrl} href={link.safeUrl} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div>
          {!safeOfficialLinks.length ? <p>Official links are unavailable in this copy.</p> : null}
        </details>
      </SectionShell>

      <SectionShell id="move" title={isMacau ? "Getting to & around Macau" : "Transport"} eyebrow={brief.arrivalGuide?.scope ?? brief.airportToCity.airportName} variant="country">
        <div className="brief-transport-options">
          {brief.airportToCity.options.map((option, index) => <article key={option.mode} className="brief-transport-option">
            {isMacau ? <p className="country-kicker">{["Bridge from Hong Kong", "Ferry from Hong Kong", "Already in Macau"][index] ?? "Local transfer"}</p> : null}
            <h3 className="section-subtitle">{option.mode}</h3>
            <dl className="brief-transport-facts">
              <div><dt>Journey time</dt><dd>{option.typicalTime}</dd></div>
              <div><dt>Typical cost</dt><dd>{option.typicalCost}</dd></div>
              <div><dt>Best for</dt><dd>{option.bestFor}</dd></div>
            </dl>
            {brief.countryCode.toLowerCase() === "kr" && index === 0 ? <p className="brief-lead">{option.notes}</p> :
              <details className="brief-inline-detail"><summary>Route & pickup details</summary><p>{option.notes}</p></details>}
          </article>)}
        </div>
        <ArrivalDetails guide={brief.arrivalGuide} compact />
        <div className="brief-apps" id="transport-apps">
          <h3 className="section-subtitle">Local transport & navigation apps</h3>
          <div className="brief-two-columns mt-4">{brief.localTransportApps.map(app => <div key={app.name}>
            <h4 className="font-semibold">{app.name}</h4><p className="mt-2 text-sm text-text-soft">{app.useCase}</p>
            <details className="brief-inline-detail"><summary>Using {app.name}</summary><p>{app.notes}</p></details>
          </div>)}</div>
        </div>
      </SectionShell>

      <SectionShell id="settle" title="Money & payments" eyebrow={brief.moneyAndPayments.currency} variant="country">
        <p className="brief-lead">{paymentNote}</p>
        <p className="mt-3 text-sm text-text-muted">{brief.moneyAndPayments.conversion}</p>
        {brief.moneyAndPayments.roughCostExamples.length ? <div className="mt-5"><h3 className="section-subtitle">Everyday costs</h3>
          <ul className="brief-cost-list">{brief.moneyAndPayments.roughCostExamples.map(example => <li key={example}>{example}</li>)}</ul>
        </div> : null}
        <details className="brief-inline-detail"><summary>Cost context & sources · {costContext?.reviewedDate ?? brief.lastReviewedDate}</summary>
          <p>{costContext?.note ?? "Approximate costs from this brief; actual prices and exchange rates vary."}</p>
          <div className="brief-source-links">{costSources.map(source => <a key={source.safeUrl} href={source.safeUrl} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div>
        </details>
      </SectionShell>

      <SectionShell id="connectivity" title="Connectivity" eyebrow="Mobile data & SIMs" variant="country">
        <h3 className="section-subtitle">{brief.communications.bestMobileNetwork}</h3>
        <p className="brief-lead mt-3">{brief.communications.networkWhy}</p>
        <details className="brief-inline-detail mt-4"><summary>Compare {brief.communications.esimOptions.length} SIM & eSIM options</summary>
          <div className="brief-two-columns mt-4">{brief.communications.esimOptions.map(option => <div key={option.name}>
            <h4 className="font-semibold">{option.name}</h4><p>{option.bestFor}</p><p>{option.notes}</p>
          </div>)}</div>
        </details>
      </SectionShell>

      <SectionShell id="food" title="Food & everyday practicalities" variant="country">
        <InfoList variant="country" items={[
          {label: "Drinking water", value: brief.foodAndPracticalities.tapWater},
          {label: "Eating locally", value: brief.foodAndPracticalities.commonFoodTips},
          {label: "Dietary notes", value: brief.foodAndPracticalities.dietaryNotes},
          {label: "Tipping", value: brief.foodAndPracticalities.tipping}
        ]} />
        <details className="brief-inline-detail mt-5" id="business-etiquette"><summary>Business etiquette</summary>
          <p>{brief.businessEtiquette.summary}</p><ul className="editorial-list mt-3">{brief.businessEtiquette.tips.map(tip => <li key={tip} className="editorial-list-item">{tip}</li>)}</ul>
        </details>
      </SectionShell>

      <SectionShell id="phrases" title="Useful phrases" eyebrow="Words to keep handy" variant="country">
        <div>{brief.handyPhrases.slice(0, 3).map(renderPhrase)}</div>
        {brief.handyPhrases.length > 3 ? <details className="brief-inline-detail mt-4"><summary>View all {brief.handyPhrases.length} phrases</summary>
          <div>{brief.handyPhrases.slice(3).map(renderPhrase)}</div>
        </details> : null}
        <p role="status" className="brief-feedback">{copyStatus}</p>
      </SectionShell>

      <PracticalFacts facts={brief.quickFacts} />

      <SectionShell id="emergency" title="Help & offline notes" variant="country">
        <div className="brief-two-columns brief-help-grid">
          <div><h3 className="section-subtitle">{brief.emergencyNumbers.label}</h3>
            <p className="brief-emergency-number">{brief.emergencyNumbers.number}</p>
            <ul className="editorial-list mt-3">{brief.emergencyNumbers.notes.map(note => <li key={note} className="editorial-list-item text-sm">{note}</li>)}</ul>
          </div>
          <label className="block"><span className="section-subtitle">Your offline notes</span>
            <span className="mt-2 block text-sm text-text-muted">Keep your hotel address, pickup details or a reminder here.</span>
            <textarea value={noteValue} onChange={event => {
              try { saveCountryNote(brief.countryCode, event.target.value); setNoteStatus(event.target.value.trim() ? "Saved on this device" : "Note cleared"); }
              catch { setNoteStatus("Could not save. Browser storage may be full or unavailable."); }
            }} rows={4} placeholder="Hotel address, transfer reminder…" className="country-notes-input mt-4 w-full rounded-xl p-4 text-sm" />
            <span role="status" className="brief-feedback">{noteStatus || (noteValue ? "Saved on this device" : "Notes save automatically on this device")}</span>
          </label>
        </div>
      </SectionShell>
    </div>
  );
}
