# Repository Instructions

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
