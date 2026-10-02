# Repository Instructions

## Project and instruction scope

- Tic Tac Dunk is a basketball grid puzzle application, built with Next.js App Router, React, TypeScript, TanStack Query, next-intl, SCSS modules, and PostgreSQL/Supabase. Prisma owns the database schema, migrations, and generated client used by data tooling.
- This file applies to the project rooted beside `package.json`. Run project commands from this directory, not its parent workspace directory.
- Before editing a layer, read its nested instructions: [core](src/core/AGENTS.md), [domains](src/domains/AGENTS.md), [features](src/features/AGENTS.md), or [server](src/server/AGENTS.md). More specific instructions apply within their directories, including the server naming exception.
- Keep this file focused on the project map and shared conventions; keep detailed layer rules in the nested files.

## Application structure

| Location                     | Responsibility and placement guidance                                                                                                                                                                                                        |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/`                   | Next.js entry points. Localized pages and layouts live under `[locale]/`; API routes live under `api/`. Keep pages focused on metadata and feature composition, and API routes focused on controller exports and route configuration.        |
| `src/assets/`                | Assets imported by source code, currently SVGs and their TypeScript declarations. SVG imports are configured through SVGR. Use `public/` for files served directly by URL.                                                                   |
| `src/core/`                  | Shared infrastructure: HTTP client, environment configuration, providers, i18n, fonts, global styles, constants, utilities, and database client setup. Keep new core abstractions independent of features and domains.                       |
| `src/domains/`               | Business data modules such as `grid/` and `player/`: shared contracts and DTOs, browser HTTP requests, and thin query hooks. No UI or direct database access.                                                                                |
| `src/features/`              | User-facing modules such as `home/` and `daily-puzzle/`: components, styles, interaction state, and UI orchestration. Reused UI lives in `shared/`, reusable controls in `shared/ui/`, and current application layouts in `shared/layouts/`. |
| `src/server/`                | Backend business modules such as `grid/`, `player/`, and `team/`. Controllers handle HTTP concerns, services own workflows, repositories own database queries, and helpers support backend logic.                                            |
| `src/proxy.ts`               | Next.js request proxy entry point for locale routing.                                                                                                                                                                                        |
| `messages/`                  | Locale message catalogs used by next-intl. Update the relevant catalogs when changing translated copy.                                                                                                                                       |
| `prisma/`                    | Database schema, SQL migrations (including database functions), seed scripts, and seed data. Generated Prisma code goes to `src/core/generated/prisma/`.                                                                                     |
| `supabase/`                  | Local Supabase configuration.                                                                                                                                                                                                                |
| `scripts/`                   | Command-line workflow entry points, currently daily puzzle generation. Scripts call server services and own environment setup, output, and exit behavior.                                                                                    |
| `src/core/database/scripts/` | Existing NBA data transformation scripts, with source and transformed datasets under `data/`.                                                                                                                                                |

## Dependency and request flow

```text
Page / layout → feature UI → domain hook / request → core HTTP client
                                                     ↓ HTTP
API route → controller → service → repository → database
                           ↑
                      CLI script
```

- Features may use domains, browser-safe core infrastructure, and shared UI. Do not import one business feature into another.
- Domains may use browser-safe core infrastructure; they must not import features, app entry points, or server modules.
- Server modules may use core infrastructure and environment-neutral domain contracts or pure rules. Import contracts directly rather than through barrels that also export browser hooks or requests.
- Keep core independent of domains and features. Existing business-specific helpers in core are not a precedent for placing new business logic there.
- Browser code reaches backend workflows through HTTP endpoints. Keep `src/server/`, `src/core/supabase/server.ts`, and `src/core/constants/EnvServer.ts` out of browser import chains; preserve `server-only` guards.
- Keep business logic out of route files, HTTP response construction out of services, and database queries in repositories.
- Use the `@/` alias for imports rooted at `src/`. Reuse existing route constants, query keys, providers, and UI components before adding equivalents.

## File and folder naming

- Always use PascalCase for file names, for example `GridService.ts`.
- Always use kebab-case for folder names, for example `grid-service` and `player-stats`.
- Preserve exact names required by frameworks or tooling, such as `route.ts`, `page.tsx`, `package.json`, and `AGENTS.md`.

## Git prohibition

- Never run any Git command in this repository, including read-only Git commands.
- Never stage, commit, amend, push, pull, fetch, merge, rebase, reset, restore, checkout, switch, stash, tag, or create branches.
- Never modify files inside `.git` or use another tool to perform Git operations indirectly.
- Do not ask for permission to perform Git operations. Leave all Git work to the user.

## Allowed work

- Only read, inspect, create, and edit project files requested by the user.
- Use non-Git filesystem and text-search tools when inspecting the project.
- Do not run commands that change repository history, the Git index, remotes, branches, or working-tree state through Git.
- After editing, report which files changed and leave them unstaged and uncommitted.

## Service exports

- Export services as named camelCase objects containing their functions, for example `export const gridService = { generateGrid, generateAndValidate };`.
- Keep service functions local and call them through the exported service object.

## Development and validation

Use pnpm; `package.json` is the source of truth for available scripts.

| Command                | Purpose                                                                      |
| ---------------------- | ---------------------------------------------------------------------------- |
| `pnpm dev`             | Start the Next.js development server.                                        |
| `pnpm lint`            | Run ESLint.                                                                  |
| `pnpm typecheck`       | Check application TypeScript types.                                          |
| `pnpm typecheck:seed`  | Check seed script types.                                                     |
| `pnpm build`           | Validate the production build when relevant to the change.                   |
| `pnpm prisma:generate` | Regenerate the Prisma client after schema changes.                           |
| `pnpm scss-types`      | Generate SCSS module declarations when needed for style changes.             |
| `pnpm daily:generate`  | Generate and persist a daily puzzle; this writes to the configured database. |

- Run checks appropriate to the change and report results or blockers. There is currently no `test` script; do not claim automated tests ran when only lint or type checking ran.
- For documentation-only changes, verify paths, commands, and consistency with nested instructions; application builds are unnecessary.
- Do not hand-edit generated Prisma code, `.next/`, or dependency contents. Change source files and use the relevant generator.
- Keep credentials in environment configuration and out of source, browser bundles, and logs. Consult `.env.example` for configuration names.
- Database seeding, migrations, dataset generation, and daily puzzle generation are data-changing operations, not routine validation commands. Run them only when required by the requested work.
- Some README data-generation paths predate the move to `src/core/database/scripts/`; use the current package scripts and actual file locations.
