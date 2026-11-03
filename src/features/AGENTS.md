# Feature Layer Instructions

## Purpose

- Treat each business feature under `src/features/` as an independent user-facing module. `shared/` holds reusable components and behavior rather than a standalone business feature.
- Features own UI and frontend business logic: components, interaction workflows, feature-specific hooks, local state, form schemas, and context providers. Backend business workflows and authoritative validation remain in `src/server/`.

## Feature structure

Use `daily-puzzle/` as the reference for organizing a feature:

```text
daily-puzzle/
├── hooks/
│   └── useDailyPuzzleProgress.ts
├── ui/
│   ├── DailyPuzzle.tsx
│   ├── DailyPuzzle.module.scss
│   ├── criterion/
│   │   ├── Criterion.tsx
│   │   └── Criterion.module.scss
│   └── player-search-dialog/
│       ├── PlayerSearchDialog.tsx
│       └── PlayerSearchDialog.module.scss
└── index.tsx
```

- `ui/` contains the feature's main component and its supporting components. The main component composes domain data, feature hooks, shared components, and feature-specific UI.
- Give supporting components their own kebab-case folders under `ui/` when they need colocated styles or supporting files. Keep components such as `Criterion` and `PlayerSearchDialog` here while they belong only to the daily puzzle.
- `hooks/` contains UI behavior and frontend business-logic hooks. For example, `useDailyPuzzleProgress` restores and persists local progress, records submissions, prevents changes to solved cells, and derives completion state.
- Colocate styles as `<Component>.module.scss`. Keep component props and small implementation-only types beside their owner; add feature-local type or helper files only when multiple files need them.
- `index.tsx` is the existing feature public entry point. Export the main component and only the hooks or types consumers need. Internal files should import siblings directly rather than through their own barrel.
- Use this structure as a guide, not a requirement to create empty folders or reorganize small existing features without a task-related reason.

## Naming

- Use kebab-case for feature and component folders, such as `daily-puzzle/` and `player-search-dialog/`.
- Use PascalCase for component filenames and named exports, such as `DailyPuzzle.tsx` and `PlayerSearchDialog`.
- Hook filenames and exports use matching `use<Behavior>` names, such as `useDailyPuzzleProgress.ts`. This is an exception to the root PascalCase filename rule.
- Preserve existing barrel filenames such as `index.tsx`; they are also an exception to the root naming default.

## Hooks and business logic

- Domain hooks in `src/domains/` handle API fetching, mutations, and cache behavior. Feature hooks own the frontend behavior built around that data: progress tracking, derived interaction state, form workflows, browser persistence, and coordination of user actions.
- Use domain hooks or domain request objects for API access. Do not duplicate endpoint URLs or HTTP client logic in feature hooks.
- Keep behavior specific to one feature in that feature's `hooks/`. Reusable UI or frontend business-logic hooks may live in `shared/hooks/` once multiple features need them; create that folder only when needed.
- Hooks used only by one shared component may remain colocated with that component instead of being promoted to `shared/hooks/`.
- Features decide how loading, errors, success, dialogs, and navigation are presented. Keep substantial reusable behavior in hooks so components can focus on rendering and event wiring.
- Browser progress and derived state do not replace backend validation. Database access, puzzle generation, and authoritative answer validation belong in server services reached through domain API functions.
- Add `'use client'` where React state, effects, or browser APIs require a client boundary. Access browser storage in client-safe lifecycle code, following `useDailyPuzzleProgress`.

## Dependency boundaries

- Do not import one business feature from another business feature.
- Features may depend on `src/core/`, `src/domains/`, and `src/features/shared/` when those dependencies respect the responsibilities of those layers.
- Use the existing `src/features/shared/layouts/` for application-shell concerns such as global page structure, navigation, and shell-level composition.
- Use `src/features/shared/` only for cross-cutting React code that is genuinely reused by multiple features.
- Shared components and hooks must not import business feature modules. Pass feature-specific data and callbacks through props or hook arguments.
- Do not import `src/server/` into feature components or hooks, or make features depend on `src/app/` entry points.

## Shared feature placement

Distinguish UI primitives from regular shared application components:

| Location                      | What belongs here                                                                                                                                                                                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/ui/<component>/`      | **UI primitives**: foundational, reusable controls and presentation building blocks such as `Button`, `Input`, `Dialog`, `Select`, `Text`, and `Skeleton`. Keep their APIs generic and independent of business domains, fetching, and feature workflows.               |
| `shared/<component>/`         | **Shared application components**: reusable components such as `PlayersSearch`, `BasketballJersey`, `FlipTile`, `Logo`, and `ThemeSwitcher`. These may combine primitives, styling, and application-specific behavior; they may consume domain data where appropriate. |
| `shared/layouts/`             | Application shells and their supporting navigation, header, and footer components.                                                                                                                                                                                     |
| `shared/hooks/` (when needed) | Reusable UI behavior or frontend business-logic hooks used across features. API-only hooks still belong in domains.                                                                                                                                                    |

- `ui/` inside a business feature means that feature's presentation code; `shared/ui/` specifically means reusable UI primitives.
- Keep each shared component's implementation and SCSS module together in its folder, following the existing shared components. Reuse these components before creating equivalents.
- Shared error states, loading overlays, and cross-feature UI state may also belong in shared when actual reuse calls for them.

Do not use `src/features/shared/` as a general-purpose dumping ground. Keep code in its owning feature while only that feature uses it. Move code into `src/features/shared/` only after reuse by multiple features is real; do not move code there for hypothetical future reuse.

When adding or moving feature code, verify that its imports preserve these boundaries.
