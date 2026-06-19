# Basecamp — Project Conventions

Basecamp is a coliving fit explorer. This file defines how we build it. Read it
before making changes.

## Stack

- **Next.js (App Router)** + **TypeScript** — `app/` directory, React Server
  Components by default.
- **Tailwind CSS v4** — CSS-first config via `@theme inline` in `app/globals.css`.
- **shadcn/ui** (radix primitives) — add components with
  `pnpm dlx shadcn@latest add <name>`. Configured in `components.json`.
- **next/font** — Geist (UI sans), Geist Mono (mono), Fraunces (display/headings).
- **Package manager: pnpm.** Use `pnpm`, not `npm`/`yarn`.

## Design tokens, not defaults

Design tokens are the single source of truth and live in
[`app/styles/tokens.css`](app/styles/tokens.css). `app/globals.css` maps them onto
Tailwind's utility namespaces.

- **Always** use semantic token-backed utilities (`bg-background`, `text-foreground`,
  `bg-primary`, `text-muted-foreground`, `border`, `rounded-lg`, `text-3xl`,
  `font-display`, `px-gutter`, `py-section`, `gap-stack`).
- **Never** use raw Tailwind palette colors (`bg-zinc-50`, `text-slate-600`, …) or
  hardcoded hex/rgb/oklch values in components.
- Need a new color, size, or spacing step? Add it to `tokens.css` first, map it in
  `globals.css`, then consume the utility. Don't one-off it in a component.
- Colors are authored in **oklch**. Light + dark themes are both token-driven; dark
  is toggled by the `.dark` class on `<html>` (set pre-paint in `app/layout.tsx`).

## Aesthetic

Calm and premium: warm-neutral stone surfaces, deep ink text, a single restrained
sage accent, generous radii, airy line-heights. Keep it quiet — restraint over
decoration.

## Accessibility — WCAG 2.1 AA baseline

- Text contrast ≥ 4.5:1 (≥ 3:1 for large text); non-text/UI contrast ≥ 3:1.
- Keep the visible `:focus-visible` ring (defined in `globals.css`); never remove
  focus outlines without an equivalent indicator.
- Use semantic HTML and correct heading order; label interactive elements; ensure
  full keyboard operability; respect `prefers-reduced-motion`.

## Dependencies

**Ask before adding any new dependency.** Prefer the platform, existing deps, and
shadcn/ui primitives first. If a new package is truly needed, propose it (what,
why, alternatives considered) and wait for approval. pnpm build scripts are
opt-in — approvals are tracked in `pnpm-workspace.yaml`.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):
`type(scope): summary` — e.g. `feat(explorer): add filter panel`,
`fix(tokens): correct dark border contrast`, `chore: scaffold project`. Common
types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `test`.

**No AI attribution.** Never add a `Co-Authored-By` trailer or any
"Generated with Claude Code" / Claude attribution to commit messages.

## Scripts

- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm lint` — ESLint
