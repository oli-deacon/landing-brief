# Name:
LandingBrief

# Summary:
A mobile-first progressive web app for quick country arrival briefings, designed to help travellers get their bearings before landing and keep key reference notes available offline.

# Friction:
Arriving in a new country often means juggling entry rules, airport-to-city decisions, payment quirks, and practical reminders while connectivity is unreliable.

# Why existing tools were not enough:
This project narrows the problem down to a faster, more portable format than a general travel guide. The implementation is built around short arrival briefs, offline caching, saved destinations, recent views, and per-country notes stored on-device.

# Who it is for:
Travellers who want a compact, phone-friendly arrival brief rather than a broad destination guide.

# How it was built:
Built as a frontend-only React app with Vite, TypeScript, Tailwind CSS v4, React Router, and `vite-plugin-pwa`. Country data is served from static JSON files and cached for offline use; saved briefs, recent countries, and notes live in `localStorage`.

# How it is used now:
Users choose a destination from the home screen, open either a landing-mode or full brief, and can save that brief for offline access, revisit recent countries, and keep personal notes per country.

# Current status:
Working prototype / seeded dataset. The repo currently ships sample country content for Singapore, Thailand, Malaysia, Vietnam, Hong Kong, South Korea, and India, with no backend yet.

# External link:
Unknown. The repo is set up for Vercel deployment, but no public production URL is listed here.

# Screenshots:
No screenshots are included in the repo. It does include destination artwork and PWA assets.

# Body:
LandingBrief is a tightly scoped travel utility rather than a full planning product. Its interface is built around the first moments after touchdown: what to clear at the airport, how to get into the city, what payment or practical details matter, and which official links to keep close.

What makes it feel hand-built is the emphasis on offline resilience over scale. The current version is static and frontend-only, but the app already supports cached country briefs, installable PWA behavior, saved destinations, recent history, and lightweight per-country notes for use on the device itself.
