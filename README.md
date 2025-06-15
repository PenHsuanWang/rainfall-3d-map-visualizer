# Rain-on-Map 3D Histogram
A full-stack TypeScript monorepo that turns rainfall measurements into an interactive 3-D map.

\_\_\_

## Table of Contents
1. Features
2. Architecture
3. Project Structure
4. Quick Start (Developer mode)
5. Running with Docker Compose
6. Environment Variables
7. NPM Workspace Scripts
8. Testing
9. CI / CD
10. Extending Data Sources
11. Contributing
12. License

\_\_\_

## Features

- 3-D histogram of rainfall on an interactive map (deck.gl + Mapbox)
- Modular Data Provider pattern – swap CSV, REST API, or DB with one line of config
- Type-safe end-to-end (shared interfaces in packages/common)
- Monorepo with Yarn/PNPM workspaces + Turborepo for fast builds
- Live-reload dev servers (`pnpm dev`)
- Docker multi-stage images & docker-compose stack
- GitHub Actions pipeline template (build ➜ test ➜ docker ➜ deploy)

\_\_\_

## Architecture

```
Browser
   │   (fetch /api/rainfall)
   ▼
Frontend (React 18 + Vite + deck.gl)
   │
   ▼
Express API  (Node 20 TS)
   │           ▲
   │           │ implements RainfallDataProvider
CSV │ API │ DB ┘
```

The backend chooses a concrete `RainfallDataProvider` at startup; the
frontend never needs to change.

\_\_\_

## Project Structure

```
packages/
├─ common/     # shared TypeScript interfaces & utilities
├─ backend/    # Express API, modular data providers
└─ frontend/   # React + deck.gl UI (Vite)
```
<details>
<summary>Open full tree</summary>

```
rainfall-3d-histogram/
├─ package.json            # workspaces + turbo scripts
├─ tsconfig.base.json
├─ docker-compose.yml
└─ packages/
   ├─ common/
   │  └─ src/types.ts
   ├─ backend/
   │  ├─ src/index.ts
   │  ├─ src/server.ts
   │  ├─ src/controllers/rainfallController.ts
   │  └─ src/dataProviders/
   │       ├─ DataProvider.ts
   │       ├─ CsvDataProvider.ts
   │       ├─ ApiDataProvider.ts
   │       └─ DatabaseDataProvider.ts
   └─ frontend/
      └─ src/
          ├─ main.tsx
          ├─ App.tsx
          ├─ api/rainfallApi.ts
          └─ components/RainfallMap.tsx
```
</details>

\_\_\_

## Quick Start (Developer mode)

### 🚀 Prerequisites

Ensure you have:
1. Node.js 18+ with your favorite package manager (pnpm, npm or yarn).
2. A Mapbox token (required for the default Mapbox basemap). If you prefer OpenStreetMap via `@deck.gl/geo-layers`, no token is needed.
3. Optionally, Docker and Docker Compose for a containerized stack.

### 1. Clone the repository

```bash
git clone <repo-url>
cd rainfall-3d-map-visualizer
```

### 2. Install dependencies (entire workspace)

```bash
pnpm install
# or `npm install` / `yarn install` if you prefer
```

### 3. Backend setup & run

Create `packages/backend/.env` (if needed) with:

```env
CSV_FILE=/absolute/path/to/datasets/rainfall.csv
PORT=3000
DATA_SOURCE=csv
```

Start the API in dev mode:

```bash
pnpm --filter @rain/backend dev
```

Or build then run:

```bash
cd packages/backend
pnpm run build
pnpm start
```

Your API will be available at <http://localhost:3000/api/rainfall>.

### 4. Frontend setup & run

Choose a map provider:
* **OpenStreetMap** – works with `@deck.gl/geo-layers` (no token required).
* **Mapbox** – set `VITE_MAPBOX_TOKEN=YOUR_TOKEN` in `.env` or your shell.

Launch the dev server:

```bash
pnpm --filter @rain/frontend dev
```

Open <http://localhost:5173/> (use `/`, not `/index.html`).

### 5. Quick validation
1. Navigate to <http://localhost:5173/>.
2. Confirm the map loads and that `/api/rainfall` returns JSON.

### 6. Production with Docker (optional)

```bash
docker-compose build
docker-compose up
```

The app will be available on ports 3000 and 5173.

### 7. Next steps
* Add tests (Jest, Supertest, React Testing Library).
* Integrate CI with `turbo run lint build test`.
* Enhance the UI with loading states, error handling and tooltips.

### ✅ TL;DR

```bash
pnpm install
pnpm --filter @rain/backend dev
pnpm --filter @rain/frontend dev
```

Once both are running, visit <http://localhost:5173/> to explore the rainfall histogram.

\_\_\_

## Running with Docker Compose

```bash
docker-compose build
docker-compose up
# UI:       http://localhost:5173
# API json: http://localhost:3000/api/rainfall
```

docker-compose.yml mounts `./datasets` into the backend container (`CSV_FILE=/data/rainfall.csv`).

\_\_\_

## Environment Variables

| Var | Component | Default | Description |
|-----|-----------|---------|-------------|
| `CSV_FILE` | backend | `data/rainfall.csv` | Path to rainfall CSV (host or container) |
| `DATA_SOURCE` | backend | `csv` | `csv` \| `api` \| `db` |
| `API_URL` | backend | — | Upstream REST endpoint (if `DATA_SOURCE=api`) |
| `PORT` | backend | `3000` | API listen port |
| `VITE_MAPBOX_TOKEN` | frontend | — | **Required** for basemap tiles |
| `VITE_API_BASE` | frontend | `/api` | Override if proxy path differs |

\_\_\_

## NPM Workspace Scripts

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Parallel dev servers (backend + frontend) via Turbo |
| `pnpm build` | Type-check & transpile all packages |
| `pnpm lint` | ESLint across workspace |
| `pnpm --filter @rain/backend test` | (add jest) Run backend tests |
| `pnpm --filter @rain/frontend build` | Production Vite build |

\_\_\_

## Testing

- Backend: Jest + Supertest (scaffold ready for unit & route tests).
- Frontend: Vitest + React Testing Library.

Basic sample test files are in `packages/backend/tests/` and `packages/frontend/src/__tests__/`.

Run all tests:

```bash
pnpm turbo run test
```

\_\_\_

## CI / CD

`.github/workflows/ci.yml` (template committed):
1. Install → Lint → Test
2. Build Docker images with BuildKit cache
3. Push to GitHub Container Registry
4. (Optionally) Deploy via `docker compose pull && up -d` on self-host / or update K8s image tags.

Secrets used: `GHCR_USERNAME`, `GHCR_TOKEN`, `MAPBOX_TOKEN`, etc.

\_\_\_

## Extending Data Sources
1. Create `src/dataProviders/MyNewProvider.ts` implementing the `RainfallDataProvider` interface.
2. Add env-switch logic in `server.ts`:

```ts
else if (process.env.DATA_SOURCE === "mynew") {
  provider = new MyNewProvider(...);
}
```

3. No frontend changes needed – the API route still returns `RainfallDataPoint[]`.

\_\_\_

## Contributing
1. Fork & create feature branch.
2. `pnpm lint && pnpm test` must pass.
3. Submit a PR; the GitHub Actions build must be green.

\_\_\_

## License

MIT © 2025 Your Company Name.

