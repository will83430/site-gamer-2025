# Site Gamer 2025 – AI Working Notes
- Stack: Node 18+, Express server + PostgreSQL (`gamer_2025`), static frontend under `frontend/public`, generated fiches under `fiches/`; gzip via compression middleware and permissive CORS in `server.js`.
- Static serving order matters: `/assets` → `/frontend/public` → `/fiches` → project root (see `server.js`). Keep it when adding middleware.
- DB access is configured via `.env` file (user `postgres`, db `gamer_2025`, password in `.env`). Server uses `backend/config/database.js`, scripts should use environment variables. Never hard-code credentials.
- Data shape: table `produits` uses string IDs like `prod_50`; fields include `fonctionnalites_avancees` and `donnees_fiche` (arrays), `top_du_mois` boolean, `titre_affiche` optional, `image` filename (not full path).
- API products: `/api/produits` GET with optional `?categorie=`; POST auto-assigns next `prod_*` id based on max substring; PUT expects all fields (not partial) and overwrites arrays; DELETE returns product name (see CRUD handlers in `server.js`). `image_url` is derived (defaults to `/assets/images/placeholder.png`).
- Fiche generation: POST `/api/generate-fiche/:id` renders `generateFicheHTML()` into `fiches/<categorie-slug>/<product-slug>.html`; uses `titre_affiche || nom`, `styles.min.css`, and `fiche-produit.min.js`. DELETE `/api/fiches/:id` removes file via stored `lien`. Preview via `/api/preview-fiche/:id` tries multiple paths.
- Category content: routes `/api/:categorie/{actualites|technologies|marche|insights|predictions}` plus CRUD endpoints per table. Categories resolved via lowercase match on `categories.nom`; `tags` may be stored as Postgres arrays or `{a,b}` strings—code normalizes them.
- Tendances CRUD: `/api/tendances` uses the same category lookup pattern and expects `tags` array to be turned into `{...}` string for SQL (see `server.js`).
- LLM feature flag endpoint: `/api/llm-config` reads `OPENAI_MODEL`, `GPT5_ENABLED`, `GPT5_ROLLOUT`; otherwise defaults to `gpt-5` and 0% rollout.
- Scripts (Node 18+ with global fetch):
  - `scripts/add-new-products.js` inserts the 12 December products with full payloads and `top_du_mois=true`.
  - `scripts/generate-all-new-fiches.js` verifies those 12 exist then POSTs `/api/generate-fiche/:id` via HTTP.
  - `scripts/generate-new-products.js` generates static fiches for IDs `prod_50..61` directly from DB without hitting the API.
  - `scripts/regenerate-all-fiches.js` rebuilds all fiches by hitting `/api/generate-fiche/:id` for each product; `regenerate-fiches-top.js` limits to `top_du_mois`.
  - `scripts/set-top-decembre.js` toggles `top_du_mois` via PUT `/api/produits/:id`; payload must include every field from the GET response.
  - `scripts/verify-database-state.js` prints sample products and integrity checks (spaces in links, lower-case categories, absolute image paths, etc.).
  - `quick-check.js` sanity-checks DB connectivity and product presence using the default credentials/database.
- Data seeding: bulk JSON inserts live in `backend/gestion_produits.sql`; package scripts mention `backend/schema.sql` but the repo mainly provides this populated dataset.
- Frontend assets: build with `npm run build:css` (Clean-CSS) and `npm run build:js` (Terser). Minified files overwrite counterparts in `frontend/public/assets`; `npm run clean` removes existing `*.min.*`.
- Running: `npm start` for prod, `npm run dev` with nodemon. Server binds `0.0.0.0` and defaults to port 3000.
- Fiche filenames are slugified from `product.nom` (non-alphanumeric → `-`, lowercased). Category folder uses `categorie` lowercased with spaces → `-`; ensure DB values are consistent before generation.
- Images are expected in `frontend/public/assets/images/`; when storing `image`, avoid prefixing with `assets/images/` (generation adds it). Missing images fall back to placeholder.
- Keep `slugToTitreAffiche()` at the end of `server.js` in mind: when `titre_affiche` is absent, POST generation will prettify the slug for display.
- If you add middleware or routes, place new API endpoints before the generic static handlers to avoid shadowing.

Feel free to ask for clarifications or additions if any workflow is unclear or missing.
