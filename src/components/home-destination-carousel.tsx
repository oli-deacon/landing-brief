import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent, WheelEvent } from "react";
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

const MOBILE_STACK_SIZE = 4;
const MOBILE_SWIPE_THRESHOLD = 72;
const MOBILE_TAP_THRESHOLD = 10;

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

export function HomeDestinationCarousel({ countries }: HomeDestinationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileDragOffset, setMobileDragOffset] = useState(0);
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);
  const desktopItemRefs = useRef<(HTMLElement | null)[]>([]);
  const wheelLockRef = useRef<number | null>(null);
  const desktopDragStateRef = useRef<DragState | null>(null);
  const mobileDragStateRef = useRef<DragState | null>(null);
  const settleTimerRef = useRef<number | null>(null);
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
    setMobileDragOffset(0);
  }, [activeIndex]);

  useEffect(() => {
    function centerActiveCard(track: HTMLDivElement | null, activeItem: HTMLElement | null) {
      if (!track || !activeItem) {
        return;
      }

      const trackStyles = window.getComputedStyle(track);
      const paddingLeft = Number.parseFloat(trackStyles.paddingLeft) || 0;
      const paddingRight = Number.parseFloat(trackStyles.paddingRight) || 0;
      const visibleWidth = track.clientWidth - paddingLeft - paddingRight;
      const rawTarget =
        activeItem.offsetLeft - paddingLeft - (visibleWidth - activeItem.offsetWidth) / 2;
      const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
      const nextScrollLeft = Math.max(0, Math.min(rawTarget, maxScrollLeft));

      track.scrollTo({
        left: nextScrollLeft,
        behavior: "smooth"
      });
    }

    function syncActiveCardPosition() {
      centerActiveCard(desktopTrackRef.current, desktopItemRefs.current[activeIndex]);
    }

    const frameId = window.requestAnimationFrame(syncActiveCardPosition);

    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
    }

    settleTimerRef.current = window.setTimeout(() => {
      syncActiveCardPosition();
      settleTimerRef.current = null;
    }, 280);

    return () => {
      window.cancelAnimationFrame(frameId);

      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      if (wheelLockRef.current !== null) {
        window.clearTimeout(wheelLockRef.current);
      }

      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
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

    desktopDragStateRef.current = {
      startX: event.clientX,
      pointerId: event.pointerId
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const dragState = desktopDragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    desktopDragStateRef.current = null;
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
    desktopDragStateRef.current = null;
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

  function handleMobileCardKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(`/country/${currentCountry.countryCode}`);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      nudgeIndex(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      nudgeIndex(-1);
    }
  }

  function handleMobilePointerDown(event: PointerEvent<HTMLElement>) {
    if (!window.matchMedia("(max-width: 767px)").matches) {
      return;
    }

    mobileDragStateRef.current = {
      startX: event.clientX,
      pointerId: event.pointerId
    };
    setMobileDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleMobilePointerMove(event: PointerEvent<HTMLElement>) {
    const dragState = mobileDragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const resistance =
      (deltaX > 0 && activeIndex === 0) || (deltaX < 0 && activeIndex === countries.length - 1)
        ? 0.35
        : 1;
    setMobileDragOffset(deltaX * resistance);
  }

  function handleMobilePointerEnd(event: PointerEvent<HTMLElement>) {
    const dragState = mobileDragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    mobileDragStateRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setMobileDragOffset(0);

    if (Math.abs(deltaX) <= MOBILE_TAP_THRESHOLD) {
      navigate(`/country/${currentCountry.countryCode}`);
      return;
    }

    if (Math.abs(deltaX) < MOBILE_SWIPE_THRESHOLD) {
      return;
    }

    nudgeIndex(deltaX < 0 ? 1 : -1);
  }

  function handleMobilePointerCancel(event: PointerEvent<HTMLElement>) {
    if (mobileDragStateRef.current?.pointerId === event.pointerId) {
      mobileDragStateRef.current = null;
    }

    setMobileDragOffset(0);
  }

  if (countries.length === 0) {
    return null;
  }

  const currentCountry = countries[activeIndex];
  const visibleMobileCards = countries.slice(activeIndex, activeIndex + MOBILE_STACK_SIZE);

  return (
    <section className="arrival-carousel-shell space-y-3 sm:space-y-5">
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
        className="arrival-carousel-stage rounded-[2rem]"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          ref={desktopTrackRef}
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
                {artwork?.kind === "image" ? (
                  <img
                    src={artwork.src}
                    alt={artwork.alt}
                    className="arrival-carousel-item-media"
                  />
                ) : null}
                {artwork?.kind === "placeholder" ? (
                  <span className="arrival-carousel-item-media arrival-art-placeholder" aria-hidden="true">
                    <span className="arrival-art-placeholder-inner">
                      <span className="arrival-art-placeholder-label">{artwork.label}</span>
                      <span className="arrival-art-placeholder-title">{artwork.title}</span>
                    </span>
                  </span>
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
        {visibleMobileCards.map((country, stackIndex) => {
          const artwork = getCountryArtwork(country.countryCode);
          const isActive = stackIndex === 0;
          const cardClassName = isActive ? "arrival-mobile-card is-active" : "arrival-mobile-card";
          const dragOffset = isActive ? mobileDragOffset : 0;

          return (
            <article
              key={country.countryCode}
              className={cardClassName}
              data-stack-index={stackIndex}
              style={{
                "--mobile-card-offset": `${dragOffset}px`,
                "--mobile-card-stack-index": stackIndex
              } as CSSProperties}
              tabIndex={isActive ? 0 : -1}
              role={isActive ? "link" : undefined}
              aria-label={isActive ? `Open ${country.countryName} brief` : undefined}
              onKeyDown={
                isActive
                  ? (event) => {
                      handleMobileCardKeyDown(event);
                    }
                  : undefined
              }
              onPointerDown={
                isActive
                  ? (event) => {
                      handleMobilePointerDown(event);
                    }
                  : undefined
              }
              onPointerMove={
                isActive
                  ? (event) => {
                      handleMobilePointerMove(event);
                    }
                  : undefined
              }
              onPointerUp={
                isActive
                  ? (event) => {
                      handleMobilePointerEnd(event);
                    }
                  : undefined
              }
              onPointerCancel={
                isActive
                  ? (event) => {
                      handleMobilePointerCancel(event);
                    }
                  : undefined
              }
            >
              {artwork?.kind === "image" ? (
                <img
                  src={artwork.src}
                  alt={artwork.alt}
                  className="arrival-mobile-card-media"
                />
              ) : null}
              {artwork?.kind === "placeholder" ? (
                <span className="arrival-mobile-card-media arrival-art-placeholder" aria-hidden="true">
                  <span className="arrival-art-placeholder-inner">
                    <span className="arrival-art-placeholder-label">{artwork.label}</span>
                    <span className="arrival-art-placeholder-title">{artwork.title}</span>
                  </span>
                </span>
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
                <span className="arrival-mobile-card-cta">Open brief</span>
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
