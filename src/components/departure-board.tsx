import { useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { getCountryArtwork } from "../lib/country-art";
import type { CountrySummary } from "../types";
import { SplitFlapText } from "./split-flap-text";

type IconName = "home" | "atlas" | "saved" | "settings" | "brief" | "explore" | "run" | "plane" | "arrow";

const iconPaths: Record<IconName, string> = {
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  atlas: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z",
  saved: "M6 3h12v18l-6-4-6 4Z",
  settings: "m9 3-.5 3-2 1-2.5-1L2 10l2.5 2v2L2 16l2 4 3-1 2 1 .5 2h5l.5-2 2-1 3 1 2-4-2.5-2v-2L22 10l-2-4-2.5 1-2-1L15 3ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  brief: "M8 3H5v18h14V3h-3M9 2h6v4H9ZM8 11h8M8 15h8",
  explore: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM16 8l-3 5-5 3 3-5Z",
  run: "M15 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0ZM8 10l3-3 4 2 2 4h4M14 9l-3 6 4 2v5M11 15l-4 5H3",
  plane: "m22 12-8-3-4-7H7l3 7-6 1-2-3H1l1 5-1 5h1l2-3 6 1-3 7h3l4-7Z",
  arrow: "M4 12h16m-6-6 6 6-6 6"
};

function BoardIcon({ name }: { name: IconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[name]} /></svg>;
}

const navItems = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/atlas", label: "Atlas", icon: "atlas" },
  { to: "/saved", label: "Saved", icon: "saved" },
  { to: "/settings", label: "Settings", icon: "settings" }
] as const;

export function DepartureNavigation() {
  return (
    <header className="departure-header">
      <Link to="/" className="departure-brand" aria-label="LandingBrief home">Landing<span>Brief</span></Link>
      <nav className="departure-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end className={({ isActive }) => isActive ? "is-active" : undefined}>
            <BoardIcon name={item.icon} /><span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <p className="departure-tagline">Portable country intelligence</p>
    </header>
  );
}

const airportCodes: Record<string, string> = { sg: "SIN", th: "BKK", my: "KUL", vn: "SGN", hk: "HKG", mo: "MFM", kr: "ICN", in: "DEL" };

export function DepartureBoard({ countries }: { countries: CountrySummary[] }) {
  const [selectedCode, setSelectedCode] = useState(countries[0]?.countryCode);
  const detailRef = useRef<HTMLElement>(null);
  const selected = countries.find((country) => country.countryCode === selectedCode) ?? countries[0];

  if (!selected) {
    return <p className="departure-notice">No destinations are available yet. Check back soon.</p>;
  }

  const artwork = getCountryArtwork(selected.countryCode);

  function selectCountry(countryCode: string) {
    setSelectedCode(countryCode);
    if (window.matchMedia("(max-width: 767px)").matches) {
      detailRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }

  return (
    <div className="departure-board">
      <section className="departure-destinations" aria-labelledby="destination-list-title">
        <div className="departure-list-heading"><h2 id="destination-list-title">Destinations</h2><span>{String(countries.length).padStart(2, "0")} briefs</span></div>
        <ol className="departure-list">
          {countries.map((country, index) => (
            <li key={country.countryCode}>
              <button type="button" className={selected.countryCode === country.countryCode ? "departure-row is-active" : "departure-row"} aria-pressed={selected.countryCode === country.countryCode} aria-controls="departure-detail" onClick={() => selectCountry(country.countryCode)}>
                <span className="departure-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="departure-code" aria-hidden="true">{country.countryCode.toUpperCase()}</span>
                <span className="departure-destination"><strong><SplitFlapText text={country.countryName} delay={index * 55} className="board-flaps-row" /></strong><span>{country.capitalOrMainCity}</span></span>
                <BoardIcon name="arrow" />
              </button>
            </li>
          ))}
        </ol>
        <p className="departure-list-note">A little local knowledge. A better arrival.</p>
      </section>

      <article id="departure-detail" ref={detailRef} className="departure-detail" aria-labelledby="selected-destination-title">
        <div className="departure-airport">
          <span className="departure-airport-code"><SplitFlapText text={airportCodes[selected.countryCode] ?? selected.countryCode.toUpperCase()} /></span>
          <BoardIcon name="plane" />
          <div><span>{selected.capitalOrMainCity}</span><p>{selected.primaryAirport}</p></div>
        </div>
        <div className="departure-art">
          {artwork?.kind === "image" ? <img key={artwork.src} src={artwork.src} alt={artwork.alt} /> : <span>{selected.countryName}</span>}
        </div>
        <div className="departure-detail-content">
          <div aria-live="polite" aria-atomic="true"><p className="departure-kicker">Your next chapter</p><h2 id="selected-destination-title"><SplitFlapText text={selected.countryName} className="board-flaps-title" /></h2></div>
          <p className="departure-description">Arrival essentials, transport, money, and first-hour notes.</p>
          <div className="departure-actions" aria-label={`${selected.countryName} travel modes`}>
            <Link className="departure-action departure-action-primary" to={`/country/${selected.countryCode}/landing`}><BoardIcon name="brief" /><span>Arrival brief</span><BoardIcon name="arrow" /></Link>
            <Link className="departure-action" to={`/country/${selected.countryCode}/explore`}><BoardIcon name="explore" /><span>Explore</span><BoardIcon name="arrow" /></Link>
            <Link className="departure-action" to={`/country/${selected.countryCode}/run`}><BoardIcon name="run" /><span>Run</span><BoardIcon name="arrow" /></Link>
          </div>
        </div>
      </article>
    </div>
  );
}
