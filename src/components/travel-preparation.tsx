import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { CountryBrief } from "../types";
import { readPreflight, setPreflight, type PreflightItem } from "../lib/preflight-storage";
import { subscribeToOfflineLibrary } from "../lib/browser-storage";
import { useAppStatus } from "../lib/app-status";
import { SectionShell } from "./section-shell";

export function PreflightChecklist({ brief }: { brief: CountryBrief }) {
  const [checked, setChecked] = useState(() => readPreflight(brief.countryCode));
  const [error, setError] = useState("");
  useEffect(() => { setChecked(readPreflight(brief.countryCode)); return subscribeToOfflineLibrary(() => setChecked(readPreflight(brief.countryCode))); }, [brief.countryCode]);
  const items: { id: PreflightItem; title: string; detail: string }[] = [
    { id: "documents", title: "Check my passport and visa", detail: `${brief.entryRequirements.passportValidity} ${brief.entryRequirements.visaSummary}` },
    { id: "entry", title: "Check entry forms and submission timing", detail: brief.entryRequirements.arrivalCardOrDeclaration },
    { id: "data", title: "Arrange connectivity", detail: `Choose roaming, an eSIM or a local SIM for ${brief.countryName}, and save the setup instructions.` },
    { id: "address", title: "Keep my accommodation details handy", detail: "Save the address and check-in instructions from your booking on your arrival card." }
  ];
  return <SectionShell id="before-you-fly" title="Before you fly" eyebrow={brief.countryName} variant="country">
    <p className="preflight-progress" role="status">{checked.length} of {items.length} ready · Progress saves on this device</p>
    <div className="preflight-list">{items.map(item => <label key={item.id} className={checked.includes(item.id) ? "is-complete" : ""}><input type="checkbox" checked={checked.includes(item.id)} onChange={event => {
      try { setPreflight(brief.countryCode, item.id, event.target.checked); setError(""); }
      catch { setError("Could not save your checklist. Check browser storage and try again."); }
    }} /><span><strong>{item.title}</strong><small>{item.detail}</small></span></label>)}</div>
    {error ? <p role="alert">{error}</p> : null}
    <div className="preflight-links"><Link to={`/country/${brief.countryCode}#arrive`}>Review entry guidance →</Link><Link to={`/country/${brief.countryCode}/arrival-card`}>Open my arrival card →</Link></div>
    <p className="preflight-note">Tick items when you have checked them for your trip. Entry guidance in this brief was reviewed {brief.lastReviewedDate}; confirm current requirements using the official links. Untick items to prepare for another trip.</p>
  </SectionShell>;
}

export function ArrivalMoney({ brief }: { brief: CountryBrief }) {
  return <div className="arrival-money">
    <div><h3>Can I use a card?</h3><p>{brief.moneyAndPayments.cardAcceptance || "Card acceptance is not recorded in this copy."}</p></div>
    <div><h3>Will I need cash on arrival?</h3><p>{brief.moneyAndPayments.cashNotes || "Check payment options for your arrival transport before travelling."}</p></div>
    <div><h3>What might my transfer cost?</h3><p className="preflight-note">{brief.airportToCity.airportName}</p><dl>{brief.airportToCity.options.map(option => <div key={option.mode}><dt>{option.mode}</dt><dd>{option.typicalCost}</dd></div>)}</dl>{!brief.airportToCity.options.length ? <p>No transfer estimates in this copy.</p> : null}<p className="preflight-note">Estimates from the brief, not live fares. Confirm the price and payment method before travelling.</p></div>
  </div>;
}

export function BriefFreshness({ brief, cachedAt, pinnedAt }: { brief: CountryBrief; cachedAt: string | null; pinnedAt?: string }) {
  const { isOnline: online } = useAppStatus();
  const timestamp = (value: string) => Number.isNaN(Date.parse(value)) ? "Date unavailable" : new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  return <details className="brief-freshness"><summary>{online ? "Device online" : "Device offline"} · {cachedAt ? "Brief copy stored on this device" : "Offline copy not confirmed"}</summary>
    <dl><div><dt>Entry & general brief reviewed</dt><dd>{brief.lastReviewedDate}</dd></div><div><dt>Airport exit guidance reviewed</dt><dd>{brief.arrivalGuide?.reviewedDate ?? "No separate review date"}</dd></div><div><dt>Money guidance reviewed</dt><dd>{brief.moneyAndPayments.roughCostContext?.reviewedDate ?? `${brief.lastReviewedDate} (general brief)`}</dd></div><div><dt>Copy stored on this device</dt><dd>{cachedAt ? timestamp(cachedAt) : "Date unavailable; reopen while connected to save a copy."}</dd></div>{pinnedAt ? <div><dt>Added to Saved briefs</dt><dd>{timestamp(pinnedAt)}</dd></div> : null}</dl>
    <p>Saving a copy does not mean its guidance was reviewed today. This is reference information, not live travel data.</p><p>Official links and other external websites need an internet connection. Stored brief text and your checklist can be read offline after the app has loaded.</p>
  </details>;
}
