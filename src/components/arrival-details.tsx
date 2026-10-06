import { useEffect, useState } from "react";
import type { ArrivalGuide, OfficialLink, QuickFacts } from "../types";
import { getDestinationTime } from "../lib/destination-time";
import { getSafeExternalUrl } from "../lib/safe-url";
import { SectionShell } from "./section-shell";

function Sources({ date, links }: { date: string; links: OfficialLink[] }) {
  return (
    <details className="arrival-sources">
      <summary>Sources · checked {date}</summary>
      <ul>
        {links.map((link) => {
          const url = getSafeExternalUrl(link.url);
          return url ? <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a></li> : null;
        })}
      </ul>
    </details>
  );
}

export function ArrivalDetails({ guide, compact = false }: { guide?: ArrivalGuide; compact?: boolean }) {
  if (!guide) {
    return <p className="text-sm leading-7 text-text-muted">Airport exit and late-arrival details are not in this saved copy. Reconnect and reopen the brief to check for an update.</p>;
  }

  return (
    <SectionShell id="airport-exit" title={guide.scope.startsWith("Macau") ? "Arrival exit instructions" : "Airport exit instructions"} eyebrow={guide.scope} variant="country">
      <ol className="arrival-instructions">
        {guide.steps.map((step, index) => <li key={step}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}
      </ol>
      <details className="arrival-late" open={!compact}>
        <summary>Arriving late? <span>Late arrival fallback</span></summary>
        <dl>
          <div><dt>Last connections</dt><dd>{guide.lateArrival.serviceWindow}</dd></div>
          <div><dt>Your fallback</dt><dd>{guide.lateArrival.fallback}</dd></div>
          <div><dt>Allow for extras</dt><dd>{guide.lateArrival.costNote}</dd></div>
        </dl>
        <p className="arrival-timing-note">All service times are local. Allow time for immigration and baggage; recheck departures for your travel date.</p>
      </details>
      <Sources date={guide.reviewedDate} links={guide.sources} />
    </SectionShell>
  );
}

function DestinationClock({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const clock = getDestinationTime(timeZone, now);
  return <>
    <p className="practical-clock"><time dateTime={now.toISOString()}>{clock.time}</time><span>{clock.date}</span></p>
    <p>{clock.difference}</p>
    <p className="practical-fact-note">Device zone: {clock.deviceTimeZone.replaceAll("_", " ")}. Uses your device clock.</p>
  </>;
}

export function PracticalFacts({ facts }: { facts?: QuickFacts }) {
  if (!facts) {
    return <SectionShell id="quick-facts" title="Quick practical facts" variant="country"><p className="text-sm leading-7 text-text-muted">Quick practical facts are not in this saved copy. Reconnect and reopen the brief to check for an update.</p></SectionShell>;
  }
  return (
    <SectionShell id="quick-facts" title="Quick practical facts" eyebrow="Time, power and what to pack" variant="country">
      <div className="practical-facts-grid">
        <div><h3>Local time now</h3><DestinationClock timeZone={facts.timeZone} /></div>
        <div><h3>Plugs & power</h3><p>{facts.plugs}</p><p className="practical-power">{facts.power}</p><p className="practical-fact-note">Check your charger’s input rating; a plug adaptor does not convert voltage.</p></div>
        <div><h3>Seasonal weather</h3><p>{facts.seasonalWeather}</p><p className="practical-fact-note">Seasonal guidance, not a live forecast.</p></div>
      </div>
      <Sources date={facts.reviewedDate} links={facts.sources} />
    </SectionShell>
  );
}
