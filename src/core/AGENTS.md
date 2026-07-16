# Core Layer Instructions

## Purpose

- Treat `src/core/` as shared application infrastructure and the foundation for all other layers.
- Keep core code generic and independent of business concepts and feature-specific behavior.

Common core responsibilities include:

- HTTP client setup.
- Environment configuration.
- Query client setup.
- Global providers.
- Shared constants and utility functions.
- Base types used across the application.
- Framework and infrastructure configuration.

## Dependency boundaries

- Never import from `src/domains/` or `src/features/` into `src/core/`.
- Do not place domain models, business rules, feature state, or feature-specific UI in core.
- Keep utilities broadly applicable. If a helper expresses business language or is only useful to one domain or feature, place it with that owner instead.
- Keep core APIs stable and avoid making the foundation depend on its consumers.

When adding or moving core code, verify that its imports preserve these boundaries.
