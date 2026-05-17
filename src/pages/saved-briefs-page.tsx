import { Link } from "react-router-dom";

import { Card } from "../components/card";
import { SectionHeading } from "../components/section-heading";
import { useOfflineLibrary } from "../hooks/use-offline-library";
import { getCountryArtwork } from "../lib/country-art";

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
          <div className="rounded-2xl border border-dashed border-border-soft bg-surface-muted/60 px-4 py-4 text-sm text-text-muted">
            No saved briefs yet. Save a country from its brief page to keep it easy to reach while travelling.
          </div>
        ) : (
          <div className="space-y-3">
            {library.savedCountries.map((country) => {
              const artwork = getCountryArtwork(country.countryCode);

              return (
                <Link
                  key={country.countryCode}
                  to={`/country/${country.countryCode}`}
                  className="destination-card block rounded-[1.35rem] border border-border-soft bg-surface-muted/55 p-4 transition hover:-translate-y-0.5 hover:border-border-strong"
                >
                  {artwork?.kind === "image" ? (
                    <img src={artwork.src} alt={artwork.alt} className="destination-card-media" />
                  ) : null}
                  {artwork?.kind === "placeholder" ? (
                    <div className="destination-card-media destination-card-placeholder" aria-hidden="true">
                      <div className="arrival-art-placeholder-inner">
                        <span className="arrival-art-placeholder-label">{artwork.label}</span>
                        <span className="arrival-art-placeholder-title">{artwork.title}</span>
                      </div>
                    </div>
                  ) : null}
                  <div className="destination-card-content flex items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow">{country.capitalOrMainCity}</p>
                      <h2 className="mt-1 text-[1.55rem] text-text-main">{country.countryName}</h2>
                      <p className="mt-2 text-sm leading-6 text-text-muted">
                        {country.primaryAirport}
                      </p>
                    </div>
                    <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
                      Saved
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="Recently viewed" eyebrow="Quick return">
        {library.recentCountries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-soft bg-surface-muted/60 px-4 py-4 text-sm text-text-muted">
            Open a country brief once and it will appear here for a quick offline return later.
          </div>
        ) : (
          <div className="space-y-3">
            {library.recentCountries.map((country) => {
              const artwork = getCountryArtwork(country.countryCode);

              return (
                <Link
                  key={`${country.countryCode}-${country.viewedAt}`}
                  to={`/country/${country.countryCode}`}
                  className="destination-card block rounded-[1.35rem] border border-border-soft bg-surface-muted/55 p-4"
                >
                  {artwork?.kind === "image" ? (
                    <img src={artwork.src} alt={artwork.alt} className="destination-card-media" />
                  ) : null}
                  {artwork?.kind === "placeholder" ? (
                    <div className="destination-card-media destination-card-placeholder" aria-hidden="true">
                      <div className="arrival-art-placeholder-inner">
                        <span className="arrival-art-placeholder-label">{artwork.label}</span>
                        <span className="arrival-art-placeholder-title">{artwork.title}</span>
                      </div>
                    </div>
                  ) : null}
                  <div className="destination-card-content">
                    <p className="text-sm font-semibold text-text-main">{country.countryName}</p>
                    <p className="mt-1 text-sm text-text-muted">
                      {country.capitalOrMainCity} via {country.primaryAirport}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="Offline notes" eyebrow="Personal reminders">
        {Object.entries(library.notes).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-soft bg-surface-muted/60 px-4 py-4 text-sm text-text-muted">
            Your per-country notes will appear here once you add them from a brief page.
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(library.notes).map(([countryCode, note]) => (
              <Link
                key={countryCode}
                to={`/country/${countryCode}`}
                className="block rounded-[1.35rem] border border-border-soft bg-surface-muted/55 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-text-main">
                    {countryCode}
                  </p>
                  <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
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
