# Development Tracking

## 2026-08-30 — Agentic Hackathon Submission (branch: agentic-hackathon)

Scope: transform the pre-existing La Bàn platform (snapshot commit `4c5ac25`)
into a micro1 Agentic Workflows Hackathon submission. Plan:
`docs/superpowers/plans/2026-08-30-agentic-hackathon-submission.md` (18 tasks,
all completed). Spec:
`docs/superpowers/specs/2026-08-30-agentic-hackathon-submission-design.md`.

### What was built

- **4-agent pipeline** (`src/agents/`): Profiler -> Evidence Gatherer
  (function-calling over 3 deterministic tools) -> Analyst (cite-only-from-pack)
  -> Verifier (schema + guardrail + citation grounding + LLM judge) with repair
  loop (max 2) and parse-error recovery. Orchestrator with ablation flags and
  full trajectory logging.
- **Shared Gemini client** (`src/agents/geminiClient.ts`) extracted from
  server.ts; key rotation and model fallback chain preserved.
- **Frozen baseline** (`src/agents/baseline.ts`) — verbatim legacy prompt.
- **Endpoints**: `/api/agent/career-analyze`, `/api/eval/baseline`,
  `/api/agent/health` (honest 500s, no mock fallbacks).
- **Eval harness** (`eval/`): 12 personas incl. watch-repairer challenging
  case; shared scoring with independent temperature-0 judge; HTTP runner.
- **Firebase removed** (guest mode + localStorage via `src/lib/localData.ts`).
- **UI**: suggestion flow on agent endpoint + AgentTransparencyPanel.
- **Deliverables**: README, IMPROVEMENT_CHANGELOG, REPRODUCTION_GUIDE,
  EVALUATION, TRAJECTORIES, VIDEO_SCRIPT (all English).

### Verification results (final pass, 2026-08-30)

- `npm run lint` (tsc --noEmit): 0 errors
- `npx vitest run`: 58/58 tests pass (12 files)
- `npm run build`: production build succeeds
- Server start: clean (`La Bàn Server running on http://0.0.0.0:3000`), no
  ERROR-level startup lines
- Live agent call: HTTP 200, verdict pass
- Published eval run `2026-08-30T10-53-20`: baseline 91.7% grounding /
  2 hallucinated citations vs final agent 100% / 0; 12/12 ok runs in all
  configs; cost $0.0024 -> $0.0040 per task
- Final independent code review: Ready to submit (no critical issues)

### Notable decisions

- Frozen baseline duplicated verbatim (not imported) so the legacy endpoint
  stays untouched and the comparison is provably fair.
- Verifier checks citations against the GLOBAL corpus (shared checker with
  eval) so runtime verification and measurement cannot drift.
- Parse-retry added (commit `a9e5b2e`) after an exploratory run showed
  malformed JSON killing long outputs; unit-tested, kept within the same
  repair budget.
- Firebase removed rather than isolated to a new project: no value for
  scoring, and the old project had public-write rules.
- Model note: `gemini-3.7-flash` is primary but was unavailable with our key;
  all published calls ran on fallback `gemini-3.5-flash-lite` (recorded
  per-call in trajectories).

## 2026-10-13 — Social-impact upgrade (branch: social-impact-upgrade)

Scope: extend the agent from "verifiably grounded text" to "sound, actionable
direction for exposed workers". Plan:
`docs/superpowers/plans/2026-10-13-social-impact-upgrade.md` (15 tasks,
all completed). Spec:
`docs/superpowers/specs/2026-10-13-social-impact-upgrade-design.md`.

### What was built

- **Decision-coherence checks** (`src/agents/coherence.ts`): the verifier
  rejects a top recommendation whose resilience is below the user's
  current-occupation floor (55 when unmatched) or supported by a 'declining'
  Vietnam demand signal; failures feed the repair loop.
- **Registry-grounded budget-aware resources** (`src/data/learningResources.ts`,
  16 HTTP-verified URLs; `searchLearningResources` tool): every suggestion's
  resource URLs must exact-match the registry; milestones carry costTier +
  estimatedCostVND; at least one milestone must fit the monthly budget.
- **Equity segmentation**: 16 personas across 5 worker segments
  (knowledge_worker, wage_worker, rural_agricultural, student, craft_trade);
  per-segment scoring in the eval report.
- **3-rep stability protocol**: `npm run eval` defaults to 3 repetitions and
  emits `STABILITY.md` (mean ± sd); `--reps N` and `--render-only <baseStamp>`
  flags.
- **Counselor-review gate** (human in the loop) demonstrated in the UI;
  EN-primary output localization with VND/USD dual display at a fixed rate
  (1 USD = 26,000 VND, computed in `src/agents/usd.ts`).

### Published evaluation (2026-10-13T05-05-07, 16 personas x 3 reps = 144 runs)

- Stability (mean ± sd, baseline → final): grounding 89.5% ±1.5% → 99.0%
  ±1.5%; coherence 100.0% (weaker baseline floor) → 95.8% ±5.9% (ablation
  stage1 87.5% ±5.1); actionable-path 0.0% → 93.8% ±0.0%; personalization
  86 ±2 → 80 ±3.
- Honest failures documented: r3 golden-2 and r2 accountant/student ended in
  visible `repair` verdicts; garment/farmer actionable misses remain open.
- Per-segment (r1, final): grounding and coherence 100% in all segments;
  rural_agricultural actionable 50% is the open equity gap.

### Verification results (docs pass, 2026-10-13)

- `npm test`: 93/93 pass; `npm run lint`: 0 errors
- Docs-only change; all numbers cross-checked against
  `eval/results/runs/2026-10-13T05-05-07-stability/STABILITY.md` and the
  r1/r2/r3 EVALUATION.md files.

### 2026-10-13 (final) — Demo-safety guard

- Analysis button disabled with a bilingual hint when the intake form has
  no current role (the agent step rejects empty roles with a 400; verified
  in-browser: disabled initially, enabled after filling the role).
