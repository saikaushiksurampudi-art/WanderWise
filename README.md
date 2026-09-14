# WanderWise AI

Budget-first travel planner: destination, dates, group size, and a hard budget cap produce a day-by-day itinerary with live weather, currency conversion, checkout, and PDF export.

## Project layout

```
src/
  App.tsx                 # Screen composition
  hooks/                  # App state and live weather/FX
  components/             # Feature screens, modals, itinerary pieces
  services/               # REST client and PDF export
  types.ts
server.ts                 # Express + Vite (dev) / static (prod)
server/
  routes.ts               # REST API
  geminiService.ts        # Gemini itinerary + concierge (rule-based fallback)
  seedData.ts
```

## Run locally

1. `npm install`
2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY` (optional; a local rule-based planner still works without it)
3. `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` — Express API + Vite React app
- `npm run build` — production client + server bundle
- `npm start` — run the production server
