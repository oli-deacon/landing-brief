import { Link } from "react-router-dom";

import { Card } from "../components/card";
import { useCountryIndex } from "../hooks/use-country-data";

const harbourHeroImage = "/images/hk-harbour.jpg";

export function HomePage() {
  const countryIndex = useCountryIndex();

  return (
    <>
      <section className="hero-frame rounded-[2.2rem] border border-border-soft">
        <img
          src={harbourHeroImage}
          alt="Hong Kong harbour viewed from the air through low clouds"
          className="hero-media"
        />
        <div className="hero-content flex min-h-[28rem] flex-col justify-end p-5 sm:min-h-[32rem] sm:p-7">
          <div className="max-w-md space-y-4">
            <p className="eyebrow text-text-soft">Open in travel mode</p>
            <h1 className="text-[3.2rem] leading-[0.88] text-white sm:text-[4.2rem]">
              LandingBrief
            </h1>
            <p className="max-w-sm text-sm leading-7 text-slate-200">
              Country briefings for the last stretch before touchdown and the first hour after
              arrival.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="pill-chip rounded-full px-4 py-2 text-xs font-medium">
              Hong Kong harbour series
            </div>
            <div className="pill-chip rounded-full px-4 py-2 text-xs font-medium">
              Optimized for installed PWA reading
            </div>
          </div>
        </div>
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
            <div className="space-y-8">
              {countryIndex.data.map((country) => (
                <Link
                  key={country.countryCode}
                  to={`/country/${country.countryCode}`}
                  className="block"
                >
                  <Card className="transition hover:-translate-y-0.5 hover:border-border-strong">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="eyebrow">
                          {country.capitalOrMainCity}
                        </p>
                        <h3 className="text-[1.8rem] leading-[0.95] text-text-main">
                          {country.countryName}
                        </h3>
                        <p className="text-sm leading-7 text-text-muted">
                          Via {country.primaryAirport}. Entry notes, transport, etiquette, and
                          payment basics.
                        </p>
                      </div>
                      <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
                        {country.countryCode.toUpperCase()}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </section>
    </>
  );
}
