import { Link } from "react-router-dom";

import { DepartureBoard, DepartureNavigation } from "../components/departure-board";
import { useCountryIndex } from "../hooks/use-country-data";

export function HomePage() {
  const countryIndex = useCountryIndex();

  return (
    <div className="departure-dashboard">
      <DepartureNavigation />
      <section className="departure-intro">
        <p className="departure-kicker">Get your bearings</p>
        <h1>Choose a destination.</h1>
      </section>
      {countryIndex.status === "loading" ? (
        <div className="departure-loading" role="status"><span className="departure-kicker">Preparing the board</span><p>Loading your destinations…</p></div>
      ) : null}
      {countryIndex.status === "error" ? (
        <section className="departure-notice" role="alert">
          <h2>Offline setup needed</h2>
          <p>Open LandingBrief while connected once to cache country data for offline use. Your saved notes and recent destinations still remain available on this device.</p>
          <Link to="/offline">View offline help <span aria-hidden="true">→</span></Link>
        </section>
      ) : null}
      {countryIndex.status === "ready" ? (
        <>
          {countryIndex.source === "cache" ? <p className="departure-notice">You’re viewing cached country summaries. Open a destination online once to keep its brief handy offline.</p> : null}
          <DepartureBoard countries={countryIndex.data} />
        </>
      ) : null}
    </div>
  );
}
