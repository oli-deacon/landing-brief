import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

import { Card } from "../components/card";
import { getCountryArtwork } from "../lib/country-art";
import { useCountryIndex } from "../hooks/use-country-data";
import type { CountrySummary } from "../types";

const atlasAccents: Record<string, string> = {
  sg: "#e0ae57",
  th: "#ef9865",
  my: "#76b99b",
  vn: "#e68a59",
  hk: "#dc6d66",
  mo: "#bc9668",
  kr: "#9e8ad6",
  in: "#e4a253"
};

const atlasNotes: Record<string, { label: string; note: string; coordinates: string }> = {
  sg: { label: "island city", note: "green lines / clear movement", coordinates: "01.3521° N · 103.8198° E" },
  th: { label: "city in motion", note: "river light / late tables", coordinates: "13.7563° N · 100.5018° E" },
  my: { label: "layers of a city", note: "rain on tile / many voices", coordinates: "03.1390° N · 101.6869° E" },
  vn: { label: "street momentum", note: "coffee / scooters / shade", coordinates: "10.8231° N · 106.6297° E" },
  hk: { label: "harbour city", note: "vertical streets / salt air", coordinates: "22.3193° N · 114.1694° E" },
  mo: { label: "crossings", note: "old stones / bright rooms", coordinates: "22.1987° N · 113.5439° E" },
  kr: { label: "city at speed", note: "mountain edges / neon", coordinates: "37.5665° N · 126.9780° E" },
  in: { label: "capital rhythms", note: "monuments / markets / heat", coordinates: "28.6139° N · 77.2090° E" }
};

function getAtlasNote(country: CountrySummary) {
  return atlasNotes[country.countryCode] ?? {
    label: "destination notes",
    note: "first impressions / useful detail",
    coordinates: "field notes · landingbrief"
  };
}

export function CountryAtlasPage() {
  const countryIndex = useCountryIndex();

  return (
    <div className="atlas-page">
      <section className="atlas-intro">
        <div className="atlas-intro-copy">
          <p className="atlas-kicker">LandingBrief / visual index</p>
          <h1>Carry a little more of the map.</h1>
          <p>
            Eight destination briefs, pinned as a field notebook. Pick a card when you want the
            artwork and the place to arrive before the logistics do.
          </p>
        </div>
        <div className="atlas-stamp" aria-label="Eight destination briefs">
          <span>LB</span>
          <strong>{countryIndex.status === "ready" ? String(countryIndex.data.length).padStart(2, "0") : "08"}</strong>
          <small>field notes</small>
        </div>
      </section>

      {countryIndex.status === "loading" ? (
        <div className="atlas-loading-grid" aria-label="Loading destination atlas">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="atlas-loading-card animate-pulse" />
          ))}
        </div>
      ) : null}

      {countryIndex.status === "error" ? (
        <Card title="Atlas unavailable" eyebrow="Country data unavailable" className="atlas-error-card">
          <p className="text-sm leading-6 text-text-muted">
            Open LandingBrief while connected once to cache the destination index for offline use.
          </p>
          <Link to="/offline" className="button-primary mt-4 inline-flex rounded-full px-4 py-3 text-sm font-medium">
            View offline help
          </Link>
        </Card>
      ) : null}

      {countryIndex.status === "ready" ? (
        <section className="atlas-board" aria-labelledby="atlas-board-title">
          <div className="atlas-board-grid" aria-hidden="true" />
          <div className="atlas-board-topline">
            <div>
              <p className="atlas-board-kicker">The destination index</p>
              <h2 id="atlas-board-title">Choose by feeling.</h2>
            </div>
            <p className="atlas-board-instruction">Open a card for the full brief <span aria-hidden="true">↗</span></p>
          </div>

          <div className="atlas-card-grid">
            {countryIndex.data.map((country, index) => {
              const artwork = getCountryArtwork(country.countryCode);
              const note = getAtlasNote(country);
              const accent = atlasAccents[country.countryCode] ?? "#c29a5a";

              return (
                <Link
                  key={country.countryCode}
                  to={`/country/${country.countryCode}/landing`}
                  className="atlas-card"
                  style={{
                    "--atlas-accent": accent,
                    "--atlas-tilt": `${index % 2 === 0 ? -1 : 1.1}deg`
                  } as CSSProperties}
                  aria-label={`Open ${country.countryName} arrival brief`}
                  viewTransition
                >
                  <span className="atlas-card-pin" aria-hidden="true" />
                  <span className="atlas-card-photo">
                    {artwork?.kind === "image" ? <img src={artwork.src} alt="" /> : null}
                    {artwork?.kind === "placeholder" ? <span className="atlas-card-placeholder">{artwork.title}</span> : null}
                  </span>
                  <span className="atlas-card-content">
                    <span className="atlas-card-topline">
                      <span>{note.label}</span>
                      <span>{country.countryCode.toUpperCase()}</span>
                    </span>
                    <strong>{country.countryName}</strong>
                    <span className="atlas-card-city">{country.capitalOrMainCity}</span>
                    <span className="atlas-card-note">{note.note}</span>
                  </span>
                  <span className="atlas-card-meta">
                    <span>{note.coordinates}</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="atlas-board-footer">
            <span>Arrive / Move / Settle</span>
            <span>{countryIndex.data.length.toString().padStart(2, "0")} cards · one useful first hour</span>
          </div>
        </section>
      ) : null}
    </div>
  );
}
