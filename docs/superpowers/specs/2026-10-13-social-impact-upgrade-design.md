# Social-Impact Upgrade Design

Date: 2026-10-13
Track target: Sustainability & Social Impact
Budget: 3-5 working days
Status: approved design (user sign-off 2026-10-13)

## Problem

Two real, published weaknesses limit the project's persuasiveness for the
Social Impact track:

1. **Decision incoherence.** In the published run
   (`eval/results/runs/2026-08-30T10-53-20`), the garment worker persona
   (the most vulnerable user) received a single suggestion — Manual QA —
   with `aiResilienceScore: 42` and citations documenting a 48% YoY decline
   in Manual QA postings. The verifier checks citation *authenticity* but
   nothing checks whether the evidence *supports the recommended direction*.
2. **Unverified actionability.** Roadmap `freeResources` URLs are raw LLM
   output — never grounded against any registry. A project whose thesis is
   "no fabricated citations" currently ships fabricated-able learning links,
   and nothing measures whether advice is affordable for low-income users.

The eval also reports only aggregate means, hiding distributional quality
across worker segments (office vs industrial vs rural vs student).

## Goals

- Verifier rejects decision-incoherent recommendations and repairs them.
- Learning resources become grounded (registry-exact URLs) and cost-aware
  (cost tiers, budget fit against `intake.constraints`).
- Eval gains two metrics (`riskCoherenceRate`, `actionablePathRate`) and a
  per-segment breakdown; persona set grows 12 → 16 for segment coverage.
- New published evaluation run; changelog gains Iterations 4 and 5.

## Non-goals

- No 5th agent. Extensions land in the existing Verifier/Analyst/Gatherer.
- No new intake fields — `constraints` already flows to baseline and agent.
- The frozen baseline prompt stays byte-identical (its Vietnamese output is
  a documented fairness difference, see D.3).
- No UI intake changes; only a small roadmap cost badge.

---

## A. Decision-Coherence Checks

New pure module `src/agents/coherence.ts`, same style as `checks.ts`
(functions return `string[]` failure messages). Deterministic only — no LLM.

Inputs: `suggestions`, `evidencePack` (current-occupation matches), `intake`.

| Rule | Deterministic logic | Failure message pattern |
|---|---|---|
| C1 uplift | Let `current` = max `overallResilienceScore` across `pack.occupations` entries that matched the user's current occupation (gatherer policy looks up the user's occupation keywords first). If `current` is known: top suggestion (index 0) must have `resilienceDetail.overallResilienceScore >= current`. If unknown (no DB match, e.g. watch repairer): top suggestion must score `>= 55`. | `coherence: top suggestion resilience {X} below current-occupation floor {Y}` |
| C2 demand signal | Top suggestion `resilienceDetail.vietnamDemandSignal` must not be `'declining'`. | `coherence: top suggestion demand signal is 'declining'` |
| C3 transparency | Every suggestion: non-empty `uncertaintyRange`; every trajectory: `riskLevel` in `low|moderate|high` and non-empty `actionStepNow`. | `coherence: ...missing...` |

Wiring: `runVerifier(intake, suggestions, deps, pack)` gains the `pack`
parameter; `orchestrator.ts` passes it. Coherence failures join `failures[]`
and flow through the existing repair loop (max 2 repairs, unchanged budget).
`pack` may be `EMPTY_PACK` when `useTools=false` — C1 then applies the
unknown-occupation floor.

## B. Actionability Layer

### B1. Learning resource registry

`src/data/learningResources.ts` — curated, real, URL-resolvable entries:

```ts
interface LearningResource {
  id: string;             // e.g. 'google-it-support-cert'
  name: string;           // display name (Vietnamese-friendly)
  provider: string;       // e.g. 'Google / Coursera'
  url: string;            // canonical URL, HTTP-verified at curation time
  type: 'course' | 'certification' | 'tutorial' | 'guide';
  costTier: 'free' | 'low_cost' | 'paid';
  language: 'vi' | 'en' | 'vi_en';
  notes?: string;         // e.g. scholarship availability
}
```

Target 15-20 entries covering: digital literacy, office productivity,
data/Excel, basic programming, English for work, AI literacy, soft skills.
Curation rule: every URL verified reachable (HTTP 200) during
implementation; entry count and access date recorded in the file header.

### B2. Fourth tool

`searchLearningResources({ query: string })` in `tools.ts` — deterministic
token-overlap filter over the registry, returns matching entries (max 6).
Added to `AGENT_FUNCTION_DECLARATIONS`. Gatherer policy text gains one
line: call it when evidence collection is otherwise complete.
`MAX_TOOL_CALLS` stays 6. `mergeIntoPack` adds `pack.learningResources`.

### B3. Analyst output additions

Roadmap milestones gain required fields `costTier: 'free'|'low_cost'|'paid'`
and `estimatedCostVND: number` (0 for free). Prompt changes:

- `freeResources` entries must copy `url` exactly from the pack's
  `learningResources` — any other URL is a verification failure.
- Milestone `weeksDuration` must be realistic given
  `constraints.hoursPerWeekAvailable` and `estimatedHours`.
- At least one milestone per suggestion must fit
  `constraints.budgetVND` (free or low_cost tier).

### B4. Verifier extension

New pure check in `citations.ts` or a sibling: every `freeResources[].url`
across all suggestions must exact-match a registry URL. Failures read
`resource url not in registry: "..."` and enter the repair loop.

### B5. UI

