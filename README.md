# LandingBrief

LandingBrief is a mobile-first PWA for quick country arrival briefings. This repository currently uses a static JSON data layer with sample country content for Singapore, Thailand, Malaysia, Vietnam, Hong Kong, Macau, South Korea, and India.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS v4
- `vite-plugin-pwa`
- Vercel-ready SPA routing

## Local Setup

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Build the app:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

- `src/pages` — app routes and page-level UI
- `src/components` — shared shell and card components
- `src/data/countries` — static country briefing JSON files plus index exports
- `src/types.ts` — shared data model types
- `public` — static icons and PWA assets

## Current Routes

- `/` — Home
- `/country/:countryCode` — Country Brief
- `/saved` — Saved Briefs
- `/settings` — Settings

## Deployment

This project is set up for deployment to Vercel as a Vite single-page app.

Recommended Vercel settings:

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

Client-side routing is handled by [vercel.json](/Users/olideacon/code/landing-brief/vercel.json), which rewrites all routes to `index.html`.

The Vercel config also applies response headers for CSP, anti-framing, referrer policy, MIME sniffing protection, and a restrictive permissions policy. These protections are intended to be enforced at the HTTP layer rather than through HTML meta tags.

## Security Notes

- This is a frontend-only app. Anything shipped to the browser should be treated as public.
- Do not place secrets in `VITE_*` variables, static JSON, `public/`, or any client-delivered config.
- `localStorage` in this project is for low-sensitivity offline convenience data only. Never store tokens, auth material, travel documents, passport details, or personal identifiers there.
- Official reference links should stay `https:` only and render through the shared URL safety guardrail in the app.
- Country briefing data is cached for offline use. Keep content freshness visible in the UI and avoid reusing the same cache strategy for future sensitive or user-specific responses.

## Public Repo Checklist

- Confirm there are no tracked `.env` files, private keys, certificates, or copied production credentials.
- Keep `.env*`, `.vercel/`, logs, and build artifacts out of Git.
- If client config is introduced later, add an `.env.example` with public placeholders only.
- Run `npm audit` or an equivalent dependency review from a network-enabled environment before publishing.
- Enable GitHub secret scanning, Dependabot alerts, and dependency updates after the repo is shared.
- If source maps are ever uploaded or published, decide deliberately whether they should be public.

## Notes

- Country briefing data is static for now; there is no backend yet.
- Entry guidance is sample content only and should always be verified against official travel and immigration sources before use.
