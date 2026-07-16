# Domain Layer Instructions

## Purpose

- Treat each direct child of `src/domains/` as a business data module.
- Keep domains data-only, reusable, and independent of presentation concerns.

A domain may contain:

- Domain types, schemas, and validation.
- API requests, repositories, and data-access functions.
- Query keys and cache-related configuration.
- Data mapping and normalization.
- Thin query and mutation hooks.
- Business rules that operate on domain data without UI behavior.

## Hooks

- Keep domain hooks thin: compose data access, caching, and domain transformations, then return data and operation state.
- Do not show notifications, navigate, open dialogs, render UI, or manage presentational state from domain hooks.
- Let features decide how loading, errors, success, and user interaction are presented.

## Dependency boundaries

- Domains may depend on `src/core/` infrastructure.
- Never import from `src/features/` into `src/domains/`.
- Do not place React components, styling, form presentation, or UI orchestration in a domain.
- Keep code with its owning domain unless a genuinely infrastructure-level abstraction belongs in `src/core/`.

When adding or moving domain code, verify that its imports preserve these boundaries.
