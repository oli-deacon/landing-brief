import type { CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { getCountryArtwork } from "../lib/country-art";

type Route = { label: string; title: string; distance: string; description: string; note: string; map: string };
type Track = { name: string; body: string; access: string; source: string; url: string } | null;
type RunStory = { name: string; intro: string; routes: [Route, Route]; track: Track };

const map = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const stories: Record<string, RunStory> = {
  sg: {
    name: "Singapore",
    intro: "Singapore makes the early start worthwhile: water, shade, smooth connectors and a city that has not quite filled the paths yet.",
    routes: [
      { label: "City lights", title: "Singapore River Promenade", distance: "2.4 km one way", description: "Start around Kim Seng Road and follow the river to North Boat Quay. It is short enough for a gentle shake-out, or easy to repeat when you want a lit urban loop after sunset.", note: "NParks lists lighting from 7pm to 7am. Expect shared paths and a livelier finish near Boat Quay.", map: map("Singapore River Promenade") },
      { label: "Sea air", title: "East Coast Park", distance: "Make it your distance", description: "Use the East Coast Park stretch of the Eastern Coastal Loop for a flat, coastal out-and-back. Turn when the heat arrives.", note: "Go early, take water, and keep right on shared paths.", map: map("East Coast Park Singapore") }
    ],
    track: { name: "Home of Athletics", body: "A public track at 8 Stadium Boulevard for sessions that need lanes.", access: "Published gate hours vary by day; athlete training and closures can change access.", source: "Sport Singapore hours and closures", url: "https://www.activesgcircle.gov.sg/facilities/home-of-athletics" }
  },
  th: {
    name: "Bangkok",
    intro: "Bangkok running works best at the edges of the day: green parks before the traffic builds, then a slower lap once the heat has gone.",
    routes: [
      { label: "Forest in the city", title: "Benjakitti Park", distance: "Choose a short loop", description: "A large urban forest park in Khlong Toei, with open paths and wetland views that make an easy central-city run.", note: "The Bangkok Metropolitan Administration lists park hours from 4:30am to 10pm; early is the cooler choice.", map: map("Benjakitti Park Bangkok") },
      { label: "The classic", title: "Lumphini Park", distance: "Easy park laps", description: "Use the perimeter paths for a simple, repeatable run in the heart of the city, then step out for coffee or breakfast nearby.", note: "Expect other runners, walkers and changing conditions around the paths.", map: map("Lumphini Park Bangkok") }
    ], track: null
  },
  my: {
    name: "Kuala Lumpur",
    intro: "Kuala Lumpur rewards a run that follows the weather: early, shaded where possible, and close to a place worth lingering after.",
    routes: [
      { label: "Under the towers", title: "KLCC Park", distance: "Short repeatable loop", description: "A central green loop below the Petronas Towers—good for a controlled easy run when you want the city close at hand.", note: "Go outside the busiest evening window for a calmer circuit.", map: map("KLCC Park Kuala Lumpur") },
      { label: "More green", title: "Perdana Botanical Gardens", distance: "Build your own loop", description: "Take the garden paths at your own pace for a greener alternative to the city centre and a less rigid route.", note: "Use the terrain and shade to decide the distance, rather than forcing a fixed loop.", map: map("Perdana Botanical Gardens Kuala Lumpur") }
    ], track: null
  },
  vn: {
    name: "Ho Chi Minh City",
    intro: "In Ho Chi Minh City, run early, keep the route simple, and treat shade, traffic and a cold coffee afterwards as part of the plan.",
    routes: [
      { label: "First light", title: "Tao Dan Park", distance: "Short park loops", description: "A central green reset near District 1—use the paths for an easy, repeatable early run before the streets gather pace.", note: "Stay alert at entrances and crossings; the calmer window is early morning.", map: map("Tao Dan Park Ho Chi Minh City") },
      { label: "Open river", title: "Thủ Thiêm riverside", distance: "Flexible out and back", description: "Use the newer riverside paths opposite the central skyline when you want more horizon and fewer tight city blocks.", note: "Bring water and choose daylight; route conditions can change with local works.", map: map("Thu Thiem riverside Ho Chi Minh City") }
    ], track: null
  },
  hk: {
    name: "Hong Kong",
    intro: "Hong Kong offers two running speeds: the harbour when you want city energy, and the hillside when you want the city to fall away beneath you.",
    routes: [
      { label: "Harbour line", title: "Central to Tamar", distance: "Short waterfront out and back", description: "Use the harbour promenade for a compact run framed by ferries, towers and Victoria Harbour.", note: "It is a shared public space—go early if you want the clearest line.", map: map("Tamar Park Hong Kong") },
      { label: "Higher ground", title: "The Peak loop", distance: "Hilly, make it your distance", description: "A cooler, more elevated option with big views and a decidedly different rhythm from the waterfront.", note: "Treat it as a hill run and check weather before setting off.", map: map("Peak Circle Walk Hong Kong") }
    ],
    track: { name: "LCSD public tracks", body: "Hong Kong’s Leisure and Cultural Services Department states that synthetic tracks in sports grounds are generally open for public jogging when not reserved or used for sports days.", access: "Availability varies by venue and booking; confirm the specific sports ground on the day.", source: "LCSD running guidance", url: "https://www.lcsd.gov.hk/en/healthy/wheretorun.html" }
  },
  mo: {
    name: "Macau",
    intro: "Macau is compact enough for a deliberate run: a waterfront loop, a bridge between districts, then a track session when the published window lines up.",
    routes: [
      { label: "Waterfront", title: "Nam Van Lake", distance: "Short repeatable loop", description: "A simple central waterside route for an early shake-out with space to add another lap if you feel good.", note: "Start early to avoid heat and heavier pedestrian traffic.", map: map("Nam Van Lake Macau") },
      { label: "Across the water", title: "Taipa waterfront", distance: "Flexible out and back", description: "Run the Taipa side for a more open feel, then turn back when the route has given you enough distance.", note: "Use crossings carefully and make the first run a route-finding one.", map: map("Taipa waterfront Macau") }
    ],
    track: { name: "Olympic Sports Centre Stadium", body: "Macao’s Sports Bureau publishes partial public running access at the Olympic Sports Centre athletics track.", access: "Use the current facility calendar before travelling; competitions and activities can change the published hours.", source: "Macao Sports Bureau timetable", url: "https://www.gov.mo/en/news/818051/" }
  },
  kr: {
    name: "Seoul",
    intro: "Seoul is a city for a proper run: river paths that hold a steady rhythm, green hills that change the effort, and a deep public running culture.",
    routes: [
      { label: "The river", title: "Hangang Park", distance: "Build your own riverside run", description: "Use the Han River paths for a long, smooth, adjustable run with the city on both sides of the water.", note: "Seoul highlights the riverside grounds as some of its most popular and well-paved jogging routes.", map: map("Yeouido Hangang Park Seoul") },
      { label: "Elastic pavement", title: "Namsan Expressway track", distance: "7.5 km", description: "A more defined route with an elastic surface and a change of elevation that feels distinct from the riverside.", note: "Choose a clear-weather day and expect the climbing to shape the effort.", map: map("Namsan Expressway jogging track Seoul") }
    ],
    track: { name: "Son Keechung Sports Park", body: "Seoul’s runner-focused Son Keechung Sports Park includes a running track and running centre.", access: "Check the park’s current programme or local notices before a workout session.", source: "Seoul Metropolitan Government", url: "https://english.seoul.go.kr/son-keechung-sports-park-recreated-as-a-shrine-for-runners-connecting-to-namsan-mountain-with-pedestrian-walkway/" }
  },
  in: {
    name: "New Delhi",
    intro: "New Delhi is best approached by pocket: run a garden or a broad ceremonial avenue early, then retreat before heat and traffic take over the streets.",
    routes: [
      { label: "Garden miles", title: "Lodhi Garden", distance: "Easy repeatable loops", description: "Use the garden paths for a shaded, lower-stress run framed by tombs, trees and a morning crowd that knows the routine.", note: "Stay aware of your surroundings and start as early as you can.", map: map("Lodhi Garden New Delhi") },
      { label: "Open Delhi", title: "India Gate precinct", distance: "Flexible broad avenues", description: "A spacious option when you want the capital’s scale around you rather than a park loop underfoot.", note: "Traffic and access arrangements can vary—make this a daylight, route-finding run.", map: map("India Gate New Delhi") }
    ], track: null
  }
};

export function CountryRunPage() {
  const { countryCode = "" } = useParams();
  const code = countryCode.toLowerCase();
  const story = stories[code];
  const artwork = getCountryArtwork(code);
  if (!story || artwork?.kind !== "image") return <Navigate to={`/country/${code}`} replace />;
  const style = { "--run-poster": `url("${artwork.src}")` } as CSSProperties & { "--run-poster": string };
  return <article className="run-page" style={style}>
    <section className="run-hero"><img src={artwork.src} alt={artwork.alt} className="run-hero-art" /><div className="run-hero-wash" aria-hidden="true" /><div className="run-hero-copy"><p className="run-kicker">{story.name} running notes</p><h1>Run before the city gets loud.</h1><p>Two routes to get your bearings on foot{story.track ? ", plus a public-track option when the session needs lanes." : "."}</p><a href="#routes" className="run-start">Find your route <span aria-hidden="true">↓</span></a></div></section>
    <section className="run-intro" aria-label={`${story.name} running introduction`}><p>{story.intro}</p></section>
    <section id="routes" className="run-routes" aria-label={`Classic ${story.name} running routes`}>{story.routes.map((route, index) => <article key={route.title} className="run-route"><div className="run-route-line" aria-hidden="true"><span /></div><p className="run-route-number">{String(index + 1).padStart(2, "0")}</p><div className="run-route-content"><p className="run-kicker">{route.label}</p><h2>{route.title}</h2><p className="run-route-distance">{route.distance}</p><p className="run-route-description">{route.description}</p><p className="run-route-note">{route.note}</p><a href={route.map} target="_blank" rel="noopener noreferrer">Open start point in Maps <span aria-hidden="true">↗</span></a></div></article>)}</section>
    {story.track ? <section className="run-track" aria-label="Public athletics track"><div className="run-track-copy"><p className="run-kicker">Public track</p><h2>{story.track.name}</h2><p>{story.track.body}</p></div><dl><div><dt>Access</dt><dd>{story.track.access}</dd></div><div><dt>Official source</dt><dd><a href={story.track.url} target="_blank" rel="noopener noreferrer">{story.track.source} ↗</a></dd></div></dl></section> : <section className="run-track run-track--pending"><div className="run-track-copy"><p className="run-kicker">Athletics track</p><h2>None confirmed yet.</h2><p>This prototype does not list a public athletics track for {story.name} until access can be confirmed with a venue or government source.</p></div></section>}
    <section className="run-closing"><p className="run-kicker">The practical side</p><h2>Check the weather, then leave early.</h2><p>Carry water, choose the quieter hours, and treat your first run as a route-finding session.</p><div className="destination-mode-switch"><Link to={`/country/${code}/landing`} className="destination-mode-link">Arrival brief</Link><Link to={`/country/${code}/explore`} className="destination-mode-link">Explore</Link><span className="destination-mode-link is-active">Run</span></div></section>
  </article>;
}
