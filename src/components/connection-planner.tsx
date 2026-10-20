import { useEffect, useRef } from "react";
import { buildConnectionPlan, type Connection, type ConnectionPlan } from "../lib/connection-plan";

export function ConnectionPlanner({ value, countryCode, onChange }: { value: Connection; countryCode: string; onChange: (value: Connection) => void }) {
  const set = (key: keyof Connection, next: string) => onChange({ ...value, [key]: next });
  const terminals = countryCode === "sg" && value.airport === "Singapore Changi (SIN)" ? ["T1", "T2", "T3", "T4"] : [];
  return <div className="connection-planner">
    <label>Connection airport{countryCode === "sg" ? <select value={value.airport} onChange={e => onChange({ ...value, airport: e.target.value, arrivalTerminal: "", departureTerminal: "" })}><option>Singapore Changi (SIN)</option><option>Other airport / airport change</option></select> : <input value={value.airport} maxLength={160} onChange={e => set("airport", e.target.value)} />}</label>
    <div className="arrival-editor-columns">{([['arrivalTerminal', 'Arriving at'], ['departureTerminal', 'Departing from']] as const).map(([key, label]) => <label key={key}>{label}{terminals.length ? <select value={value[key]} onChange={e => set(key, e.target.value)}><option value="">Terminal not known yet</option>{terminals.map(t => <option key={t}>{t}</option>)}</select> : <input value={value[key]} maxLength={80} placeholder="Terminal, if known" onChange={e => set(key, e.target.value)} />}</label>)}</div>
    <div className="arrival-editor-columns">
      <label>Onward flight<input value={value.flight} maxLength={40} placeholder="Flight number (optional)" onChange={e => set("flight", e.target.value)} /></label>
      <label>Onward journey<select value={value.onward} onChange={e => set("onward", e.target.value)}><option value="unknown">Not sure yet</option><option value="international">International</option><option value="domestic">Domestic</option></select></label>
      <label>Flight booking<select value={value.booking} onChange={e => set("booking", e.target.value)}><option value="unknown">Not sure</option><option value="one">Both flights on one booking</option><option value="separate">Separate bookings</option></select></label>
      <label>Checked baggage<select value={value.bags} onChange={e => set("bags", e.target.value)}><option value="unknown">Not sure</option><option value="through">Checked through to final destination</option><option value="collect">Must collect and recheck</option><option value="none">Hand luggage only</option></select></label>
    </div>
    <label>Onward boarding pass<select value={value.boardingPass} onChange={e => set("boardingPass", e.target.value)}><option value="unknown">Not sure yet</option><option value="yes">I have it</option><option value="no">I still need it</option></select></label>
    <ConnectionRoute plan={buildConnectionPlan(value, countryCode)} />
  </div>;
}
export function ConnectionRoute({ plan }: { plan: ConnectionPlan }) {
  return <section className="connection-route"><p className="country-kicker">Your next steps</p><h2>{plan.title}</h2><ol className="arrival-exit-list">{plan.steps.map(step => <li key={step}>{step}</li>)}</ol><p>{plan.note}</p>{plan.sources.length > 0 && <p className="arrival-saved">Guidance checked {plan.reviewedDate} · {plan.sources.map((s, i) => <span key={s.url}>{i > 0 ? " · " : ""}<a href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a></span>)}</p>}</section>;
}
export function TransferView({ connection, plan, onClose }: { connection: Connection; plan: ConnectionPlan; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const el = dialog.current; const previous = document.body.style.overflow; el?.showModal(); document.body.style.overflow = "hidden"; return () => { el?.close(); document.body.style.overflow = previous; }; }, []);
  return <dialog ref={dialog} className="driver-address transfer-view" aria-labelledby="transfer-title" onCancel={onClose}><div className="driver-toolbar"><span>My connection</span><button type="button" autoFocus onClick={onClose}>Close ✕</button></div><h2 id="transfer-title">{connection.arrivalTerminal || "Arrival terminal?"} → {connection.departureTerminal || "Departure terminal?"}</h2><p>{connection.airport}{connection.flight ? ` · ${connection.flight}` : ""}</p><ConnectionRoute plan={plan} /></dialog>;
}
