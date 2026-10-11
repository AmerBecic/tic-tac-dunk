# Server Layer Instructions

## Purpose

- Treat each direct child of `src/server/` as a backend business module, such as `src/server/grid/`.
- Own backend business workflows, database access, generation, validation requiring database data, and persistence here.
- Keep services reusable by application API routes and command-line scripts.

## File and folder naming

- Within `src/server/`, use lowercase kebab-case names with dot-separated role suffixes instead of the repository's default PascalCase file naming.
- Name service files `<name>.service.ts`, using the singular `.service` suffix, for example `grid.service.ts` and `daily-puzzle.service.ts`.
- Name helper files `<name>.helpers.ts`, for example `grid.helpers.ts`.
- Name controller files `<name>.controller.ts`, for example `grid.controller.ts` and `daily-puzzle.controller.ts`.
- Name repository files `<name>.repository.ts`, for example `grid.repository.ts` and `daily-puzzle.repository.ts`.
- Name backend type files `<name>.types.ts`, for example `team.types.ts` and `match.types.ts`.
- Keep folder names in kebab-case and preserve required filenames such as `AGENTS.md`.
- Keep exported service object names in camelCase, such as `gridService` and `dailyPuzzleService`.

## Structure

- Shared API contracts and the generated database schema live in `src/server/types/`, with `<name>.types.ts` filenames. Browser and domain code may import shared API contracts from this directory using `import type` only; keep these contracts free of server runtime dependencies.
- Shared server error classes and HTTP error handling live in `src/server/errors/`. The browser HTTP error class remains in core.

- Put service functions and workflow orchestration in `<domain>/services/`.
- Put HTTP request handlers in `<domain>/controllers/`.
- Put supporting backend helpers in `<domain>/helpers/`.
- Put the data access layer (DAL) in `<domain>/repositories/`; keep generic infrastructure in `src/core/`.
- Put database table aliases (`Row`, `Insert`, and `Update`) in `<domain>/types/`, grouped by module. Import the generated schema from `src/server/types/database.types.ts`; do not add handwritten aliases to that generated file.
- For example, `grid/services/grid.service.ts` generates and validates grids, while `grid/services/daily-puzzle.service.ts` finds or creates and saves the daily puzzle.
- Browser HTTP clients belong in `src/domains/<domain>/requests/`, not in this layer.

## Repositories (DAL)

- Keep direct Supabase/PostgREST queries (`.from(...)`) and database RPC calls (`.rpc(...)`) in repositories.
- Repositories accept a database client, execute queries, and return data and database errors. Preserve error codes needed by services, such as unique-constraint violations.
- Keep query-specific result types and query result mapping in repositories; reusable database table aliases belong in the module's `types/` folder, and shared business and API contracts remain in domains.
- Export named camelCase repository objects, such as `gridRepository` and `dailyPuzzleRepository`, containing local functions.
- Services call repositories and own business decisions, generation retries, validation of business rules, and recovery from concurrent creation.
- Repositories must not import services or controllers, construct HTTP responses, choose HTTP status codes, or handle UI and process behavior.
- Follow the dependency flow: route → controller → service → repository → database. Scripts call services directly.

## Service exports

- Keep service functions local and expose them through a named camelCase object, for example `export const dailyPuzzleService = { generateDailyPuzzle };`.
- Call services through that object rather than exporting their functions individually.
- Accept database clients and other required dependencies as arguments where practical so controllers and scripts can supply them.

## Entry points and errors

- Keep `route.ts` entry points in `src/app/api/` thin: import named controller functions and assign them to HTTP method exports, for example `export const GET = generateGrid;`.
- Keep framework route configuration such as `runtime`, `dynamic`, and `maxDuration` in `route.ts`.
- Controllers handle request parsing, input validation, endpoint authorization, service calls, and HTTP response construction, including status codes and headers.
- Export controllers as named handler functions. The service object export convention applies to services, not controllers.
- Controllers delegate business workflows and database operations to services; services must not depend on controllers.
- Keep command-line entry points in `scripts/`. Scripts handle arguments, environment setup, output, and process exit codes, then call services.
- Services return data or typed failure results, or throw errors for callers to handle. Do not construct `NextResponse` objects or choose HTTP status codes in services.
- Do not terminate the process, render UI, navigate, or show notifications from services.
- Keep private database diagnostics available to server-side callers; controllers must choose safe messages for HTTP responses.

## Dependency boundaries

- Server modules may depend on `src/core/` infrastructure and shared domain types, constants, schemas, and pure rules.
- Prefer direct imports from domain contract files rather than barrels that also export browser hooks or request clients.
- Never import from `src/features/` or `src/app/`, or import browser request clients and React hooks into server modules.
- Browser components and domain hooks must access backend workflows through HTTP endpoints, not imports from `src/server/`.
- Keep generic database client setup in `src/core/`; keep business-specific queries and persistence in `src/server/`.

When adding or moving server code, verify that its imports preserve these boundaries and that both API and script callers still work.
