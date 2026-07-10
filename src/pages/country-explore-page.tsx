import type { CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { getCountryArtwork } from "../lib/country-art";

type ExploreChapter = {
  label: string;
  title: string;
  body: string;
  note: string;
  className: string;
};

type ExploreStory = {
  name: string;
  eyebrow: string;
  title: string;
  intro: string;
  prologue: string;
  chapters: [ExploreChapter, ExploreChapter, ExploreChapter];
};

const stories: Record<string, ExploreStory> = {
  sg: {
    name: "Singapore",
    eyebrow: "Island city, close up",
    title: "Singapore, between the green and the glow.",
    intro: "A city that makes room for rainforest, hawker smoke and a skyline reflected in the bay.",
    prologue: "Singapore rewards a change of pace: cool, ordered mornings; humid, delicious afternoons; then the light arriving over the water.",
    chapters: [
      { label: "The old quarters", title: "Start where the city keeps its texture.", body: "Walk through Chinatown, Kampong Glam or Little India before the heat settles in. Shophouses, temples and coffee counters turn the city’s history into something you can wander.", note: "Pick one neighbourhood and stay longer than your map suggests.", className: "macau-chapter--old" },
      { label: "The waterfront", title: "When the gardens meet the skyline.", body: "Marina Bay is Singapore at its most cinematic: mirrored towers, long promenades and the giant trees of Gardens by the Bay after the sun loosens its grip.", note: "Arrive late afternoon and let the walk carry you into the evening.", className: "macau-chapter--night" },
      { label: "The table", title: "Follow the queues, then order one more thing.", body: "Hawker centres make the city legible through flavour — chicken rice, laksa, satay, kaya toast and the clatter of dozens of small decisions made well.", note: "A full table beats a long review. Join the line that is already moving.", className: "macau-chapter--taste" }
    ]
  },
  th: {
    name: "Bangkok",
    eyebrow: "The city in motion",
    title: "Bangkok, turned all the way up.",
    intro: "Temple gold, river ferries, late suppers and a city that gets more interesting as the day heats up.",
    prologue: "Bangkok does not ask you to see it all. It asks you to step into its current: a boat, a market lane, a small plastic stool after dark.",
    chapters: [
      { label: "The river", title: "Let the Chao Phraya set the pace.", body: "A river boat pulls the city apart into scenes: temple spires, wooden piers and the everyday choreography of people crossing Bangkok their own way.", note: "Use the water as transport, not just a view.", className: "macau-chapter--old" },
      { label: "After dark", title: "The street is the evening plan.", body: "When the sun lowers, Bangkok changes register. Rooftops glow, side streets fill, and the easiest dinner is usually somewhere you can smell before you can name.", note: "Choose a neighbourhood, then leave room for an unplanned turn.", className: "macau-chapter--night" },
      { label: "The table", title: "Eat with a little courage.", body: "From a quick bowl of noodles to mango sticky rice, street food is the city’s most immediate welcome — fragrant, fast and rarely still.", note: "Busy stalls are a good sign. Start there.", className: "macau-chapter--taste" }
    ]
  },
  my: {
    name: "Kuala Lumpur",
    eyebrow: "A city of layers",
    title: "Kuala Lumpur, all roads converging.",
    intro: "A place of tiled kopitiams, tropical storms and towers that catch the last light above a city built from many voices.",
    prologue: "Kuala Lumpur makes a virtue of contrast: colonial facades near elevated rail, old markets beside polished malls, a meal that can travel across continents in a single table.",
    chapters: [
      { label: "The old centre", title: "Walk the seams of the city.", body: "Around Merdeka Square, Central Market and Petaling Street, Kuala Lumpur slows into colour, covered walkways and details that reward looking up.", note: "Duck in when the rain arrives; the city always has another layer nearby.", className: "macau-chapter--old" },
      { label: "The skyline", title: "Find the view, then stay for the weather.", body: "The Petronas Towers define the horizon, but the drama is often lower down: a storm rolling through, rail lines threading between neighbourhoods, the city glowing after rain.", note: "The clearest nights come after the biggest downpours.", className: "macau-chapter--night" },
      { label: "The table", title: "Let dinner be the itinerary.", body: "Nasi lemak, roti canai, smoky satay and late-night mamak stalls tell the city’s story with a generosity that makes choosing difficult in the best way.", note: "Order to share. Kuala Lumpur is built for trying more than one thing.", className: "macau-chapter--taste" }
    ]
  },
  vn: {
    name: "Ho Chi Minh City",
    eyebrow: "A city with momentum",
    title: "Ho Chi Minh City, always in motion.",
    intro: "Coffee, scooters and sun-faded facades move in overlapping rhythms from first light to the last tiny stool at night.",
    prologue: "The city is best read at street level: cross slowly, sit outside, look up at the balconies, then follow the sound of ice clinking in a glass.",
    chapters: [
      { label: "The streets", title: "Learn the rhythm before you cross.", body: "District 1 gives you old post office grandeur and shaded boulevards, but the most enduring moments tend to be the ordinary ones happening just off the main road.", note: "Walk with intent, then pause often. The traffic makes more sense that way.", className: "macau-chapter--old" },
      { label: "The evening", title: "The city comes outside after sunset.", body: "As the temperature softens, cafés fill, scooters stream past and small stools appear wherever a good snack or cold drink can be found.", note: "An evening coffee is not a stop between plans. It is the plan.", className: "macau-chapter--night" },
      { label: "The table", title: "Start with something steaming.", body: "Pho, broken rice, bánh mì and sharp, sweet iced coffee make a strong first argument for eating your way through the city.", note: "Follow the busiest breakfast crowd at least once.", className: "macau-chapter--taste" }
    ]
  },
  hk: {
    name: "Hong Kong",
    eyebrow: "Vertical, vivid, immediate",
    title: "Hong Kong, from harbour to hillside.",
    intro: "A city of bright signs, quick ferries and steep green edges, compressed into one of the world’s great urban views.",
    prologue: "Hong Kong changes scale constantly. Look up in Central, look out from the water, then take a turn into the neighbourhood streets where the city is still cooking dinner.",
    chapters: [
      { label: "The harbour", title: "Begin with the crossing.", body: "The Star Ferry is a small, perfect way to understand the city: salt air, towers shifting in the windows, Kowloon and Hong Kong Island pulling towards each other.", note: "Take it once in daylight and once when the lights come on.", className: "macau-chapter--old" },
      { label: "The night", title: "A skyline with an afterimage.", body: "From the Peak or the waterfront, Hong Kong’s density becomes a field of light. The city feels immense, then suddenly very close again when you step back onto the street.", note: "Stay late enough for the city to change colour.", className: "macau-chapter--night" },
      { label: "The table", title: "Make room for another round.", body: "Dim sum, wonton noodles, roast meats and cha chaan teng breakfasts make eating here quick, communal and wonderfully specific.", note: "The best meal may be the one with no menu in English.", className: "macau-chapter--taste" }
    ]
  },
  mo: {
    name: "Macau",
    eyebrow: "A pocket picture book",
    title: "Macau, in three acts.",
    intro: "A small city with a long memory — Portuguese stone, Cantonese kitchens and a future-facing skyline all in one walkable frame.",
    prologue: "There are few places where a baroque church facade, a centuries-old temple and a glittering resort tower appear in the same afternoon. Macau makes more sense when you let those contrasts stay visible.",
    chapters: [
      { label: "The peninsula", title: "Old streets, sea air, and tiled squares.", body: "Begin on the peninsula, where the Ruins of Saint Paul’s give way to quiet lanes, Portuguese facades and the soft commotion of Senado Square.", note: "Walk the hill early, then drift downhill without a plan. The best details are often between the stops.", className: "macau-chapter--old" },
      { label: "Cotai after sunset", title: "A city that changes tempo after dark.", body: "Across the water in Cotai, Macau turns luminous and theatrical: monumental hotel halls, neon reflections and a horizon made for an unhurried evening walk.", note: "Use the free hotel shuttles as part of the experience — the city’s scale shifts from one side to the other.", className: "macau-chapter--night" },
      { label: "The table", title: "Make time for the flavours in between.", body: "Macanese cooking is where the city’s histories meet. Follow the scent of butter, charcoal and spice through bakeries, small cafes and long local lunches.", note: "Order an egg tart warm, then make room for African chicken, minchi, and something you cannot quite name yet.", className: "macau-chapter--taste" }
    ]
  },
  kr: {
    name: "Seoul",
    eyebrow: "Old walls, new velocity",
    title: "Seoul, in the space between.",
    intro: "Palace roofs, mountain paths and neon-lit neighbourhoods make Seoul feel both deeply rooted and a step ahead.",
    prologue: "Seoul is a city of productive contrasts: morning calm behind palace walls, a river path at dusk, then a street that seems to find another gear after dark.",
    chapters: [
      { label: "The old city", title: "Walk beneath the palace roofs.", body: "Gyeongbokgung and Bukchon offer a quieter frame for Seoul — low timber, mountain backdrops and the patient geometry of the old capital.", note: "Go early, before the crowds give the streets a different rhythm.", className: "macau-chapter--old" },
      { label: "The evening", title: "The city keeps going after dinner.", body: "From the Han River to the neon of Euljiro and Hongdae, Seoul stretches the day into a bright, sociable night.", note: "Take a convenience-store picnic to the river and watch the city unwind.", className: "macau-chapter--night" },
      { label: "The table", title: "Let the meal arrive in layers.", body: "Korean barbecue, stews, noodles and side dishes turn every table into a small ceremony of sharing, refilling and trying again.", note: "A late snack is a Seoul essential, not an indulgence.", className: "macau-chapter--taste" }
    ]
  },
  in: {
    name: "New Delhi",
    eyebrow: "A capital of contrasts",
    title: "New Delhi, vast and close at once.",
    intro: "Grand avenues, old markets and the scent of spice make the capital feel less like one city than a constellation of worlds.",
    prologue: "Delhi takes time to come into focus. Let each neighbourhood be its own scene: a monument in the morning, a market at midday, a long meal when the heat begins to soften.",
    chapters: [
      { label: "The old city", title: "Step into the older current.", body: "Around Old Delhi, history is close enough to touch — narrow lanes, Jama Masjid’s scale, street traders and an energy that makes the city feel permanently in the making.", note: "Go with a light plan and a little patience. The density is part of the experience.", className: "macau-chapter--old" },
      { label: "The evening", title: "Follow the city into the blue hour.", body: "As the day cools, Delhi’s gardens, monuments and market streets take on a softer edge. There is always another courtyard or café behind the next turn.", note: "Build a pause into the day; the city gives more back when you do.", className: "macau-chapter--night" },
      { label: "The table", title: "Eat where the aromas lead.", body: "Chaat, kebabs, rich curries and sweet chai make eating in Delhi an essential part of seeing it — vibrant, varied and best approached with curiosity.", note: "Begin with busy, well-reviewed spots and let your confidence grow.", className: "macau-chapter--taste" }
    ]
  }
};

export function CountryExplorePage() {
  const { countryCode = "" } = useParams();
  const code = countryCode.toLowerCase();
  const story = stories[code];
  const artwork = getCountryArtwork(code);

  if (!story || artwork?.kind !== "image") {
    return <Navigate to={`/country/${code}`} replace />;
  }

  const pageStyle = {
    "--explore-poster": `url("${artwork.src}")`
  } as CSSProperties & { "--explore-poster": string };

  return (
    <article className="macau-explore" style={pageStyle}>
      <section className="macau-explore-hero">
        <img className="macau-explore-hero-art" src={artwork.src} alt={artwork.alt} />
        <div className="macau-explore-hero-wash" aria-hidden="true" />
        <div className="macau-explore-hero-copy">
          <p className="macau-explore-kicker">{story.eyebrow}</p>
          <h1>{story.title}</h1>
          <p className="macau-explore-intro">{story.intro}</p>
          <a className="macau-explore-start" href="#chapter-one">Begin the walk <span aria-hidden="true">↓</span></a>
        </div>
        <p className="macau-explore-scroll-cue" aria-hidden="true">Scroll slowly</p>
      </section>

      <section className="macau-explore-prologue" aria-label={`${story.name} introduction`}>
        <p>{story.prologue}</p>
      </section>

      <div className="macau-chapters">
        {story.chapters.map((chapter, index) => (
          <section id={index === 0 ? "chapter-one" : undefined} key={chapter.title} className={`macau-chapter ${chapter.className}`}>
            <div className="macau-chapter-frame" aria-hidden="true" />
            <div className="macau-chapter-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="macau-chapter-content">
              <p className="macau-explore-kicker">{chapter.label}</p>
              <h2>{chapter.title}</h2>
              <p className="macau-chapter-body">{chapter.body}</p>
              <p className="macau-chapter-note">{chapter.note}</p>
            </div>
          </section>
        ))}
      </div>

      <section className="macau-explore-closing">
        <p className="macau-explore-kicker">When you are ready to go</p>
        <h2>Keep the practical details close.</h2>
        <p>Arrival, money, transport, data and the first few decisions after you land.</p>
        <Link to={`/country/${code}`} className="macau-explore-brief-link">Open the {story.name} arrival brief <span aria-hidden="true">→</span></Link>
      </section>
    </article>
  );
}
