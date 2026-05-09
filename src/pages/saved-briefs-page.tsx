import { Link } from "react-router-dom";

import { Card } from "../components/card";
import { SectionHeading } from "../components/section-heading";
import { useOfflineLibrary } from "../hooks/use-offline-library";

export function SavedBriefsPage() {
  const library = useOfflineLibrary();

  return (
    <>
      <SectionHeading
        title="Saved Briefs"
        description="Keep pinned destinations, recently viewed countries, and your travel notes available even when the connection drops."
      />

      <Card title="Saved for offline access" eyebrow="Pinned briefs">
        {library.savedCountries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-soft bg-surface-muted/50 px-4 py-4 text-sm text-text-muted">
            No saved briefs yet. Save a country from its brief page to keep it easy to reach while travelling.
          </div>
        ) : (
          <div className="space-y-3">
            {library.savedCountries.map((country) => (
              <Link
                key={country.countryCode}
                to={`/country/${country.countryCode}`}
                className="block rounded-[1.35rem] border border-border-soft bg-surface-muted/35 p-4 transition hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
                      {country.capitalOrMainCity}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-text-main">{country.countryName}</h2>
                    <p className="mt-2 text-sm leading-6 text-text-muted">
                      {country.primaryAirport}
                    </p>
                  </div>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                    Saved
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Card title="Recently viewed" eyebrow="Quick return">
        {library.recentCountries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-soft bg-surface-muted/50 px-4 py-4 text-sm text-text-muted">
            Open a country brief once and it will appear here for a quick offline return later.
          </div>
        ) : (
          <div className="space-y-3">
            {library.recentCountries.map((country) => (
              <Link
                key={`${country.countryCode}-${country.viewedAt}`}
                to={`/country/${country.countryCode}`}
                className="block rounded-[1.35rem] border border-border-soft bg-surface-muted/35 p-4"
              >
                <p className="text-sm font-semibold text-text-main">{country.countryName}</p>
                <p className="mt-1 text-sm text-text-muted">
                  {country.capitalOrMainCity} via {country.primaryAirport}
                </p>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Card title="Offline notes" eyebrow="Personal reminders">
        {Object.entries(library.notes).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-soft bg-surface-muted/50 px-4 py-4 text-sm text-text-muted">
            Your per-country notes will appear here once you add them from a brief page.
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(library.notes).map(([countryCode, note]) => (
              <Link
                key={countryCode}
                to={`/country/${countryCode}`}
                className="block rounded-[1.35rem] border border-border-soft bg-surface-muted/35 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-text-main">
                    {countryCode}
                  </p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-accent">
                    Note
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-text-muted">{note.value}</p>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
