# Architecture

## Backend

- **index.js** – Express app entry; sets up middleware and `/api/sales` routes and loads the CSV once at startup.
- **utils/csvLoader.js** – Reads the CSV file, normalises fields, stores them in-memory, and computes distinct filter options.
- **services/salesService.js** – Pure functions for applying search, filters, sorting, pagination and computing summary statistics.
- **controllers/salesController.js** – HTTP layer; parses query params and calls the service.
- **routes/salesRoutes.js** – Routes for:
  - `GET /api/sales` – paged list with search/filters/sort
  - `GET /api/sales/filters` – options for filter dropdowns.

All filtering/sorting logic lives in the **service** layer (no duplication).

## Frontend

- Single-page React app using Vite.
- **SalesDashboard** page manages application state:
  - search term
  - filters
  - sorting
  - pagination
- On state change, it calls backend with query params and renders:
  - `Sidebar` – static navigation matching Figma.
  - `TopBar` – title + global search.
  - `FiltersBar` – chips for each filter & sorting dropdown.
  - `StatsCards` – total units, total amount, total discount for the filtered set.
  - `SalesTable` – transaction rows (10 per page).
  - `Pagination` – prev/next while keeping search/filters/sort state.

## Data Flow

1. User changes search/filters/sorting or clicks pagination.
2. `SalesDashboard` updates local state and re-fetches `/api/sales`.
3. Backend:
   - loads base dataset from memory,
   - applies search,
   - applies filters,
   - sorts,
   - calculates stats,
   - selects the requested page.
4. Backend returns paged data + stats + meta.
5. Frontend updates table, cards and pagination.

## Folder Structure

See tree in root README: clear separation between frontend and backend plus shared `docs/` folder.

## Module Responsibilities

- **Services**: pure business logic.
- **Controllers**: HTTP concerns only.
- **Components**: small visual units (sidebar, table, etc.).
- **Page**: orchestrates state, calls API, composes components.
- **Styles**: single `layout.css` approximating Figma layout.
