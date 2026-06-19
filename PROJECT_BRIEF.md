# Basecamp — Project Brief & Design Decisions
> Copiar este archivo a la **raíz del repo** como `PROJECT_BRIEF.md`. Es la fuente de verdad del producto: Claude Code lo lee para alinear, y es la semilla del README/caso de estudio.

## What it is
**Basecamp** — an honest coliving fit explorer for remote workers. An AI agent (modeled as an **Output.ai** pipeline) aggregates and structures messy coliving data; the product is the **experience** that makes that data trustworthy and usable. *"The agent is only as good as the experience around it."*

## Who it's for
- **Primary:** digital nomads / remote workers choosing where to live next.
- **Secondary (business/GTM):** coliving operators who need to grow — the same structured data can power their landing pages, SEO and trust signals.

## The core insight (the reason this exists)
What decides a coliving for someone is **community type** and **how well they can focus and work** — and those are **subjective**. The place that's perfect for a social founder is wrong for a heads-down builder. So the product must **make differences legible and match each person to what they value** — never crown a single "best".

## Design decisions (non-negotiable principles)
1. **Transparent fit score, never a magic number.** Always show the **+/- factors** that produced it, weighted by the user's stated priorities. The reasoning *is* the feature.
2. **Distribution over average.** Show the spread of experiences (a focus review next to a social one) + an explicit **"great for / not for"**. Don't flatten into one star rating.
3. **Citations + honest uncertainty.** Every claim links to its source; when data is thin, say so (`thin` vs `verified`, reportsCount) instead of faking confidence. Surface the bad (loud at night) on purpose — anti-marketing builds trust.
4. **Onboarding that doesn't tax you.** Profile = 3–4 quick inputs, under a minute.
5. **Cold-start / thin data are first-class states.** A half-known coliving still looks intentional and clearly marked, never broken.
6. **Motion with purpose only.** Spend the Framer Motion budget on the score-reveal beat; everywhere else it stays out of the way. Perceived performance / 60fps is part of trust.

## How it maps to Output.ai (the framework)
Output.ai = open-source TypeScript framework for AI dev (prompts, **evals**, tracing, cost tracking, security, **durable execution**, built for Claude Code).
- **Durable execution** → resumable crawl/refresh of listings, reviews, socials.
- **Prompts + structured outputs** → normalize chaos into the `Coliving` schema.
- **RAG + citations** → every claim grounded to a source.
- **Evals** → gate data quality (extracted price matches source? "great for focus" supported vs inferred?); keep fit-scores honest. (At a real boundary: validate agent output before trusting it.)

## Success metrics (what I'd own)
- **Time-to-decision** (hours of detective work → minutes).
- **Fit-score accuracy** — predicted fit vs a coliver's *actual* post-stay rating (a real eval loop).
- **Booking confidence / conversion.**

## Scope for THIS prototype (in / out)
**In (the complete hero experience):** profile → explorer grid → transparent fit score → distribution of experiences → citations + confidence → coliving detail → empty/loading/error states → one motion beat → responsive + WCAG AA.
**Out (intentionally, would mention in README):** auth, real crawling/agent, booking flow, multi-city, operator dashboard, runtime schema validation.

## Quality bar
Design tokens (no Tailwind defaults) · shadcn bent to tokens · WCAG 2.1 AA (keyboard, focus-visible, contrast) · purposeful motion · clean Conventional Commits · README as a case study (problem → insight → decisions → Output.ai → metrics → screenshots → live link).
