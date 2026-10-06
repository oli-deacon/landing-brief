import { useEffect, useRef, useState } from "react";
import type { ArrivalCard } from "../lib/arrival-card-storage";

export function DriverAddress({ card, onClose }: { card: ArrivalCard; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    const el = dialog.current;
    const previousOverflow = document.body.style.overflow;
    el?.showModal();
    document.body.style.overflow = "hidden";
    return () => { el?.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  const local = card.localAddress.trim() ? card.localAddress : card.address;
  return <dialog ref={dialog} className="driver-address" aria-labelledby="driver-title" onCancel={onClose}>
    <div className="driver-toolbar"><span>Destination address</span><button type="button" autoFocus onClick={onClose}>Close ✕</button></div>
    <h2 id="driver-title">{card.hotelName || card.destination}</h2>
    <p className="driver-address-primary" dir="auto">{local}</p>
    {card.localAddress.trim() && card.address.trim() ? <p className="driver-address-secondary" dir="auto">{card.address}</p> : null}
    <button type="button" className="arrival-button" onClick={async () => {
      try { await navigator.clipboard.writeText([card.hotelName, local].filter(Boolean).join("\n")); setFeedback("Address copied"); }
      catch { setFeedback("Could not copy. Select the address above to copy it."); }
    }}>Copy address</button>
    <p role="status">{feedback}</p>
  </dialog>;
}
