import { Link } from "react-router-dom";

import { SectionHeading } from "../components/section-heading";
import { useOfflineLibrary } from "../hooks/use-offline-library";
import { getCountryArtwork } from "../lib/country-art";

export function SavedBriefsPage() {
  const library = useOfflineLibrary();

  return (
    <div className="utility-page">
      <SectionHeading title="Saved Briefs" description="Your offline library, recent places, and personal reminders." />

      <section className="utility-section">
        <div className="utility-section-heading"><p className="eyebrow">Pinned briefs</p><h2>Saved for offline access</h2></div>
        {library.savedCountries.length === 0 ? <p className="utility-empty">No saved briefs yet. Save a destination from its brief to keep it close while travelling.</p> : (
          <div className="utility-destination-list">
            {library.savedCountries.map((country) => <DestinationRow key={country.countryCode} country={country} detail={country.primaryAirport} />)}
          </div>
        )}
      </section>

      <section className="utility-section">
        <div className="utility-section-heading"><p className="eyebrow">Quick return</p><h2>Recently viewed</h2></div>
        {library.recentCountries.length === 0 ? <p className="utility-empty">Open a country brief once and it will appear here for a quick return.</p> : (
          <div className="utility-destination-list">
            {library.recentCountries.map((country) => <DestinationRow key={`${country.countryCode}-${country.viewedAt}`} country={country} detail={country.capitalOrMainCity} />)}
          </div>
        )}
      </section>

      <section className="utility-section">
        <div className="utility-section-heading"><p className="eyebrow">Personal reminders</p><h2>Offline notes</h2></div>
        {Object.entries(library.notes).length === 0 ? <p className="utility-empty">Your per-country notes will appear here once you add them from a brief page.</p> : (
          <div className="utility-note-list">
            {Object.entries(library.notes).map(([countryCode, note]) => (
              <Link key={countryCode} to={`/country/${countryCode}`} className="utility-note-row">
                <span>{countryCode.toUpperCase()}</span><p>{note.value}</p><span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function DestinationRow({ country, detail }: { country: { countryCode: string; countryName: string; capitalOrMainCity: string }; detail: string }) {
  const artwork = getCountryArtwork(country.countryCode);

  return (
    <article className="utility-destination-row">
      {artwork?.kind === "image" ? <img src={artwork.src} alt="" className="utility-destination-art" /> : <div className="utility-destination-art utility-destination-art-placeholder" aria-hidden="true" />}
      <div className="min-w-0"><p className="eyebrow">{country.capitalOrMainCity}</p><h3>{country.countryName}</h3><p>{detail}</p></div>
      <div className="utility-row-actions"><Link to={`/country/${country.countryCode}/landing`}>Brief</Link><Link to={`/country/${country.countryCode}/explore`}>Explore</Link></div>
    </article>
  );
}
