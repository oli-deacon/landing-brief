# LandingBrief

LandingBrief is a mobile-first PWA for quick country arrival briefings. This repository currently uses a static JSON data layer with sample country content for Singapore, Thailand, Malaysia, Vietnam, Hong Kong, South Korea, and India.

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

## Notes

- Country briefing data is static for now; there is no backend yet.
- Entry guidance is sample content only and should always be verified against official travel and immigration sources before use.
