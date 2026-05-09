import { Link } from "react-router-dom";

import { Card } from "../components/card";
import { SectionHeading } from "../components/section-heading";

export function OfflinePage() {
  return (
    <>
      <SectionHeading
        title="Offline fallback"
        description="LandingBrief is still available offline for saved notes, recent countries, and briefs you opened earlier."
      />

      <Card title="What still works" eyebrow="Travel-ready">
        <ul className="space-y-3 text-sm leading-6 text-text-main">
          <li className="rounded-2xl bg-surface-muted/60 px-4 py-4">
            Previously opened country briefs can load from the offline cache.
          </li>
          <li className="rounded-2xl bg-surface-muted/60 px-4 py-4">
            Saved briefs, recent destinations, and your notes stay available on this device.
          </li>
          <li className="rounded-2xl bg-surface-muted/60 px-4 py-4">
            If a destination has never been opened online before, load it once with connectivity to keep it handy later.
          </li>
        </ul>
        <Link
          to="/saved"
          className="button-primary mt-5 inline-flex rounded-full px-4 py-3 text-sm font-medium"
        >
          Open saved items
        </Link>
      </Card>
    </>
  );
}
