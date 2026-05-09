import { Link, useParams } from "react-router-dom";

import { Card } from "../components/card";
import { SectionHeading } from "../components/section-heading";
import { getCountryByCode } from "../data/countries";

export function CountryBriefPage() {
  const { countryCode = "" } = useParams();
  const brief = getCountryByCode(countryCode);

  if (!brief) {
    return (
      <>
        <SectionHeading
          title="Country brief not found"
          description="This route is working, but there is no seeded country content for that code yet."
        />
        <Card>
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
        </Card>
      </>
    );
  }

  return (
    <>
      <SectionHeading
        title={brief.countryName}
        description={`${brief.capitalOrMainCity} briefing with structured static data for a calm first-arrival read.`}
      />

      <Card className="bg-linear-to-br from-white to-accent-soft/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Primary airport
            </p>
            <p className="mt-2 text-lg font-semibold text-text-main">{brief.primaryAirport}</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-accent">
            Reviewed {brief.lastReviewedDate}
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-text-muted">{brief.disclaimer}</p>
      </Card>

      <Card title="Entry Requirements">
        <div className="space-y-4 text-sm leading-6 text-text-muted">
          <div>
            <p className="font-medium text-text-main">Passport validity</p>
            <p>{brief.entryRequirements.passportValidity}</p>
          </div>
          <div>
            <p className="font-medium text-text-main">Visa summary</p>
            <p>{brief.entryRequirements.visaSummary}</p>
          </div>
          <div>
            <p className="font-medium text-text-main">Arrival card or declaration</p>
            <p>{brief.entryRequirements.arrivalCardOrDeclaration}</p>
          </div>
          <div>
            <p className="font-medium text-text-main">Official source note</p>
            <p>{brief.entryRequirements.officialSourceNote}</p>
          </div>
          <div>
            <p className="font-medium text-text-main">Important notes</p>
            <ul className="mt-2 space-y-2">
              {brief.entryRequirements.importantNotes.map((note) => (
                <li key={note} className="rounded-2xl bg-surface-muted/50 px-3 py-3">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card title="Airport to City">
        <div className="space-y-4">
          <p className="text-sm leading-6 text-text-muted">
            {brief.airportToCity.airportName}
          </p>
          <div className="space-y-3">
            {brief.airportToCity.options.map((option) => (
              <div
                key={option.mode}
                className="rounded-[1.25rem] border border-border-soft bg-surface-muted/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-text-main">{option.mode}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-accent">
                    {option.typicalCost}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-muted">Typical time: {option.typicalTime}</p>
                <p className="mt-2 text-sm text-text-muted">Best for: {option.bestFor}</p>
                <p className="mt-2 text-sm leading-6 text-text-muted">{option.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Handy Phrases">
        <div className="space-y-3">
          {brief.handyPhrases.map((phrase) => (
            <div
              key={`${phrase.english}-${phrase.local}`}
              className="rounded-[1.25rem] border border-border-soft bg-surface-muted/40 p-4"
            >
              <p className="text-sm font-semibold text-text-main">{phrase.english}</p>
              <p className="mt-1 text-sm text-text-main">{phrase.local}</p>
              <p className="mt-1 text-sm text-text-muted">
                Pronunciation: {phrase.pronunciation}
              </p>
              <p className="mt-2 text-sm leading-6 text-text-muted">{phrase.context}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Business Etiquette">
        <div className="space-y-4">
          <p className="text-sm leading-6 text-text-muted">{brief.businessEtiquette.summary}</p>
          <ul className="space-y-2 text-sm leading-6 text-text-muted">
            {brief.businessEtiquette.tips.map((tip) => (
              <li key={tip} className="rounded-2xl bg-surface-muted/50 px-3 py-3">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card title="Food and Practicalities">
        <div className="space-y-4 text-sm leading-6 text-text-muted">
          <p>
            <span className="font-medium text-text-main">Tap water:</span>{" "}
            {brief.foodAndPracticalities.tapWater}
          </p>
          <p>
            <span className="font-medium text-text-main">Tipping:</span>{" "}
            {brief.foodAndPracticalities.tipping}
          </p>
          <p>
            <span className="font-medium text-text-main">Dietary notes:</span>{" "}
            {brief.foodAndPracticalities.dietaryNotes}
          </p>
          <p>
            <span className="font-medium text-text-main">Common food tips:</span>{" "}
            {brief.foodAndPracticalities.commonFoodTips}
          </p>
          <div>
            <p className="font-medium text-text-main">Useful phrases</p>
            <ul className="mt-2 space-y-2">
              {brief.foodAndPracticalities.usefulPhrases.map((phrase) => (
                <li key={phrase} className="rounded-2xl bg-surface-muted/50 px-3 py-3">
                  {phrase}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card title="Money and Payments">
        <div className="space-y-4 text-sm leading-6 text-text-muted">
          <p>
            <span className="font-medium text-text-main">Currency:</span>{" "}
            {brief.moneyAndPayments.currency}
          </p>
          <p>
            <span className="font-medium text-text-main">Card acceptance:</span>{" "}
            {brief.moneyAndPayments.cardAcceptance}
          </p>
          <p>
            <span className="font-medium text-text-main">Cash notes:</span>{" "}
            {brief.moneyAndPayments.cashNotes}
          </p>
          <p>
            <span className="font-medium text-text-main">Tipping:</span>{" "}
            {brief.moneyAndPayments.tipping}
          </p>
          <div>
            <p className="font-medium text-text-main">Rough cost examples</p>
            <ul className="mt-2 space-y-2">
              {brief.moneyAndPayments.roughCostExamples.map((example) => (
                <li key={example} className="rounded-2xl bg-surface-muted/50 px-3 py-3">
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card title="Local Transport Apps">
        <div className="space-y-3">
          {brief.localTransportApps.map((app) => (
            <div
              key={app.name}
              className="rounded-[1.25rem] border border-border-soft bg-surface-muted/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-text-main">{app.name}</h3>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-accent">
                  App
                </span>
              </div>
              <p className="mt-2 text-sm text-text-muted">Use case: {app.useCase}</p>
              <p className="mt-2 text-sm leading-6 text-text-muted">{app.notes}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
