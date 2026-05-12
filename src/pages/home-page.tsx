import { Link } from "react-router-dom";

import { Card } from "../components/card";
import { SectionHeading } from "../components/section-heading";
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
        <div className="hero-content flex min-h-[32rem] flex-col justify-end px-5 pb-8 pt-16 sm:min-h-[36rem] sm:px-7 sm:pb-10 sm:pt-20">
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
        </div>
      </section>

      <SectionHeading
        title="Choose your arrival brief"
        description="Start with a destination, then move between a 90-second landing scan and the deeper country guide without losing your place."
      />

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
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              {countryIndex.data.slice(0, 1).map((country) => (
                <Link key={country.countryCode} to={`/country/${country.countryCode}`} className="block">
                  <Card className="hero-frame min-h-[20rem] overflow-hidden transition hover:-translate-y-0.5 hover:border-border-strong">
                    <div className="hero-content flex h-full flex-col justify-end">
                      <p className="eyebrow">{country.capitalOrMainCity}</p>
                      <h3 className="mt-2 text-[2.4rem] leading-[0.9] text-text-main">{country.countryName}</h3>
                      <p className="mt-3 max-w-md text-sm leading-7 text-text-muted">
                        Start in landing mode, then expand into transport, payments, and local context when you need more depth.
                      </p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span className="text-sm text-text-soft">Via {country.primaryAirport}</span>
                        <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
                          {country.countryCode.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}

              <div className="space-y-3">
                {countryIndex.data.slice(1).map((country) => (
                  <Link key={country.countryCode} to={`/country/${country.countryCode}`} className="block">
                    <article className="section-frame rounded-[1.6rem] p-4 transition hover:-translate-y-0.5 hover:border-border-strong">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <p className="eyebrow">{country.capitalOrMainCity}</p>
                          <h3 className="text-[1.5rem] leading-[0.98] text-text-main">{country.countryName}</h3>
                          <p className="text-sm leading-6 text-text-muted">
                            Via {country.primaryAirport}. Entry, transport, money, and practical first-hour notes.
                          </p>
                        </div>
                        <span className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
                          {country.countryCode.toUpperCase()}
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section>
    </>
  );
}
