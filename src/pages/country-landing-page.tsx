import { Link, useParams } from "react-router-dom";

import { SectionShell } from "../components/section-shell";
import { useCountryBrief } from "../hooks/use-country-data";

const harbourHeroImage = "/images/hk-harbour.jpg";

function takeFirstSentence(value: string) {
  const match = value.match(/^[^.?!]+[.?!]/);

  return match ? match[0] : value;
}

export function CountryLandingPage() {
  const { countryCode = "" } = useParams();
  const countryState = useCountryBrief(countryCode);

  if (countryState.status === "loading") {
    return (
      <SectionShell id="landing-loading" title="Loading landing brief" eyebrow="Country data">
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
            {isMissingCountry ? "Before Landing not found" : "Before Landing unavailable offline"}
          </h1>
          <p className="max-w-xl text-sm leading-6 text-text-muted">
            {isMissingCountry
              ? "There is no country summary available for that route yet."
              : "Open this country once while connected and LandingBrief will keep its landing summary available later."}
          </p>
        </section>
        <SectionShell id="landing-not-found" title="Back to brief">
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="button-primary inline-flex rounded-full px-4 py-3 text-sm font-medium"
            >
              Back to Home
            </Link>
            {!isMissingCountry ? (
              <Link
                to="/offline"
                className="button-secondary inline-flex rounded-full px-4 py-3 text-sm font-medium"
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
  const bestAirportOption = brief.airportToCity.options[0];
  const topArrivalEssentials = brief.arrivalEssentials.slice(0, 5);
  const entryReminder = takeFirstSentence(brief.entryRequirements.arrivalCardOrDeclaration);
  const paymentNote = `${brief.moneyAndPayments.cardAcceptance} ${brief.moneyAndPayments.cashNotes}`;
  const foodAndWaterNote = `Tap water: ${brief.foodAndPracticalities.tapWater} ${brief.foodAndPracticalities.commonFoodTips}`;
  const businessHeadline = brief.businessEtiquette.summary;

  return (
    <>
      {countryState.source === "cache" ? (
        <SectionShell id="landing-cached" title="Offline copy" eyebrow="Cached summary">
          <p className="text-sm leading-6 text-text-muted">
            You are viewing the cached landing summary for this destination.
          </p>
        </SectionShell>
      ) : null}

      <section className="hero-frame rounded-[2.2rem] border border-border-soft">
        <img
          src={harbourHeroImage}
          alt="Hong Kong harbour beneath layered cloud viewed from the air"
          className="hero-media"
        />
        <div className="hero-content flex min-h-[29rem] flex-col justify-end p-5 sm:min-h-[33rem] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-md">
              <p className="eyebrow text-text-soft">90-second mode</p>
              <h1 className="mt-3 text-[3.3rem] leading-[0.88] text-white sm:text-[4.25rem]">
                Before Landing
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                {brief.countryName} quick view for the final stretch before touchdown.
              </p>
            </div>
            <span className="pill-chip rounded-full px-3 py-2 text-xs font-medium">
              {brief.countryCode.toUpperCase()}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
            <div className="glass-panel rounded-[1.5rem] p-4">
              <p className="eyebrow">Main city and airport</p>
              <p className="mt-2 text-base font-semibold text-text-main">
                {brief.capitalOrMainCity} via {brief.primaryAirport}
              </p>
            </div>
            <div className="glass-panel rounded-[1.5rem] p-4">
              <p className="eyebrow">First move</p>
              <p className="mt-2 text-base font-semibold text-text-main">
                {bestAirportOption.mode}
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {bestAirportOption.typicalTime} · {bestAirportOption.typicalCost}
              </p>
            </div>
          </div>

          <Link
            to={`/country/${brief.countryCode}`}
            className="button-primary mt-5 inline-flex w-fit items-center rounded-full px-4 py-3 text-sm font-medium transition hover:brightness-110"
          >
            Back to Full Brief
          </Link>
        </div>
      </section>

      <SectionShell id="before-you-land" title="Before you land" eyebrow="Top 5 arrival essentials">
        <ul className="editorial-list">
          {topArrivalEssentials.map((item) => (
            <li key={item} className="editorial-list-item text-base text-text-main">
              {item}
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell id="entry-check" title="Entry check" eyebrow="Last-minute reminder">
        <div className="rounded-[1.35rem] border border-border-soft bg-surface-muted/35 p-4">
          <p className="text-base leading-7 text-text-main">{entryReminder}</p>
        </div>
      </SectionShell>

      <SectionShell id="best-way-into-city" title="Best way into city" eyebrow="Default first move">
        <div className="rounded-[1.35rem] border border-border-soft bg-surface-muted/35 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[1.6rem] text-text-main">{bestAirportOption.mode}</h2>
              <p className="mt-1 text-sm text-text-muted">{bestAirportOption.bestFor}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="pill-chip rounded-full px-3 py-2 text-xs font-medium">
                {bestAirportOption.typicalTime}
              </span>
              <span className="pill-chip rounded-full px-3 py-2 text-xs font-medium">
                {bestAirportOption.typicalCost}
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-text-muted">{bestAirportOption.notes}</p>
        </div>
      </SectionShell>

      <SectionShell id="money-and-payments" title="Money and payments" eyebrow="Spend quickly, safely">
        <div className="rounded-[1.35rem] border border-border-soft bg-surface-muted/35 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            {brief.moneyAndPayments.currency}
          </p>
          <p className="mt-2 text-base leading-7 text-text-main">{paymentNote}</p>
        </div>
      </SectionShell>

      <SectionShell id="food-and-water" title="Food and water" eyebrow="Practical first-hour note">
        <div className="rounded-[1.35rem] border border-border-soft bg-surface-muted/35 p-4">
          <p className="text-base leading-7 text-text-main">{foodAndWaterNote}</p>
        </div>
      </SectionShell>

      <SectionShell id="meeting-etiquette" title="Meeting etiquette" eyebrow="If you are landing for work">
        <div className="rounded-[1.35rem] border border-border-soft bg-surface-muted/35 p-4">
          <p className="text-base leading-7 text-text-main">{businessHeadline}</p>
        </div>
      </SectionShell>

      <SectionShell
        id="emergency"
        title="Emergency"
        eyebrow="Keep handy"
        action={
          <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
            Immediate
          </span>
        }
      >
        <div className="rounded-[1.5rem] border border-border-strong bg-linear-to-br from-[#131f2d] via-[#162535] to-[#1d3146] p-5 text-white shadow-[0_20px_50px_rgba(2,8,18,0.34)]">
          <p className="eyebrow text-slate-300">{brief.emergencyNumbers.label}</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight">
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
