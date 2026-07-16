# Feature Layer Instructions

## Purpose

- Treat each direct child of `src/features/` as an independent UI module.
- Keep feature code focused on presentation and UI orchestration. A feature may contain React components, feature-specific hooks, local state stores, form schemas, context providers, and UI orchestration logic.

## Dependency boundaries

- Do not import one business feature from another business feature.
- Features may depend on `src/core/`, `src/domains/`, and `src/features/shared/` when those dependencies respect the responsibilities of those layers.
- Use `src/features/layout/` only for application-shell concerns such as global page structure, navigation, and shell-level composition.
- Use `src/features/shared/` only for cross-cutting React code that is genuinely reused by multiple features.

## Shared feature placement

Appropriate candidates for `src/features/shared/` include:

- Shared error states and loading overlays.
- Reusable presentational components.
- Hooks that coordinate multiple domains for UI use.
- Global UI stores, such as notifications or draft status.

Do not use `src/features/shared/` as a general-purpose dumping ground. Keep code in its owning feature while only that feature uses it. Move code into `src/features/shared/` only after reuse by multiple features is real; do not move code there for hypothetical future reuse.

When adding or moving feature code, verify that its imports preserve these boundaries.
