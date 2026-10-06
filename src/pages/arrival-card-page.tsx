import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrivalTicket } from "../components/arrival-ticket";
import { DriverAddress } from "../components/driver-address";
import { useCountryBrief } from "../hooks/use-country-data";
import { useOfflineLibrary } from "../hooks/use-offline-library";
import { clearArrivalCard, createArrivalCard, saveArrivalCard, type ArrivalCard } from "../lib/arrival-card-storage";
import type { CountryBrief } from "../types";

export function ArrivalCardPage() {
  const { countryCode = "" } = useParams();
  return <ArrivalCardDestination key={countryCode.toLowerCase()} code={countryCode.toLowerCase()} />;
}

function ArrivalCardDestination({ code }: { code: string }) {
  const library = useOfflineLibrary();
  const country = useCountryBrief(code);
  const card = library.arrivalCards[code];
  const [editing, setEditing] = useState(false);
  const [driverOpen, setDriverOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [torn, setTorn] = useState(false);
  const driverButton = useRef<HTMLButtonElement>(null);
  const hasCard = !!card;
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [editing, hasCard]);
  const closeDriver = () => {
    setDriverOpen(false); setTorn(false);
    requestAnimationFrame(() => driverButton.current?.focus({ preventScroll: true }));
  };
  const brief = country.status === "ready" ? country.data : undefined;
  const initial = card ?? (brief ? createArrivalCard(brief) : null);
  const hasAddress = !!(card?.address.trim() || card?.localAddress.trim());
  const showDriver = () => { if (hasAddress) { setTorn(true); setDriverOpen(true); } };

  return <div className="arrival-page">
    <Link className="arrival-back" to={`/country/${code}`}>← Back to full brief</Link>
    <div className="arrival-page-heading"><div><p className="country-kicker">Your first hour, personalised</p><h1>My arrival card</h1></div><Link to="/saved">All saved cards ↗</Link></div>
    {!initial ? <p className="arrival-empty">{country.status === "loading" ? "Loading destination…" : "No arrival card is saved for this destination. Open its brief while connected to create one."}</p> : (
      !card || editing ? <ArrivalCardEditor initial={initial} brief={brief} onSave={() => { setEditing(false); setFeedback("Arrival card saved on this device."); }} onCancel={card ? () => setEditing(false) : undefined} /> : <>
        <ArrivalTicket card={card} torn={torn} onShowDriver={showDriver} />
        <div className="arrival-actions">
          <button ref={driverButton} type="button" className="arrival-button" disabled={!hasAddress} onClick={showDriver}>Show driver</button>
          <button type="button" className="arrival-button arrival-button-secondary" onClick={() => { setEditing(true); setConfirmClear(false); }}>Edit arrival card</button>
          <span className="arrival-saved">Saved on this device · Available offline</span>
        </div>
        {!hasAddress ? <p className="arrival-empty">Add your accommodation address to use Show driver.</p> : null}
        <p role="status" className="arrival-feedback">{feedback}</p>
        <div className="arrival-plan-grid">
          <section className="arrival-plan-section"><p className="country-kicker">01 · Getting there</p><h2>{card.transport?.mode || "Choose your transfer"}</h2>
            {card.transport ? <><dl className="arrival-transfer-meta"><div><dt>Typical time</dt><dd>{card.transport.typicalTime}</dd></div><div><dt>Typical cost</dt><dd>{card.transport.typicalCost}</dd></div></dl><p>{card.transport.notes}</p></> : <p>Select a transport option in the brief or edit your card.</p>}
            <Link to={`/country/${code}#move`}>Compare transport options →</Link>
          </section>
          <section className="arrival-plan-section"><p className="country-kicker">02 · Where I’m staying</p><h2>{card.hotelName || "Accommodation"}</h2>
            {hasAddress ? <><p className="arrival-address-text" dir="auto">{card.address}</p>{card.localAddress ? <p className="arrival-address-text" dir="auto">{card.localAddress}</p> : null}
              <button className="arrival-text-button" type="button" onClick={async () => {
                try { await navigator.clipboard.writeText([card.hotelName, card.localAddress.trim() ? card.localAddress : card.address].filter(Boolean).join("\n")); setFeedback("Address copied"); }
                catch { setFeedback("Could not copy. Select the address text to copy it manually."); }
              }}>{feedback === "Address copied" ? "Address copied" : "Copy address"}</button></> : <p>Add an address from your booking or your host’s message.</p>}
          </section>
        </div>
        {card.reminder ? <section className="arrival-reminder"><p className="country-kicker">Keep in mind</p><p>{card.reminder}</p></section> : null}
        {card.phrases.length ? <section className="arrival-plan-section"><h2>Words to keep handy</h2><div className="arrival-saved-phrases">{card.phrases.map(phrase => <div key={phrase.english}><h3>{phrase.english}</h3><p className="arrival-local-phrase">{phrase.local}</p><p>{phrase.pronunciation}</p><button className="arrival-text-button" type="button" onClick={async () => {
          try { await navigator.clipboard.writeText(phrase.local); setFeedback(`Copied “${phrase.english}”.`); }
          catch { setFeedback("Could not copy. Select the phrase to copy it manually."); }
        }}>{feedback === `Copied “${phrase.english}”.` ? "Copied" : `Copy ${phrase.english}`}</button></div>)}</div></section> : null}
        {card.arrivalGuide ? <section className="arrival-plan-section"><h2>Getting out of arrivals</h2><p>{card.arrivalGuide.scope}</p><ol className="arrival-exit-list">{card.arrivalGuide.steps.map(step => <li key={step}>{step}</li>)}</ol>
          <details className="brief-inline-detail"><summary>Arriving late?</summary><p>{card.arrivalGuide.lateArrival.serviceWindow}</p><p>{card.arrivalGuide.lateArrival.fallback}</p><p>{card.arrivalGuide.lateArrival.costNote}</p></details>
          <p className="arrival-saved">Arrival guidance checked {card.arrivalGuide.reviewedDate}. All service times are local.</p>
        </section> : null}
        <footer className="arrival-card-footer"><span>Personal plan · Travel guidance from brief reviewed {card.reviewedDate}</span>
          {confirmClear ? <div className="arrival-clear-confirm"><p>Clear this arrival card? Your saved brief and offline notes will stay.</p><button type="button" onClick={() => {
            try { clearArrivalCard(code); setConfirmClear(false); setFeedback("Arrival card cleared"); }
            catch { setFeedback("Could not clear this card. Please try again."); }
          }}>Clear arrival card</button><button type="button" onClick={() => setConfirmClear(false)}>Keep card</button></div> : <button type="button" onClick={() => setConfirmClear(true)}>Clear after my trip</button>}
        </footer>
        {driverOpen ? <DriverAddress card={card} onClose={closeDriver} /> : null}
      </>
    )}
  </div>;
}

