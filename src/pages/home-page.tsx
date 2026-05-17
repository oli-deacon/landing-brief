import { Link } from "react-router-dom";

import { Card } from "../components/card";
import { HomeDestinationCarousel } from "../components/home-destination-carousel";
import { useCountryIndex } from "../hooks/use-country-data";

export function HomePage() {
  const countryIndex = useCountryIndex();

  return (
    <>
      <section className="space-y-2 px-1">
        <p className="eyebrow">Portable country intelligence</p>
        <h1 className="max-w-none text-[1.55rem] leading-[1.08] text-text-main sm:text-[1.85rem] lg:text-[1.72rem] lg:whitespace-nowrap">
          Choose your arrival brief. <span className="text-text-muted">The fastest way to get your bearings before touchdown.</span>
        </h1>
      </section>

      <section className="space-y-3">
        {countryIndex.status === "loading" ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse bg-surface-strong/70">
                <div className="h-24 rounded-[1.25rem] bg-surface-muted/70" />
              </Card>
            ))}
          </div>
        ) : null}
        {countryIndex.status === "error" ? (
          <Card title="Offline setup needed" eyebrow="Country data unavailable">
            <p className="text-sm leading-6 text-text-muted">
              Open LandingBrief while connected once to cache country data for offline use. Your
              saved notes and recent destinations still remain available from this device.
            </p>
            <Link
              to="/offline"
              className="button-primary mt-4 inline-flex rounded-full px-4 py-3 text-sm font-medium"
            >
              View offline help
            </Link>
          </Card>
        ) : null}
        {countryIndex.status === "ready" ? (
          <>
            {countryIndex.source === "cache" ? (
              <Card className="bg-accent-soft/60">
                <p className="text-sm leading-6 text-text-main">
                  You are viewing cached country summaries. Open any destination here while online
                  once and it will stay handy offline later.
                </p>
              </Card>
            ) : null}
            <HomeDestinationCarousel countries={countryIndex.data} />
          </>
        ) : null}
      </section>
    </>
  );
}
