import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, WheelEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCountryArtwork } from "../lib/country-art";
import type { CountrySummary } from "../types";

type HomeDestinationCarouselProps = {
  countries: CountrySummary[];
};

type DragState = {
  startX: number;
  pointerId: number;
};

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

export function HomeDestinationCarousel({ countries }: HomeDestinationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const desktopItemRefs = useRef<(HTMLElement | null)[]>([]);
  const wheelLockRef = useRef<number | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    desktopItemRefs.current = desktopItemRefs.current.slice(0, countries.length);
  }, [countries.length]);

  useEffect(() => {
    setActiveIndex((currentIndex) => {
      if (countries.length === 0) {
        return 0;
      }

      return Math.min(currentIndex, countries.length - 1);
    });
  }, [countries.length]);

  useEffect(() => {
    const activeItem = desktopItemRefs.current[activeIndex];

    if (!activeItem) {
      return;
    }

    activeItem.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      if (wheelLockRef.current !== null) {
        window.clearTimeout(wheelLockRef.current);
      }
    };
  }, []);

  function clampIndex(nextIndex: number) {
    return Math.max(0, Math.min(countries.length - 1, nextIndex));
  }

  function nudgeIndex(direction: 1 | -1) {
    setActiveIndex((currentIndex) => clampIndex(currentIndex + direction));
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    if (window.matchMedia("(max-width: 767px)").matches) {
      return;
    }

    const dominantDelta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

    if (Math.abs(dominantDelta) < 18 || wheelLockRef.current !== null) {
      return;
    }

    event.preventDefault();
    nudgeIndex(dominantDelta > 0 ? 1 : -1);
    wheelLockRef.current = window.setTimeout(() => {
      wheelLockRef.current = null;
    }, 340);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(max-width: 767px)").matches) {
      return;
    }

    dragStateRef.current = {
      startX: event.clientX,
      pointerId: event.pointerId
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    dragStateRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (Math.abs(deltaX) < 12) {
      const target = document.elementFromPoint(event.clientX, event.clientY);

      if (target instanceof Element) {
        const card = target.closest<HTMLElement>("[data-country-route]");
        const route = card?.dataset.countryRoute;

        if (route) {
          navigate(route);
        }
      }

      return;
    }

    nudgeIndex(deltaX < 0 ? 1 : -1);
  }

  function handlePointerCancel() {
    dragStateRef.current = null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nudgeIndex(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      nudgeIndex(-1);
    }
  }

  if (countries.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div
        className="arrival-carousel-stage rounded-[2rem]"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className="arrival-carousel-stage-header">
          <div className="arrival-carousel-progress">
            <span className="arrival-carousel-progress-current">{formatIndex(activeIndex + 1)}</span>
            <span className="arrival-carousel-progress-divider">/</span>
            <span className="arrival-carousel-progress-total">{formatIndex(countries.length)}</span>
          </div>
          <div className="arrival-carousel-markers" aria-hidden="true">
            {countries.map((country, index) => (
              <span
                key={country.countryCode}
                className={index === activeIndex ? "arrival-carousel-marker is-active" : "arrival-carousel-marker"}
              />
            ))}
          </div>
        </div>

        <div
          className="arrival-carousel-track"
          tabIndex={0}
          role="region"
          aria-label="Choose your arrival brief"
          onKeyDown={handleKeyDown}
        >
          {countries.map((country, index) => {
            const artwork = getCountryArtwork(country.countryCode);
            const isActive = index === activeIndex;

            return (
              <article
                key={country.countryCode}
                ref={(node) => {
                  desktopItemRefs.current[index] = node;
                }}
                data-country-route={`/country/${country.countryCode}`}
                className={isActive ? "arrival-carousel-item is-active" : "arrival-carousel-item"}
                onClick={() => {
                  navigate(`/country/${country.countryCode}`);
                }}
              >
                {artwork ? (
                  <img
                    src={artwork.src}
                    alt={artwork.alt}
                    className="arrival-carousel-item-media"
                  />
                ) : null}
                <span className="arrival-carousel-item-overlay" aria-hidden="true" />
                <span className="arrival-carousel-item-content">
                  <span className="arrival-carousel-item-topline">
                    <span className="eyebrow text-[0.68rem] text-slate-300/85">{country.capitalOrMainCity}</span>
                    <span className="arrival-carousel-item-code">{country.countryCode.toUpperCase()}</span>
                  </span>
                  <span className="arrival-carousel-item-copy">
                    <span className="arrival-carousel-item-title">{country.countryName}</span>
                    <span className="arrival-carousel-item-description">
                      Via {country.primaryAirport}. Arrival essentials, transport, money, and first-hour notes.
                    </span>
                  </span>
                  <span className="arrival-carousel-item-cta">
                    {isActive ? (
                      <Link
                        to={`/country/${country.countryCode}`}
                        className="arrival-carousel-link"
                      >
                        Open brief
                      </Link>
                    ) : (
                      <span className="arrival-carousel-item-hint">Open brief</span>
                    )}
                  </span>
                </span>
              </article>
            );
          })}
        </div>
      </div>

      <div className="arrival-mobile-carousel" aria-label="Choose your arrival brief">
        {countries.map((country) => {
          const artwork = getCountryArtwork(country.countryCode);

          return (
            <Link
              key={country.countryCode}
              to={`/country/${country.countryCode}`}
              className="arrival-mobile-card"
            >
              {artwork ? (
                <img
                  src={artwork.src}
                  alt={artwork.alt}
                  className="arrival-mobile-card-media"
                />
              ) : null}
              <span className="arrival-mobile-card-overlay" aria-hidden="true" />
              <span className="arrival-mobile-card-content">
                <span className="arrival-mobile-card-topline">
                  <span className="eyebrow text-slate-300/85">{country.capitalOrMainCity}</span>
                  <span className="pill-chip rounded-full px-3 py-1 text-[0.68rem] font-medium">
                    {country.countryCode.toUpperCase()}
                  </span>
                </span>
                <span className="arrival-mobile-card-title">{country.countryName}</span>
                <span className="arrival-mobile-card-description">
                  Via {country.primaryAirport}. Arrival essentials, transport, money, and first-hour notes.
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