function ArrivalCardEditor({ initial, brief, onSave, onCancel }: { initial: ArrivalCard; brief?: CountryBrief; onSave: () => void; onCancel?: () => void }) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const options = brief?.airportToCity.options ?? (draft.transport ? [draft.transport] : []);
  const phrases = brief?.handyPhrases ?? draft.phrases;
  const setField = (field: "hotelName" | "address" | "localAddress" | "reminder", value: string) => setDraft(current => ({ ...current, [field]: value }));
  return <form className="arrival-editor" onSubmit={event => {
    event.preventDefault();
    try { saveArrivalCard(draft); onSave(); }
    catch { setError("Could not save your card. Your changes are still here; check that browser storage is available and try again."); }
  }}>
    <h2>{initial.destination} · Your arrival plan</h2><p>Keep your transfer, address and a few useful words together. Everything is optional; you can add more later.</p>
    <label>Getting to your accommodation<select value={draft.transport?.mode ?? ""} onChange={event => setDraft(current => ({ ...current, transport: options.find(option => option.mode === event.target.value) ?? null }))}>
      <option value="">Choose a transfer later</option>{options.map(option => <option key={option.mode} value={option.mode}>{option.mode}</option>)}
    </select></label>
    <label>Accommodation name<input value={draft.hotelName} onChange={event => setField("hotelName", event.target.value)} maxLength={160} autoComplete="off" placeholder="Hotel or accommodation name" /></label>
    <div className="arrival-editor-columns"><label>Address<textarea value={draft.address} onChange={event => setField("address", event.target.value)} maxLength={1500} rows={3} placeholder="Paste the address from your booking" /></label>
      <label>Local-language address <span>(optional)</span><textarea value={draft.localAddress} onChange={event => setField("localAddress", event.target.value)} maxLength={1500} rows={3} dir="auto" placeholder="Paste exactly as supplied by your host" /></label></div>
    <label>My reminder<textarea value={draft.reminder} onChange={event => setField("reminder", event.target.value)} maxLength={1000} rows={2} placeholder="Late check-in instructions, pickup meeting point…" /></label>
    {phrases.length ? <fieldset><legend>Useful phrases · {draft.phrases.length}/3 selected</legend><div className="arrival-phrase-choices">{phrases.map(phrase => {
      const selected = draft.phrases.some(p => p.english === phrase.english);
      return <label key={phrase.english}><input type="checkbox" checked={selected} disabled={!selected && draft.phrases.length >= 3} onChange={() => setDraft(current => ({ ...current, phrases: selected ? current.phrases.filter(p => p.english !== phrase.english) : [...current.phrases, phrase] }))} /><span>{phrase.english}<small>{phrase.local}</small></span></label>;
    })}</div></fieldset> : null}
    <p className="arrival-saved">Saved only on this device. Your address stays exactly as you enter it.</p>
    {error ? <p role="alert" className="arrival-error">{error}</p> : null}
    <div className="arrival-actions"><button className="arrival-button" type="submit">Save arrival card</button>{onCancel ? <button className="arrival-button arrival-button-secondary" type="button" onClick={onCancel}>Cancel</button> : null}</div>
  </form>;
}
