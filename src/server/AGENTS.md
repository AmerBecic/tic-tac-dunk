# Server Layer Instructions

## Purpose

- Treat each direct child of `src/server/` as a backend business module, such as `src/server/grid/`.
- Own backend business workflows, database access, generation, validation requiring database data, and persistence here.
- Keep services reusable by application API routes and command-line scripts.

## Structure

- Put service functions and workflow orchestration in `<domain>/services/`.
- Put supporting backend helpers in `<domain>/helpers/`.
- Add repositories or other folders within the owning module only when needed; keep generic infrastructure in `src/core/`.
- For example, `grid/services/GridServices.ts` generates and validates grids, while `grid/services/DailyPuzzleService.ts` finds or creates and saves the daily puzzle.
- Browser HTTP clients belong in `src/domains/<domain>/requests/`, not in this layer.

## Service exports

- Keep service functions local and expose them through a named camelCase object, for example `export const dailyPuzzleService = { generateDailyPuzzle };`.
- Call services through that object rather than exporting their functions individually.
- Accept database clients and other required dependencies as arguments where practical so routes and scripts can supply them.

## Entry points and errors

- Keep HTTP route handlers in `src/app/api/`. Routes handle request parsing, endpoint authorization, and HTTP response construction, then delegate business work to services.
- Keep command-line entry points in `scripts/`. Scripts handle arguments, environment setup, output, and process exit codes, then call services.
- Services return data or typed failure results, or throw errors for callers to handle. Do not construct `NextResponse` objects or choose HTTP status codes in services.
- Do not terminate the process, render UI, navigate, or show notifications from services.
- Keep private database diagnostics available to server-side callers; API routes must choose safe messages for HTTP responses.

## Dependency boundaries

- Server modules may depend on `src/core/` infrastructure and shared domain types, constants, schemas, and pure rules.
- Prefer direct imports from domain contract files rather than barrels that also export browser hooks or request clients.
- Never import from `src/features/` or `src/app/`, or import browser request clients and React hooks into server modules.
- Browser components and domain hooks must access backend workflows through HTTP endpoints, not imports from `src/server/`.
- Keep generic database client setup in `src/core/`; keep business-specific queries and persistence in `src/server/`.

When adding or moving server code, verify that its imports preserve these boundaries and that both API and script callers still work.
