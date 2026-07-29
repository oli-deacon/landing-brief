import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { Link } from "react-router-dom";

import { getCountryArtwork } from "../lib/country-art";
import type { CountrySummary } from "../types";

type HomeDestinationCarouselProps = {
  countries: CountrySummary[];
};

type DragState = {
  startX: number;
  pointerId: number;
  startScrollLeft: number;
  hasDragged: boolean;
};

type MobileDragState = {
  startX: number;
  pointerId: number;
};

const MOBILE_SWIPE_THRESHOLD = 72;
const MOBILE_TAP_THRESHOLD = 10;
const DESKTOP_DRAG_THRESHOLD = 6;

const countryAccents: Record<string, string> = {
  sg: "#d9b66f",
  th: "#e59662",
  my: "#78baa5",
  vn: "#df8d61",
  hk: "#d46b67",
  mo: "#ba9768",
  kr: "#a28bd1",
  in: "#d79754"
};

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

function isRouteTarget(target: EventTarget | null) {
  return target instanceof Element && target.closest("a") !== null;
}

function getBookHeight(index: number) {
  return `${27.1 + ((index * 7) % 5) * 0.38}rem`;
}

export function HomeDestinationCarousel({ countries }: HomeDestinationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(() =>
    window.matchMedia("(max-width: 767px)").matches ? 0 : null
  );
  const [desktopDragActive, setDesktopDragActive] = useState(false);
  const [mobileDragOffset, setMobileDragOffset] = useState(0);
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);
  const desktopItemRefs = useRef<(HTMLElement | null)[]>([]);
  const desktopButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileSpineRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const desktopDragStateRef = useRef<DragState | null>(null);
  const desktopSuppressClickRef = useRef(false);
  const mobileDragStateRef = useRef<MobileDragState | null>(null);

  useEffect(() => {
    desktopItemRefs.current = desktopItemRefs.current.slice(0, countries.length);
    desktopButtonRefs.current = desktopButtonRefs.current.slice(0, countries.length);
    mobileSpineRefs.current = mobileSpineRefs.current.slice(0, countries.length);
  }, [countries.length]);

  useEffect(() => {
    setActiveIndex((currentIndex) => {
      if (countries.length === 0) {
        return null;
      }

      if (currentIndex === null) {
        return null;
      }

      return Math.min(currentIndex, countries.length - 1);
    });
  }, [countries.length]);

  useEffect(() => {
    setMobileDragOffset(0);

    if (!window.matchMedia("(max-width: 767px)").matches) {
      return;
    }

    if (activeIndex === null) {
      return;
    }

    mobileSpineRefs.current[activeIndex]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
  }, [activeIndex]);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches || activeIndex === null) {
      return;
    }

    const track = desktopTrackRef.current;
    const activeItem = desktopItemRefs.current[activeIndex];

    if (!track || !activeItem || typeof ResizeObserver === "undefined") {
      return;
    }

    let frameId = 0;
    const centerAfterResize = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        centerDesktopItem(activeIndex, "auto");
      });
    };
    const resizeObserver = new ResizeObserver(centerAfterResize);

    resizeObserver.observe(track);
    resizeObserver.observe(activeItem);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [activeIndex]);

  function clampIndex(nextIndex: number) {
    return Math.max(0, Math.min(countries.length - 1, nextIndex));
  }

  function selectIndex(index: number, behavior: ScrollBehavior = "smooth", moveFocus = false) {
    const nextIndex = clampIndex(index);
    setActiveIndex(nextIndex);
    centerDesktopItem(nextIndex, behavior);

    if (moveFocus) {
      window.requestAnimationFrame(() => {
        const target = window.matchMedia("(max-width: 767px)").matches
          ? mobileSpineRefs.current[nextIndex]
          : desktopButtonRefs.current[nextIndex];

        target?.focus({ preventScroll: true });
      });
    }
  }

  function nudgeIndex(direction: 1 | -1, moveFocus = false) {
    const currentIndex = activeIndex ?? (direction === 1 ? -1 : 1);
    selectIndex(currentIndex + direction, "smooth", moveFocus);
  }

  function centerDesktopItem(index: number, behavior: ScrollBehavior) {
    const track = desktopTrackRef.current;
    const item = desktopItemRefs.current[index];

    if (!track || !item) {
      return;
    }

    const target = item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2;
    const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);

    track.scrollTo({
      left: Math.max(0, Math.min(target, maxScrollLeft)),
      behavior
    });
  }

  function getClosestDesktopItem(track: HTMLDivElement) {
    const trackRect = track.getBoundingClientRect();
    const trackCenterX = trackRect.left + trackRect.width / 2;
    let closestIndex = activeIndex ?? 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    desktopItemRefs.current.forEach((item, index) => {
      if (!item) {
        return;
      }

      const itemRect = item.getBoundingClientRect();
      const distance = Math.abs(itemRect.left + itemRect.width / 2 - trackCenterX);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function handleDesktopPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(max-width: 767px)").matches || isRouteTarget(event.target)) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    desktopDragStateRef.current = {
      startX: event.clientX,
      pointerId: event.pointerId,
      startScrollLeft: event.currentTarget.scrollLeft,
      hasDragged: false
    };
  }

  function handleDesktopPointerMove(event: PointerEvent<HTMLDivElement>) {
    const dragState = desktopDragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;

    if (!dragState.hasDragged && Math.abs(deltaX) >= DESKTOP_DRAG_THRESHOLD) {
      dragState.hasDragged = true;
      desktopSuppressClickRef.current = true;
      setDesktopDragActive(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    if (dragState.hasDragged) {
      event.currentTarget.scrollLeft = dragState.startScrollLeft - deltaX;
    }
  }

  function handleDesktopPointerUp(event: PointerEvent<HTMLDivElement>) {
    const dragState = desktopDragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    desktopDragStateRef.current = null;
    setDesktopDragActive(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (dragState.hasDragged) {
      const targetIndex = getClosestDesktopItem(event.currentTarget);
      selectIndex(targetIndex);
      window.setTimeout(() => {
        desktopSuppressClickRef.current = false;
      }, 0);
    }
  }

  function handleDesktopPointerCancel(event: PointerEvent<HTMLDivElement>) {
    if (desktopDragStateRef.current?.pointerId !== event.pointerId) {
      return;
    }

    desktopDragStateRef.current = null;
    setDesktopDragActive(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleShelfKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nudgeIndex(1, true);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      nudgeIndex(-1, true);
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectIndex(0, "smooth", true);
    }

    if (event.key === "End") {
      event.preventDefault();
      selectIndex(countries.length - 1, "smooth", true);
    }
  }

  function handleBookClick(index: number) {
    if (desktopSuppressClickRef.current) {
      desktopSuppressClickRef.current = false;
      return;
    }

    selectIndex(index);
  }

  function handleMobilePointerDown(event: PointerEvent<HTMLElement>) {
    if (!window.matchMedia("(max-width: 767px)").matches || isRouteTarget(event.target)) {
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
    const currentIndex = activeIndex ?? 0;
    const resistance =
      (deltaX > 0 && currentIndex === 0) || (deltaX < 0 && currentIndex === countries.length - 1)
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

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setMobileDragOffset(0);

    if (Math.abs(deltaX) > MOBILE_TAP_THRESHOLD && Math.abs(deltaX) >= MOBILE_SWIPE_THRESHOLD) {
      nudgeIndex(deltaX < 0 ? 1 : -1);
    }
  }

  function handleMobilePointerCancel(event: PointerEvent<HTMLElement>) {
    if (mobileDragStateRef.current?.pointerId !== event.pointerId) {
      return;
    }

    mobileDragStateRef.current = null;
    setMobileDragOffset(0);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  if (countries.length === 0) {
    return null;
  }

  const displayIndex = activeIndex ?? 0;
  const currentCountry = countries[displayIndex];
  const currentArtwork = getCountryArtwork(currentCountry.countryCode);
  const hasSelection = activeIndex !== null;

  return (
    <section className={hasSelection ? "arrival-carousel-shell space-y-3 sm:space-y-5" : "arrival-carousel-shell is-awaiting-selection space-y-3 sm:space-y-5"}>
      <div className="arrival-carousel-stage-header" aria-live="polite" aria-atomic="true">
        <div
          className="arrival-carousel-progress"
          aria-label={hasSelection ? `Destination ${displayIndex + 1} of ${countries.length}` : `${countries.length} destinations on the shelf`}
        >
          <span className="arrival-carousel-progress-current">{hasSelection ? formatIndex(displayIndex + 1) : "00"}</span>
          <span className="arrival-carousel-progress-divider">/</span>
          <span className="arrival-carousel-progress-total">{formatIndex(countries.length)}</span>
        </div>
        <div className="arrival-carousel-active-country">
          <span className="arrival-carousel-active-country-name">{hasSelection ? currentCountry.countryName : "Choose a volume"}</span>
          <span className="arrival-carousel-active-country-detail">
            {hasSelection ? `${currentCountry.capitalOrMainCity} · ${currentCountry.primaryAirport}` : `${countries.length} destination briefs on the shelf`}
          </span>
        </div>
        <span className="arrival-carousel-instruction">Drag, choose a volume, or use arrow keys</span>
      </div>

      <div className="arrival-carousel-stage">
        <div
          ref={desktopTrackRef}
          className={desktopDragActive ? "arrival-carousel-track is-dragging" : "arrival-carousel-track"}
          role="group"
          aria-label="Choose a destination from the shelf"
          onKeyDown={handleShelfKeyDown}
          onPointerDown={handleDesktopPointerDown}
          onPointerMove={handleDesktopPointerMove}
          onPointerUp={handleDesktopPointerUp}
          onPointerCancel={handleDesktopPointerCancel}
        >
          <div className="arrival-shelf-back" aria-hidden="true" />
          {countries.map((country, index) => {
            const artwork = getCountryArtwork(country.countryCode);
            const isActive = index === activeIndex;

            return (
              <article
                key={country.countryCode}
                ref={(node) => {
                  desktopItemRefs.current[index] = node;
                }}
                className={isActive ? "arrival-book-slot is-active" : "arrival-book-slot"}
                style={{
                  "--arrival-accent": countryAccents[country.countryCode] ?? "#9dc2d7",
                  "--book-height": getBookHeight(index),
                  "--book-lean": `${((index * 5) % 3) - 1}deg`
                } as CSSProperties}
              >
                <button
                  ref={(node) => {
                    desktopButtonRefs.current[index] = node;
                  }}
                  type="button"
                  className="arrival-book-select"
                  tabIndex={isActive || (!hasSelection && index === 0) ? 0 : -1}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? "Selected" : "Select"} ${country.countryName} arrival brief`}
                  onClick={() => handleBookClick(index)}
                >
                  <span className="arrival-book-shelf-spine" aria-hidden="true">
                    <span className="arrival-book-shelf-spine-code">{country.countryCode.toUpperCase()}</span>
                    <span className="arrival-book-shelf-spine-title">{country.countryName}</span>
                    <span className="arrival-book-shelf-spine-mark" />
                  </span>
                  <span className="arrival-book" aria-hidden="true">
                    <span className="arrival-book-pages" />
                    <span className="arrival-book-cover">
                      {artwork?.kind === "image" ? <img src={artwork.src} alt="" className="arrival-book-art" /> : null}
                      {artwork?.kind === "placeholder" ? (
                        <span className="arrival-book-art arrival-art-placeholder">
                          <span className="arrival-art-placeholder-inner">
                            <span className="arrival-art-placeholder-label">{artwork.label}</span>
                            <span className="arrival-art-placeholder-title">{artwork.title}</span>
                          </span>
                        </span>
                      ) : null}
                      <span className="arrival-book-cover-wash" />
                      <span className="arrival-book-cover-copy">
                        <span className="arrival-book-cover-topline">
                          <span>{country.capitalOrMainCity}</span>
                          <span>{country.countryCode.toUpperCase()}</span>
                        </span>
                        <span className="arrival-book-cover-title">{country.countryName}</span>
                        <span className="arrival-book-cover-description">
                          Arrival essentials, transport, money, and first-hour notes via {country.primaryAirport}.
                        </span>
                      </span>
                    </span>
                    <span className="arrival-book-spine">
                      <span className="arrival-book-spine-code">{country.countryCode.toUpperCase()}</span>
                      <span className="arrival-book-spine-title">{country.countryName}</span>
                      <span className="arrival-book-spine-mark" />
                    </span>
                  </span>
                </button>
                <Link
                  to={`/country/${country.countryCode}`}
                  className="arrival-book-link"
                  tabIndex={isActive ? 0 : -1}
                  aria-hidden={!isActive}
                >
                  Open arrival brief <span aria-hidden="true">↗</span>
                </Link>
              </article>
            );
          })}
          <div className="arrival-shelf-board" aria-hidden="true" />
        </div>
      </div>

      <div className="arrival-mobile-bookshelf">
        <div
          className="arrival-mobile-spine-rail"
          role="toolbar"
          aria-label="Choose a destination"
          onKeyDown={handleShelfKeyDown}
        >
          {countries.map((country, index) => {
            const isActive = index === displayIndex;

            return (
              <button
                key={country.countryCode}
                ref={(node) => {
                  mobileSpineRefs.current[index] = node;
                }}
                type="button"
                className={isActive ? "arrival-mobile-spine is-active" : "arrival-mobile-spine"}
                style={{ "--arrival-accent": countryAccents[country.countryCode] ?? "#9dc2d7" } as CSSProperties}
                aria-pressed={isActive}
                aria-label={`Select ${country.countryName}`}
                onClick={() => selectIndex(index)}
              >
                <span>{country.countryCode.toUpperCase()}</span>
                <strong>{country.countryName}</strong>
              </button>
            );
          })}
        </div>

        <article
          key={currentCountry.countryCode}
          className="arrival-mobile-book-stage"
          style={{
            "--arrival-accent": countryAccents[currentCountry.countryCode] ?? "#9dc2d7",
            "--mobile-book-offset": `${mobileDragOffset}px`
          } as CSSProperties}
          aria-label={`${currentCountry.countryName} arrival brief. Swipe left or right to browse destinations.`}
          onPointerDown={handleMobilePointerDown}
          onPointerMove={handleMobilePointerMove}
          onPointerUp={handleMobilePointerEnd}
          onPointerCancel={handleMobilePointerCancel}
        >
          <div className="arrival-mobile-book-pages" aria-hidden="true" />
          {currentArtwork?.kind === "image" ? (
            <img src={currentArtwork.src} alt={currentArtwork.alt} className="arrival-mobile-book-art" />
          ) : null}
          {currentArtwork?.kind === "placeholder" ? (
            <span className="arrival-mobile-book-art arrival-art-placeholder" aria-hidden="true">
              <span className="arrival-art-placeholder-inner">
                <span className="arrival-art-placeholder-label">{currentArtwork.label}</span>
                <span className="arrival-art-placeholder-title">{currentArtwork.title}</span>
              </span>
            </span>
          ) : null}
          <span className="arrival-mobile-book-wash" aria-hidden="true" />
          <div className="arrival-mobile-book-copy">
            <div className="arrival-mobile-book-topline">
              <span className="eyebrow">{currentCountry.capitalOrMainCity}</span>
              <span className="arrival-mobile-book-index">
                {formatIndex(displayIndex + 1)} / {formatIndex(countries.length)}
              </span>
            </div>
            <h2>{currentCountry.countryName}</h2>
            <p>Arrival essentials, transport, money, and first-hour notes via {currentCountry.primaryAirport}.</p>
            <Link to={`/country/${currentCountry.countryCode}`} className="arrival-mobile-book-link">
              Open arrival brief <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>
        <p className="arrival-mobile-carousel-instruction">Swipe the cover or choose a spine</p>
      </div>

      <div className="destination-mode-choice destination-mode-choice-selected" aria-label={`${currentCountry.countryName} destination modes`}>
        <div>
          <p className="eyebrow">{currentCountry.countryName}</p>
          <p>Choose the pace that suits this trip.</p>
        </div>
        <div className="destination-mode-switch">
          <Link to={`/country/${currentCountry.countryCode}/landing`} className="destination-mode-link is-active">Arrival brief</Link>
          <Link to={`/country/${currentCountry.countryCode}/explore`} className="destination-mode-link">Explore</Link>
          <Link to={`/country/${currentCountry.countryCode}/run`} className="destination-mode-link">Run</Link>
        </div>
      </div>
      <div className="destination-mode-choice destination-mode-choice-awaiting" aria-label="Choose a destination mode">
        <div>
          <p className="eyebrow">The shelf is ready</p>
          <p>Choose a volume to see its arrival, explore, and run modes.</p>
        </div>
        <span className="destination-mode-awaiting-label">Arrival · Explore · Run</span>
      </div>
    </section>
  );
}
