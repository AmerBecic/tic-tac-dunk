# Domain Layer Instructions

## Purpose

- Treat each direct child of `src/domains/` as a business data module.
- Keep domains data-only, reusable, and independent of presentation concerns.
- Domains define shared business contracts and browser-side data access. Backend execution belongs in `src/server/`.

A domain may contain:

- Domain types, schemas, and validation.
- Browser HTTP request functions in `requests/`, using the shared HTTP client from `src/core/`.
- Query keys and cache-related configuration.
- Data mapping and normalization.
- Thin API query and mutation hooks, without business logic.
- Pure business rules that are safe to share between browser and server code.

## Organization and naming

These conventions override the root PascalCase filename default within domains. Use `grid/` and `player/` as the reference structure; keep domain and folder names in kebab-case.

| Location / pattern                           | Purpose and examples                                                                                                                                                                                                                      |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<domain>/types/<domain>.types.ts`           | Shared domain models and related types, such as `grid.types.ts` and `player.types.ts`.                                                                                                                                                    |
| `<domain>/types/<operation>.request.dto.ts`  | API request contracts, with lowercase dot-separated operation words, such as `get.players.request.dto.ts`.                                                                                                                                |
| `<domain>/types/<operation>.response.dto.ts` | API response contracts, such as `get.players.response.dto.ts`, `get.daily.puzzle.response.dto.ts`, and `generate.grid.response.dto.ts`.                                                                                                   |
| `<domain>/types/<operation>.ts`              | A small, closely related contract group may share one lowercase dot-separated file, as in `validate.answer.ts` for `ValidateAnswerRequest` and `ValidateAnswerResponse`. Follow the existing grouping when extending an operation.        |
| `<domain>/types/<domain>.constants.ts`       | Shared domain constants, such as `grid.constants.ts`. Keep these safe to import on both browser and server.                                                                                                                               |
| `<domain>/requests/<Domain>Api.ts`           | HTTP request functions exposed through a named PascalCase API object, such as `GridApi` in `GridApi.ts` and `PlayerApi` in `PlayerApi.ts`. Keep functions local and use camelCase method names such as `getPlayers` and `validateAnswer`. |
| `<domain>/hooks/use<Operation>.ts`           | One named API hook per file, with matching filename and export: `useGetPlayers.ts`, `useGetDailyPuzzle.ts`, or `useGenerateGrid.ts`. Use the same `use<Operation>` pattern for API mutation hooks.                                        |
| `<domain>/index.ts`                          | Optional public barrel for consumers, as in `grid/index.ts`. Do not add a barrel solely for symmetry with another domain.                                                                                                                 |

- Use PascalCase for type and interface names: `Player`, `GetPlayersRequest`, and `GetDailyPuzzleResponse`. DTO filenames include `.dto`; exported type names use `Request` or `Response` without an extra `Dto` suffix.
- Use uppercase snake case for shared constants, such as `GRID_SIZE` and `CATEGORY_TYPES`.
- Keep hook-only result types beside their hook, named `Use<Operation>Result`, such as `UseGetPlayersResult`. Shared API contracts belong in `types/`.
- Keep folders limited to what the domain needs. Do not add empty layers or put every type into a separate file.

## Requests and shared contracts

- Request functions call application HTTP endpoints; they do not access the database or invoke server services directly.
- Use `Api` from `src/core/api/Api.ts` and endpoint constants from `src/core/constants/ApiRoutes.ts`. Keep URL construction, query parameter serialization, and response unwrapping in request functions.
- Reuse shared `ApiResponse` and `PaginatedResponse` types when they match the endpoint contract. Preserve the actual wire format and pagination metadata.
- Keep shared types, response DTOs, constants, and validation independent of React hooks and browser requests so server services can reuse them.
- Place database access, repositories, puzzle generation, and persistence workflows in the corresponding `src/server/<domain>/` module.
- Keep route handlers in `src/app/api/`; domains do not create HTTP responses or choose response status codes.

## Hooks

- Domain hooks are only API fetching and mutation hooks. Use TanStack Query to call the domain's request object and expose data, loading/error state, and query or mutation controls.
- Keep hooks limited to request parameters, query keys, query options, and API cache behavior. Reuse keys from `src/core/constants/QueryKeys.ts` and include all response-changing parameters in the query key, as `useGetPlayers` does with search and pagination.
- Simple return shaping is allowed: expose `players`, `grid`, or `dailyPuzzle`, supply empty-array or null defaults, and preserve pagination and operation state.
- Do not implement business decisions, puzzle rules, multi-step workflows, or feature state in domain hooks. Put UI and interaction hooks in the owning feature; backend workflows belong in server services. Any shared pure rules must remain separate from React hooks and HTTP requests.
- Mark React Query hook modules with `'use client'`, following the existing hooks.
- Do not show notifications, navigate, open dialogs, render UI, or manage presentational state from domain hooks.
- Let features decide how loading, errors, success, and user interaction are presented.

## Dependency boundaries

- Domains may depend on browser-safe or environment-neutral `src/core/` infrastructure.
- Never import runtime code from `src/server/`, or import from `src/app/` or `src/features/` into `src/domains/`. Shared API contracts in `src/server/types/` are the only server import exception and must use `import type`.
- Do not import server database clients, privileged credentials, or Node-only dependencies into domains.
- Do not place React components, styling, form presentation, or UI orchestration in a domain.
- Keep code with its owning domain unless a genuinely infrastructure-level abstraction belongs in `src/core/`.
- Use direct sibling file imports inside a domain rather than importing its own `index.ts`; this avoids circular dependencies between contracts, constants, requests, and hooks.
- Server consumers must import shared contracts or constants directly from their files, not from a barrel that also exports client hooks or request objects. Use `import type` and `export type` for type-only dependencies.

When adding or moving domain code, verify that its imports preserve these boundaries.
