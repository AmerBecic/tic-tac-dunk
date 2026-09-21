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
- Thin query and mutation hooks.
- Pure business rules that are safe to share between browser and server code.

## Requests and shared contracts

- Request functions call application HTTP endpoints; they do not access the database or invoke server services directly.
- Keep shared types, response DTOs, constants, and validation independent of React hooks and browser requests so server services can reuse them.
- Place database access, repositories, puzzle generation, and persistence workflows in the corresponding `src/server/<domain>/` module.
- Keep route handlers in `src/app/api/`; domains do not create HTTP responses or choose response status codes.

## Hooks

- Keep domain hooks thin: compose data access, caching, and domain transformations, then return data and operation state.
- Do not show notifications, navigate, open dialogs, render UI, or manage presentational state from domain hooks.
- Let features decide how loading, errors, success, and user interaction are presented.

## Dependency boundaries

- Domains may depend on browser-safe or environment-neutral `src/core/` infrastructure.
- Never import from `src/server/`, `src/app/`, or `src/features/` into `src/domains/`.
- Do not import server database clients, privileged credentials, or Node-only dependencies into domains.
- Do not place React components, styling, form presentation, or UI orchestration in a domain.
- Keep code with its owning domain unless a genuinely infrastructure-level abstraction belongs in `src/core/`.

When adding or moving domain code, verify that its imports preserve these boundaries.
