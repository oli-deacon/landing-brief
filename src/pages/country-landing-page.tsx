import { Link, useParams } from "react-router-dom";

import { SectionShell } from "../components/section-shell";
import { getCountryByCode } from "../data/countries";

function takeFirstSentence(value: string) {
  const match = value.match(/^[^.?!]+[.?!]/);

  return match ? match[0] : value;
}

export function CountryLandingPage() {
  const { countryCode = "" } = useParams();
  const brief = getCountryByCode(countryCode);

  if (!brief) {
    return (
      <>
        <section className="space-y-2 px-1">
          <h1 className="text-3xl font-semibold tracking-tight text-text-main">
            Before Landing not found
          </h1>
          <p className="max-w-xl text-sm leading-6 text-text-muted">
            There is no country summary available for that route yet.
          </p>
        </section>
        <SectionShell id="landing-not-found" title="Back to brief">
          <Link
            to="/"
            className="inline-flex rounded-full bg-accent px-4 py-3 text-sm font-medium text-white"
          >
            Back to Home
          </Link>
        </SectionShell>
      </>
    );
  }

  const bestAirportOption = brief.airportToCity.options[0];
  const topArrivalEssentials = brief.arrivalEssentials.slice(0, 5);
  const entryReminder = takeFirstSentence(brief.entryRequirements.arrivalCardOrDeclaration);
  const paymentNote = `${brief.moneyAndPayments.cardAcceptance} ${brief.moneyAndPayments.cashNotes}`;
  const foodAndWaterNote = `Tap water: ${brief.foodAndPracticalities.tapWater} ${brief.foodAndPracticalities.commonFoodTips}`;
  const businessHeadline = brief.businessEtiquette.summary;

  return (
    <>
      <section className="rounded-[2rem] border border-border-soft bg-linear-to-br from-white via-white to-accent-soft/70 p-5 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              90-second mode
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-main">
              Before Landing
            </h1>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              {brief.countryName} quick view for the final stretch before touchdown.
            </p>
          </div>
          <span className="rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-accent shadow-sm">
            {brief.countryCode.toUpperCase()}
          </span>
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-border-soft bg-white/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            Main city and airport
          </p>
          <p className="mt-2 text-base font-semibold text-text-main">
            {brief.capitalOrMainCity} via {brief.primaryAirport}
          </p>
        </div>

        <Link
          to={`/country/${brief.countryCode}`}
          className="mt-4 inline-flex items-center rounded-full bg-accent px-4 py-3 text-sm font-medium text-white shadow-[0_14px_30px_rgba(63,124,129,0.22)] transition hover:brightness-105"
        >
          Back to Full Brief
        </Link>
      </section>

      <SectionShell id="before-you-land" title="Before you land" eyebrow="Top 5 arrival essentials">
        <ul className="space-y-3">
          {topArrivalEssentials.map((item) => (
            <li
              key={item}
              className="rounded-[1.25rem] border border-border-soft bg-surface-muted/35 px-4 py-4 text-base leading-6 text-text-main"
            >
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
              <h2 className="text-xl font-semibold text-text-main">{bestAirportOption.mode}</h2>
              <p className="mt-1 text-sm text-text-muted">{bestAirportOption.bestFor}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-2 text-xs font-medium text-accent">
                {bestAirportOption.typicalTime}
              </span>
              <span className="rounded-full bg-accent-soft px-3 py-2 text-xs font-medium text-accent">
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
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-accent">
            Immediate
          </span>
        }
      >
        <div className="rounded-[1.5rem] border border-accent/15 bg-linear-to-br from-accent to-[#2f686c] p-5 text-white shadow-[0_20px_50px_rgba(47,104,108,0.28)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            {brief.emergencyNumbers.label}
          </p>
          <p className="mt-3 text-5xl font-semibold tracking-tight">
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
