import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";

import { Card } from "../components/card";
import { getAtlasCountryArtwork } from "../lib/country-art";
import { atlasDetails, type AtlasLandmark } from "../lib/atlas-details";
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
  const [artworkReady, setArtworkReady] = useState(artwork?.kind !== "image");
  const details = atlasDetails[country.countryCode];
  const [discovery, setDiscovery] = useState<AtlasLandmark | null>(null);
  const [inspectIndex, setInspectIndex] = useState<number | null>(null);

  useEffect(() => {
    const photo = photoRef.current;
    if (!photo || inspectIndex === null) return;
    const observer = new ResizeObserver(() => inspectLandmark(inspectIndex));
    observer.observe(photo);
    return () => observer.disconnect();
  }, [inspectIndex]);

  function inspectLandmark(nextIndex: number) {
    const landmark = details?.landmarks[nextIndex];
    const photo = photoRef.current;
    if (!landmark || !photo) return;
    setInspectIndex(nextIndex);
    setDiscovery(landmark);
    const artworkHeight = photo.clientWidth * 1672 / 941;
    showLensAt(landmark.x * photo.clientWidth, landmark.y * artworkHeight - (artworkHeight - photo.clientHeight) / 2);
  }

  function closeDiscovery() {
    setInspectIndex(null);
    setDiscovery(null);
    setLensPoint(null);
  }

  function scene(onLoad?: () => void) {
    if (artwork?.kind !== "image") return null;
    return (
      <span className="atlas-scene">
        <img src={artwork.src} alt="" onLoad={onLoad} onError={onLoad} />
        {details?.lamps.map(([x, y], lampIndex) => (
          <span key={lampIndex} className="atlas-lamp-glow" aria-hidden="true" style={{
            left: `${x * 100}%`, top: `${y * 100}%`,
            "--lamp-delay": `${-index * 0.63 - lampIndex * 0.85}s`
          } as CSSProperties} />
        ))}
      </span>
    );
  }

  function handleCardPointerMove(event: ReactPointerEvent<HTMLElement>) {
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

  function resetCardTilt(event: ReactPointerEvent<HTMLElement>) {
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
    if (event.pointerType !== "mouse" || inspectIndex !== null) return;
    const rect = event.currentTarget.getBoundingClientRect();
    showLensAt(event.clientX - rect.left, event.clientY - rect.top);
    const x = (event.clientX - rect.left) / rect.width;
    const artworkHeight = rect.width * 1672 / 941;
    const y = (event.clientY - rect.top + (artworkHeight - rect.height) / 2) / artworkHeight;
    const nearest = details?.landmarks.reduce<AtlasLandmark | null>((best, landmark) => {
      const distance = Math.hypot(x - landmark.x, (y - landmark.y) * 1672 / 941);
      const bestDistance = best ? Math.hypot(x - best.x, (y - best.y) * 1672 / 941) : Infinity;
      return distance < 0.20 && distance < bestDistance ? landmark : best;
    }, null);
    setDiscovery(nearest ?? null);
  }

  function handleArtworkFocus() {
    if (inspectIndex !== null) return;
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
    <article
      className={`atlas-card${artworkReady ? " is-artwork-ready" : ""}`}
      style={{
        "--atlas-accent": accent,
        "--atlas-tilt": `${index % 2 === 0 ? -1 : 1.1}deg`,
        "--atlas-arrival-delay": `${180 + index * 110}ms`
      } as CSSProperties}
      onPointerMove={handleCardPointerMove}
      onPointerLeave={resetCardTilt}
      onPointerCancel={resetCardTilt}
      onKeyDown={(event) => { if (event.key === "Escape") closeDiscovery(); }}
    >
      <Link className="atlas-card-open" to={`/country/${country.countryCode}/landing`}
        aria-label={`Open ${country.countryName} arrival brief`}
        onFocus={handleArtworkFocus} onBlur={() => { if (inspectIndex === null) closeDiscovery(); }} viewTransition>
      <span className="atlas-card-pin" aria-hidden="true" />
      <span
        ref={photoRef}
        className="atlas-card-photo"
        onPointerEnter={handleArtworkPointerMove}
        onPointerMove={handleArtworkPointerMove}
        onPointerLeave={() => { if (inspectIndex === null) closeDiscovery(); }}
      >
        {artwork?.kind === "image" ? (
          scene(() => setArtworkReady(true))
        ) : null}
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
              <span className="atlas-magnifier-art" style={lensArtStyle}>{scene()}</span>
              <span className="atlas-magnifier-glass" />
            </span>
            <span className="atlas-magnifier-rim" />
            <span className="atlas-magnifier-handle" />
          </span>
        ) : null}
        {discovery ? <span className="atlas-discovery-label">{discovery.name}</span> : null}
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
      {details ? (
        <div className="atlas-discovery-controls">
          <button type="button" onClick={() => inspectLandmark(inspectIndex === null ? 0 : (inspectIndex + 1) % details.landmarks.length)}
            aria-label={`${inspectIndex === null ? "Discover landmarks in" : "Next landmark in"} ${country.countryName}`}>
            {inspectIndex === null ? "Discover landmarks" : `Next · ${inspectIndex + 1}/${details.landmarks.length}`} <span aria-hidden="true">↗</span>
          </button>
          {inspectIndex !== null ? <button type="button" onClick={closeDiscovery} aria-label={`Close ${country.countryName} discoveries`}>×</button> : null}
          <span className="sr-only" role="status">{inspectIndex !== null ? discovery?.name : ""}</span>
        </div>
      ) : null}
    </article>
  );
}

export function CountryAtlasPage() {
  const countryIndex = useCountryIndex();
  const [effectsPaused, setEffectsPaused] = useState(false);

  return (
    <div className={`atlas-page${effectsPaused ? " is-effects-paused" : ""}`}>
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
            <div className="atlas-board-actions">
              <p className="atlas-board-instruction">Find landmarks with the lens · watch the lamps glow</p>
              <button type="button" className="atlas-effects-toggle" aria-pressed={effectsPaused} onClick={() => setEffectsPaused(!effectsPaused)}>
                {effectsPaused ? "Resume scene effects" : "Pause scene effects"}
              </button>
            </div>
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