`RoadmapModule.tsx` (or wherever milestones render): small badge per
milestone — "Miễn phí" / "Chi phí thấp" / "Trả phí" from `costTier`.

---

## D. Localization & currency (English-primary presentation)

The competition is judged in English; the product still serves Vietnamese
users. Design: English becomes the primary output/presentation language,
with Vietnamese preserved where real users need it. Vietnam market focus
(personas, occupation DB, news sources, UI toggle) is unchanged.

1. **Language parameterization.** Analyst prompt gains
   `outputLanguage: 'en' | 'vi'` (default `en` for the submission; the UI
   toggle keeps serving Vietnamese users via the existing `t()` helper).
   Narrative fields (reasoning, whyItFitsYou, skillsGap,
   transferableSkillsMatch, roadmap phaseName/title) render in the active
   language; Vietnamese occupation titles from the DB remain as
   `*Vi` mirror fields where the schema already provides them.
2. **Currency dual-display.** Fixed, documented conversion rate
   (set at implementation time, stated in README/EVALUATION, e.g.
   1 USD = 26,000 VND interbank approx) — never dynamic. Schema gains
   `averageSalaryRangeUSD` (string) and milestone `estimatedCostUSD`
   (number) alongside the VND fields. UI salary/cost displays show
   "VND (~USD)".
3. **Baseline stays frozen** (Vietnamese output). Documented in
   EVALUATION.md fairness notes as a resource difference; the eval
   personalization-judge prompt gains one line: judge content
   irrespective of language. Grounding/coherence/actionability metrics
   are language-agnostic (token normalization already strips diacritics
   symmetrically on query and corpus side).
4. **English defaults.** UI default language `en`; `AgentTransparencyPanel`
   labels and server canned responses become bilingual via `t()`; docs are
   already English. Persona `currentRole` stays Vietnamese (real input) with
   the English label carried in `EvalPersona.label`.



### C1. Persona segmentation

`EvalPersona` gains `segment: 'knowledge_worker' | 'wage_worker' |
'rural_agricultural' | 'student' | 'craft_trade'`. Existing 12 personas
tagged by inspection of `currentRole` (golden profiles included).

### C2. Four new personas

| id | currentRole | years | location | constraints (budget VND / h-week / risk) | segment |
|---|---|---|---|---|---|
| persona-receptionist | Lễ tân văn phòng | 4 | TP. Hồ Chí Minh | 1.5M / 8 / low | wage_worker |
| persona-electrician | Thợ điện công nghiệp | 10 | Hải Phòng | 3M / 8 / moderate | wage_worker |
| persona-retailcashier | Thu ngân siêu thị | 3 | Đà Nẵng | 1.5M / 10 / low | wage_worker |
| persona-agritech | Nông dân ứng dụng công nghệ | 15 | Cần Thơ | 2.5M / 12 / moderate | rural_agricultural |

Full intake profiles (skills/strengths/weaknesses) written at implementation
time in the same style as existing personas.

### C3. New metrics (eval/score.ts)

- `riskCoherenceRate`: share of ok runs whose output passes all of C1-C3,
  computed by importing the same pure coherence module the verifier uses.
- `actionablePathRate`: share of ok runs where the top suggestion has
  (a) ≥1 roadmap milestone with a registry-grounded `freeResources` url,
  (b) ≥1 non-empty `actionStepNow`, and (c) ≥1 milestone of costTier
  `free` or `low_cost`.

`aggregate()` gains both metrics plus a `bySegment` breakdown
(metric × segment table). Report tables in `EVALUATION.md` gain the two
columns and one segment table per config.

### C4. Impact framing (docs only)

README and EVALUATION gain a short table mapping the persona occupations to
Vietnam labor-force scale (GSO/ILO public figures, real citations only —
researched during implementation; if a figure cannot be sourced it is
omitted, never estimated).

---

## Evaluation rerun protocol

- Full rerun: 16 personas × 3 configs = 48 runs (~$0.20, ~35-50 min).
- New timestamped run directory becomes `latest.json`; the 2026-08-30 run
  stays as historical evidence for Iterations 1-3.
- Changelog gains **Iteration 4 (decision coherence)** — motivated by the
  published garment case — and **Iteration 5 (grounded, budget-aware
  resources)** — motivated by the unverified-URL gap.
- Honest reporting rule unchanged: failures stay failures; the old run's
  numbers are not edited.

## Testing

- Unit: `coherence.test.ts` (C1-C3 including EMPTY_PACK edge), registry
  matching for resource URLs, costTier validation, segment aggregation,
  new-persona schema. Existing 58 tests stay green; `tsc --noEmit` clean.

## Affected files

- New: `src/agents/coherence.ts`, `src/data/learningResources.ts`, tests.
- Modified: `src/agents/{verifier,tools,analyst,citations}.ts`,
  `src/agents/__tests__/*`, `src/types.ts` (costTier, estimatedCostVND),
  `eval/{personas,score}.ts`, `eval/__tests__/score.test.ts`, roadmap UI,
  `docs/{README,EVALUATION,IMPROVEMENT_CHANGELOG,REPRODUCTION_GUIDE,
  VIDEO_SCRIPT}.md`, `DEVELOPMENT-TRACKING.md`.

## Risks

- Repair-loop churn from strict C1 numeric rule: mitigated by max-2-repair
  budget; non-convergence surfaces an honest `repair` verdict.
- Registry curation time: capped at 20 entries; verified URLs only.
- Eval runtime growth (48 runs): acceptable; single sequential run.
