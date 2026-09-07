import { Link } from "react-router-dom";

import { SectionHeading } from "../components/section-heading";

export function OfflinePage() {
  return (
    <div className="utility-page">
      <SectionHeading title="Offline fallback" description="The essentials stay with you when the connection drops." />
      <section className="utility-section utility-offline-section">
        <div className="utility-section-heading"><p className="eyebrow">Travel-ready</p><h2>What still works</h2></div>
        <ul className="utility-check-list">
          <li>Previously opened country briefs load from the offline cache.</li>
          <li>Saved briefs, recent destinations, and notes stay on this device.</li>
          <li>Open a destination online once to keep it ready for later.</li>
        </ul>
        <Link to="/saved" className="button-primary mt-7 inline-flex rounded-full px-4 py-3 text-sm font-medium">Open saved items</Link>
      </section>
    </div>
  );
}
