import type { Metadata } from "next";
import Link from "next/link";

import { PrintButton } from "@/components/notes/print-button";

export const metadata: Metadata = {
  title: "Design engineering, and a product I’d build with Output.ai — Agustina De Adamo",
  description:
    "How I work as a design engineer, and Basecamp: a product I’d build with Output.ai to make choosing a coliving honest.",
};

export default function NotesPage() {
  return (
    <main className="mx-auto w-full max-w-[44rem] flex-1 px-gutter py-12 md:py-20">
      <header className="mb-12 md:mb-16">
        <div className="flex items-center justify-between gap-4" data-print-hidden>
          <Link
            href="/"
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            ← Basecamp
          </Link>
          <PrintButton />
        </div>

        <p className="mt-10 text-sm font-medium tracking-wider text-muted-foreground uppercase">
          GrowthX · Notes
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
          Design engineering, and a product I’d build with Output.ai
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
          Two parts: how I work as a design engineer, and Basecamp — a product I’d build with
          Output.ai to make choosing a coliving honest.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t pt-5 text-sm text-muted-foreground">
          <span className="text-foreground">Agustina De Adamo</span>
          <span aria-hidden>·</span>
          <span>June 2026</span>
          <span aria-hidden>·</span>
          <span>8 min read</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 text-sm">
          <a
            href="https://agustinadeadamo.dev"
            className="text-primary underline-offset-4 hover:underline"
          >
            Portfolio
          </a>
          <a
            href="https://github.com/agustinadeadamo"
            className="text-primary underline-offset-4 hover:underline"
          >
            GitHub
          </a>
        </div>
      </header>

      <article className="article">
        <h2>Part A — My story</h2>
        <p>
          <span className="dropcap">I</span>’m a design engineer in the most literal sense: I design and I code, and the seam
          between those two things is where I do my best work. I don’t hand off a Figma file and
          wait, and I don’t write code from someone else’s spec without an opinion about how it
          should look and feel. I do both, in one motion, because the truth of an interface only
          shows up when it’s running in a browser. A static frame can’t tell you how a transition
          feels, where a layout breaks at an awkward width, or whether a loading state was an
          afterthought. So I’d rather build the real thing and look at it.
        </p>
        <p>
          That didn’t start as a strategy. I trained as a graphic designer at the University of
          Buenos Aires, and for years I assumed design and engineering were two separate careers
          you had to choose between. The more I built, the more obvious it became that the
          interesting problems live exactly where they overlap. So I stopped choosing. For 6+ years
          I’ve shipped production React, TypeScript and modern CSS for US startups and e-commerce,
          but I never stopped being a designer — the UI I imagine shapes the data model, and what’s
          cheap or expensive to build quietly reshapes the design.
        </p>
        <p>
          One honest note, because it’s relevant: my most recent title was “founding product
          engineer,” not “design engineer.” I think that’s an asset. Design engineering is the
          discipline I practice — taste, interaction, motion, the craft layer — but I learned it
          while owning outcomes, not just surfaces. As a founding engineer I sat next to the founder
          and the customer, took vague problems through discovery, design, shipped code, and the
          metrics afterward. That’s the forward-deployed posture this role describes. So I’m not a
          designer who gets lost when a project touches a data model or a deadline, and I’m not an
          engineer who treats design as decoration. I’m a design engineer who can be handed an
          ambiguous brief and trusted with the whole arc — the pixels and the outcome.
        </p>

        <p>A few things I’ve built:</p>
        <ul>
          <li>
            At <strong>Firstleaf</strong>, an internal reusable component library used by 15+
            engineers — the composable pieces that let a whole team ship consistent, polished UI
            without reinventing it. I also worked on a checkout refactor that lifted conversion by
            10%, validated with A/B testing on a platform serving thousands of users.
          </li>
          <li>
            As founding product engineer at <strong>Jan-Way</strong>, I owned features end to end —
            from a vague problem to shipped, accessible UI in React/Next.js, including motion and
            the empty/error states most people skip. I built reusable component patterns and
            configuration wizards others built on, shipped 6+ operational dashboards used by
            product, ops and execs, and led a product designer and a junior engineer.
          </li>
          <li>
            <strong>Whetstone</strong>, my AI side project, is where I learned what designing around
            AI means. It grades spoken and written answers in real time. The model isn’t a text box
            — it’s a probabilistic system. So I built the grading pipeline with structured outputs,
            repair logic and regression evals to keep feedback stable as prompts change, added RAG
            to keep it grounded, and designed the streaming UI so a non-deterministic system still
            feels trustworthy.
          </li>
        </ul>

        <p>
          I’m AI-native in the literal sense: I live in Claude Code and Cursor, and I have opinions
          on getting production-quality output from them. At Jan-Way I built the enablement too — a
          shared prompt library, AI workflows and standards connected via MCP, so the team moved
          faster at a consistent bar. The floor on execution is rising fast; the part that still
          differentiates is taste, judgment, and the craft AI can’t supply. That’s the half of the
          job I’d want to set the bar on for a team — and the reason a forward-deployed studio is
          exactly where I want to be: close to clients, short loop from idea to shipped, owning the
          design and the code.
        </p>

        <h2>Part B — A product I’d build with Output.ai</h2>
        <p>
          <strong>The problem (a personal one).</strong> I work remotely and move between places,
          and one of the worst experiences in that life is choosing a coliving. The information is
          scattered across listing sites, reels, Nomads forums and stale reviews, and the questions
          that actually matter — good enough wifi for calls? real all-in price? my kind of community
          or a party hostel? can I actually focus and work here? — are the ones no listing answers
          honestly. You do hours of detective work and still book on a hunch.
        </p>
        <p>
          From my point of view two dimensions decide almost everything: what the community is like,
          and how well I can concentrate and work there. And that’s the real design problem — those
          are the subjective dimensions. The place that’s perfect for a social, party-leaning
          founder is wrong for someone in a heads-down sprint. Every coliver has their own
          definition of “good,” so the product can’t crown a single “best.” Its job is to make the
          differences legible and match each person to what they value.
        </p>
        <p>
          <strong>Why Output.ai fits.</strong> The hard part isn’t generating text — it’s turning
          messy, untrustworthy context into structured, grounded data. Output.ai is an open-source
          TypeScript framework for exactly that: prompts, evals, tracing, cost tracking, security
          and durable execution, built for Claude Code. Durable execution runs resumable
          crawl/refresh pipelines over listings, reviews and socials. Prompts + structured outputs
          normalize chaos into a consistent schema (wifi, true all-in price, calls-friendly hours,
          community signal). RAG with citations ties every claim to a source. Evals gate quality —
          does the extracted price match the source? is “great for focus” supported or inferred? —
          so nothing regresses silently when a prompt changes. The agent produces the data; my job
          is the experience that makes people trust it and act on it.
        </p>
        <p>
          <strong>The product — “Basecamp” — and the design decisions behind it.</strong> This is
          the part I care about, so let me be specific about the calls I’d make and why:
        </p>
        <ul>
          <li>
            <strong>The fit score is transparent, never a magic number.</strong> A black-box “94%
            match” is worthless — nobody books a month of their life on a number they can’t
            interrogate. So the score is always shown as the +/− factors that produced it, weighted
            by what this user said they care about: “+ quiet mornings, + calls-friendly 180 Mbps, −
            14-night minimum, − 35 min from town.” The reasoning is the feature; the number is just
            the entry point. This is the same principle I used in Whetstone — an AI verdict you
            can’t see the basis for is one users stop trusting fast.
          </li>
          <li>
            <strong>Distribution over average — turn subjectivity into the product.</strong> A
            single 4.3★ flattens exactly the signal that matters. Instead I’d show the spread: the
            focus-friendly review sitting next to the party one, and an explicit “great for / not
            for” read (“great for deep-work stretches; not for people who want nightlife at the
            door”). The goal isn’t to declare a winner, it’s to help you recognize your fit. That’s
            an information-design decision as much as a UI one.
          </li>
          <li>
            <strong>Citations and honest uncertainty.</strong> Every claim carries a source chip —
            hover and you see the quote and the link. And when the data is thin, the UI says so
            (“wifi: 1 report” vs “verified, 12 reports”) instead of faking confidence. Surfacing the
            bad (loud at night, surprise cleaning fee) prominently is a deliberate, anti-marketing
            stance — it’s what earns trust, and it’s the opposite of every listing site, which is
            the whole point.
          </li>
          <li>
            <strong>Onboarding that doesn’t tax you.</strong> The profile that powers the fit score
            is 3–4 questions, progressive, answerable in under a minute (budget, timezone for calls,
            need-quiet vs want-community, stay length). Friction here kills the product before it
            starts, so the first interaction has to feel like relief, not a form.
          </li>
          <li>
            <strong>Designing for cold start and thin data.</strong> Real agent output is uneven —
            some spaces have rich data, some barely any. So I’d design the empty and low-confidence
            states as first-class, not afterthoughts: a half-known coliving should still feel
            intentional, clearly marked as “we don’t know enough yet,” never a broken card. How a
            product handles missing data is, to me, a senior tell.
          </li>
          <li>
            <strong>One moment of motion, with purpose.</strong> The score-and-reasoning reveal is
            the emotional beat of the whole thing, so that’s where I’d spend the Framer Motion
            budget — a calm, fast reveal that aids comprehension. Everywhere else, motion stays out
            of the way. Perceived performance and 60fps are part of trust, not garnish.
          </li>
        </ul>
        <p>
          <strong>How I’d validate it — as a product engineer, not just a designer.</strong> I’d
          start with real research (interview nomads on how they actually decide and what current
          tools hide), map the core flow (profile → search → compare → trust → book), and find the
          exact moment people lose confidence and drop — because that’s where the design has to be
          strongest. Then I’d instrument from day one, because I don’t ship what I can’t measure.
          The metrics I’d own: time-to-decision (hours of detective work → minutes), fit-score
          accuracy (predicted fit vs a coliver’s actual post-stay rating — a real eval loop that
          improves the model over time), and booking confidence / conversion. I’d start from
          Shadcn, bend it, ship a rough explorer for one city to a handful of real nomads (me
          included), and iterate on signal, not assumptions. And because the data is probabilistic,
          the evals that keep the fit scores honest are a first-class feature: the day people stop
          trusting the numbers, the product is dead.
        </p>
        <p>
          <strong>Who it’s for, and the business angle.</strong> Primary user: remote workers
          choosing where to live next. But there’s a clean B2B/GTM extension that’s squarely
          GrowthX’s world — coliving operators need to grow, and most market with generic copy and
          stale listings. The same Output.ai pipeline that structures a space’s real strengths can
          power their landing pages, SEO and trust signals. Same engine, two audiences: nomads who
          need clarity, operators who need growth.
        </p>

        <blockquote>
          <p>
            That’s the through-line of how I work: an agent can generate a thousand data points
            about a place, but it’s the experience around it — the taste, the honesty, the craft —
            that decides whether anyone trusts it enough to pack a bag. That’s the part I want to
            own.
          </p>
        </blockquote>

        <hr />

        <p>
          <strong>Prototype — Basecamp:</strong> live demo at{" "}
          <a href="https://basecamp-snowy.vercel.app">basecamp-snowy.vercel.app</a> · source at{" "}
          <a href="https://github.com/agustinadeadamo/basecamp">
            github.com/agustinadeadamo/basecamp
          </a>
          .
        </p>
        <p>
          Thanks for reading. My shipped work — including Whetstone — is on my{" "}
          <a href="https://agustinadeadamo.dev">portfolio</a> and{" "}
          <a href="https://github.com/agustinadeadamo">GitHub</a>.
        </p>
      </article>
    </main>
  );
}
