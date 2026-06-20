# Basecamp

**An honest coliving fit explorer.** An AI agent structures the messy, scattered data about coliving spaces — and the product is the experience that makes it trustworthy and usable.

> **Live demo:** [LIVE URL] &nbsp;·&nbsp; A design-engineering prototype: design and code, in one motion.

<!-- Screenshots: drop 1–2 here once deployed, e.g.
![Basecamp explorer](./docs/explorer.png)
-->

---

## Why

I work remotely and move between places, and choosing a **coliving** is a surprisingly bad experience. The information is scattered across listing sites, reels, forums and stale reviews, and the questions that actually decide it — *real all-in price, wifi good enough for calls, the kind of community, can I actually focus and work here* — are the ones no listing answers honestly. You do hours of detective work and book on a hunch.

## The insight

The two things that decide a coliving — **community** and **how well you can focus and work** — are *subjective*. The place that's perfect for a social founder is wrong for a heads-down builder. So the product can't crown a single "best." Its job is to make the **differences legible** and match each person to what they value.

## Design & product decisions (the interesting part)

This is a design-engineering piece, so the decisions matter more than the stack:

1. **Transparent fit score, never a bare number.** Each score carries a tier word (Strong / Good / Fair) and a ledger of the signed factors that produced it — `+ balanced rhythm +19`, `− ~$85 over budget −9`. The reasoning *is* the feature; the number is just the entry point.
2. **The best match is featured.** The product ranks by fit, so the top result gets a quiet *"Best match for you"* lead treatment — the recommendation is legible at a glance, not buried in a uniform list.
3. **Distribution over average.** Instead of one star rating, each card shows the *spread* — a focus-leaning review next to a social-leaning one — plus an explicit *"great for / not for."* Subjectivity becomes the product, not a thing to hide.
4. **Honest uncertainty.** Thin data is labelled (`Limited data · 6 reports` vs `Verified · 24 reports`) instead of faking confidence. Surfacing the bad is deliberate — it's what earns trust.
5. **Cold-start is first-class.** A strict profile with no strong matches shows a calm, intentional empty state — never a grid of weak results dressed up as good ones.
6. **Restraint.** Editorial typography (Fraunces + Geist), a warm-stone + sage system, design tokens as the single source of truth, and exactly one purposeful motion beat (the score reveal). Premium through type and space, not decoration.

## How it would use Output.ai

Basecamp's interface is the front of a pipeline I'd build on [Output.ai](https://output.ai) — an open-source TypeScript framework for AI development (prompts, evals, tracing, durable execution, built for Claude Code). The mock dataset here simulates that agent's structured output:

- **Durable execution** → resumable crawl/refresh of listings, reviews and socials.
- **Prompts + structured outputs** → normalize chaos into the `Coliving` schema.
- **RAG + citations** → every claim grounded to a source.
- **Evals** → gate data quality and keep fit scores honest. At a real boundary I'd validate agent output before trusting it.

## What I'd measure

- **Time-to-decision** — hours of detective work → minutes.
- **Fit-score accuracy** — predicted fit vs a coliver's *actual* post-stay rating (a real eval loop).
- **Booking confidence / conversion.**

## Built with

- **Next.js (App Router) · TypeScript · Tailwind v4 · shadcn/ui (bent to tokens) · Framer Motion**
- **Design tokens** (oklch) as the single source of truth — light + dark, **WCAG 2.1 AA** verified by computed contrast.
- **Pure, typed fit logic** (`lib/fit.ts`) and a mock dataset standing in for an Output.ai agent.
- **AI-native workflow** — built with Claude Code against conventions in [`CLAUDE.md`](./CLAUDE.md) and a [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md). The design and product decisions are mine; AI accelerated the implementation, and every diff was reviewed.

## Run locally

```bash
pnpm install
pnpm dev   # http://localhost:3000
```

## Scope

A focused prototype of the hero experience.

**In:** profile → explorer → transparent fit score → distribution of experiences → confidence + empty states → responsive → accessibility → one motion beat.
**Out (intentionally):** auth, real crawling/agent, booking flow, multi-city, operator dashboard, runtime schema validation — noted as the boundaries I'd build next.

---

Designed & built by **Agustina De Adamo** — [agustinadeadamo.dev](https://agustinadeadamo.dev) · [GitHub](https://github.com/agustinadeadamo)
