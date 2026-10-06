import { useEffect, useRef, useState } from "react";
import type { ArrivalCard } from "../lib/arrival-card-storage";
import TearTicket from "./tear-ticket/TearTicket";

export function ArrivalTicket({ card, onShowDriver, torn }: { card: ArrivalCard; onShowDriver: () => void; torn: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(480);
  useEffect(() => {
    if (!host.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.min(900, Math.floor(entry.contentRect.width))));
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const vertical = width < 600;
  const hasAddress = !!(card.address.trim() || card.localAddress.trim());
  return <div className="arrival-ticket-host" ref={host}>
    <TearTicket width={Math.max(240, width)} height={vertical ? 330 : 260} stubSize={vertical ? 94 : 190}
      orientation={vertical ? "vertical" : "horizontal"} rotate={0} tilt={false} recenter={false}
      background="#f1e7cf" color="#27241d" stubBackground="#edb852" borderColor="#8d78544d"
      radius={18} holes={vertical ? 14 : 12} torn={torn} onTear={onShowDriver}
      disabled={!hasAddress} ariaLabel="Tear ticket to show driver address"
      stub={<div className="arrival-ticket-stub"><span className="arrival-ticket-arrow" aria-hidden="true">↗</span><strong>Show driver</strong><span>{hasAddress ? "Pull to open your address" : "Add an address to unlock"}</span></div>}>
      <div className="arrival-ticket-face">
        <div className="arrival-ticket-overline"><span>LandingBrief</span><span>My arrival</span></div>
        <div><p className="arrival-ticket-destination">{card.destination}</p><p className="arrival-ticket-airport">{card.airport}</p></div>
        <div className="arrival-ticket-route" aria-hidden="true"><span /> <i /> <span /></div>
        <div className="arrival-ticket-bottom"><div><span>Next stop</span><strong>{card.hotelName || "Add your accommodation"}</strong></div><span>{card.transport?.mode || "Choose your transfer"}</span></div>
      </div>
    </TearTicket>
  </div>;
}
