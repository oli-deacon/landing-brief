import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";

import { Card } from "../components/card";
import { getAtlasCountryArtwork } from "../lib/country-art";
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

type LensPoint = {
  x: number;
  y: number;
  width: number;
  height: number;
  size: number;
};

const MAGNIFIER_SCALE = 2.35;
const MAGNIFIER_SIZE_SCALE = 1.1;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type AtlasArtworkCardProps = {
  country: CountrySummary;
  index: number;
};

function AtlasArtworkCard({ country, index }: AtlasArtworkCardProps) {
  const artwork = getAtlasCountryArtwork(country.countryCode);
  const note = getAtlasNote(country);
  const accent = atlasAccents[country.countryCode] ?? "#c29a5a";
  const photoRef = useRef<HTMLSpanElement | null>(null);
  const [lensPoint, setLensPoint] = useState<LensPoint | null>(null);

  function handleCardPointerMove(event: ReactPointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1) * 2 - 1;
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1) * 2 - 1;

    card.style.setProperty("--atlas-pointer-x", `${x * 1.8}deg`);
    card.style.setProperty("--atlas-pointer-y", `${-y * 1.8}deg`);
    card.style.setProperty("--atlas-shadow-x", `${-x * 5}px`);
  }

  function resetCardTilt(event: ReactPointerEvent<HTMLAnchorElement>) {
    for (const property of ["--atlas-pointer-x", "--atlas-pointer-y", "--atlas-shadow-x"]) {
      event.currentTarget.style.removeProperty(property);
    }
  }

  function getLensSize(width: number) {
    return Math.min(118, Math.max(82, width * 0.46)) * MAGNIFIER_SIZE_SCALE;
  }

  function showLensAt(x: number, y: number) {
    const photo = photoRef.current;

    if (!photo || artwork?.kind !== "image") {
      return;
    }

    const rect = photo.getBoundingClientRect();
    const size = getLensSize(rect.width);
    const radius = size / 2;

    setLensPoint({
      x: clamp(x, radius, rect.width - radius),
      y: clamp(y, radius, rect.height - radius),
      width: rect.width,
      height: rect.height,
      size
    });
  }

  function handleArtworkPointerMove(event: ReactPointerEvent<HTMLSpanElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    showLensAt(event.clientX - rect.left, event.clientY - rect.top);
  }

  function handleArtworkFocus() {
    const photo = photoRef.current;

    if (!photo) {
      return;
    }

    showLensAt(photo.clientWidth / 2, photo.clientHeight / 2);
  }

  const lensArtStyle = lensPoint
    ? {
        width: `${lensPoint.width * MAGNIFIER_SCALE}px`,
        height: `${lensPoint.height * MAGNIFIER_SCALE}px`,
        left: `${lensPoint.size / 2 - lensPoint.x * MAGNIFIER_SCALE}px`,
        top: `${lensPoint.size / 2 - lensPoint.y * MAGNIFIER_SCALE}px`
      }
    : undefined;

  return (
    <Link
      to={`/country/${country.countryCode}/landing`}
      className="atlas-card"
      style={{
        "--atlas-accent": accent,
        "--atlas-tilt": `${index % 2 === 0 ? -1 : 1.1}deg`,
        "--atlas-arrival-delay": `${index * 55}ms`
      } as CSSProperties}
      aria-label={`Open ${country.countryName} arrival brief`}
      onFocus={handleArtworkFocus}
      onBlur={() => setLensPoint(null)}
      onPointerMove={handleCardPointerMove}
      onPointerLeave={resetCardTilt}
      onPointerCancel={resetCardTilt}
      viewTransition
    >
      <span className="atlas-card-pin" aria-hidden="true" />
      <span
        ref={photoRef}
        className="atlas-card-photo"
        onPointerEnter={handleArtworkPointerMove}
        onPointerMove={handleArtworkPointerMove}
        onPointerLeave={() => setLensPoint(null)}
      >
        {artwork?.kind === "image" ? <img src={artwork.src} alt="" /> : null}
        {artwork?.kind === "placeholder" ? <span className="atlas-card-placeholder">{artwork.title}</span> : null}
        {lensPoint && artwork?.kind === "image" ? (
          <span
            className="atlas-magnifier"
            style={{
              "--atlas-lens-x": `${lensPoint.x}px`,
              "--atlas-lens-y": `${lensPoint.y}px`,
              "--atlas-lens-size": `${lensPoint.size}px`
            } as CSSProperties}
            aria-hidden="true"
          >
            <span className="atlas-magnifier-window">
              <img src={artwork.src} alt="" className="atlas-magnifier-art" style={lensArtStyle} />
              <span className="atlas-magnifier-glass" />
            </span>
            <span className="atlas-magnifier-rim" />
            <span className="atlas-magnifier-handle" />
          </span>
        ) : null}
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
            <p className="atlas-board-instruction">Move the lens across the linework · open for the full brief <span aria-hidden="true">↗</span></p>
          </div>

          <div className="atlas-card-grid">
            {countryIndex.data.map((country, index) => (
              <AtlasArtworkCard key={country.countryCode} country={country} index={index} />
            ))}
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
