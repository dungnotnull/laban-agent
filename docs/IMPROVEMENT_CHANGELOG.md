# Improvement Changelog

Iterations 1-3 are backed by the published 12-persona evaluation run
(`eval/results/runs/2026-08-30T10-53-20/EVALUATION.md`); iterations 4-5 are
backed by the published 3-rep, 16-persona run
(`eval/results/runs/2026-10-13T05-05-07-stability/STABILITY.md`, pointer in
`eval/results/latest.json`). Baseline = frozen single-shot prompt
(`src/agents/baseline.ts`, verbatim from the pre-existing endpoint).

| Stage | What we tried and why | Evidence | Decision / learning |
|---|---|---|---|
| Baseline | Single prompt with the full research library pasted in — how the platform worked before | 91.7% grounding, 2 hallucinated citations; exploratory run: 2/12 total failures from malformed JSON | Fluent output, occasionally unverifiable evidence and brittle on long outputs — the failure modes to fix |
| Iteration 1 | + Evidence tools (function-calling loop over the occupation DB + research library) — give the model only real sources to cite | Grounding unchanged at 91.7%, still 2 hallucinated citations, 1 schema-invalid run (11/12) | Kept (enables grounded citations), but learned: tools alone do not guarantee the model cites only from them |
| Iteration 2 | + Verifier with repair loop — deterministic schema/guardrail/citation checks plus an LLM judge; failures fed back to the analyst (max 2 repairs) | Grounding 100%, 0 hallucinated citations, 12/12 schema-valid, 12/12 guardrail-compliant | Kept. The verifier loop is the single biggest contributor — it caught and repaired exactly the failures tools could not prevent |
| Iteration 3 | + Parse-error recovery — analyst responses that fail JSON parsing are retried with explicit feedback within the same budget | Exploratory run: malformed JSON killed 2/12 baseline and 1/12 agent runs; after the fix (commit a9e5b2e, unit-tested) the published run completed 36/36 runs, 0 failures | Kept. Agents should recover from their own malformed output; single-shot baselines cannot |
| Experiment removed | getOccupationNews on EVERY run — extra cost and latency on every persona while grounding was already solved by the occupation DB for matched personas | News tool adds one grounded LLM call per run (~2-4s, extra tokens) with no grounding gain for matched personas | Removed from default policy: the tool now fires only when the occupation lookup finds no match (exactly the challenging-case path, where it worked as designed) |
| Final | Tools + verifier + parse recovery combined | 100% grounding, 0 hallucinations, 12/12 schema-valid, 12/12 guardrail, $0.0040 per task | See docs/EVALUATION.md |

| Iteration 4 | + Decision-coherence checks — the verifier rejects a top recommendation whose resilience falls below the user's current-occupation floor (55 when unmatched) or whose Vietnam demand signal reads 'declining', feeding it back for repair | Motivated by the published Aug-30 garment case (top suggestion resilience 42 with citations documenting a 48% posting decline). New 3-rep protocol: coherence 87.5% ±5.1 with tools alone (stage1) → 95.8% ±5.9 with the verifier; r2 accountant/student and r3 golden-2 ended in honest `repair` verdicts when 2 repairs did not converge | Kept. Tools alone INTRODUCED incoherent directions; verification-with-teeth fixed most and surfaces the rest instead of hiding them |
| Iteration 5 | + Grounded budget-aware resources + equity: learning-resource registry (16 HTTP-verified URLs), costTier + estimatedCostVND milestones, budget-fit rule, counselor-review gate, EN-primary localization with USD dual-display (fixed 1 USD = 26,000 VND) | Actionable-path rate 0.0% (baseline) → 93.8% ±0.0 (final); per-segment results table added to the eval report; garment/farmer actionable misses in r2/r3 documented as open | Kept. "User receives real, affordable learning resources" is now measured and mostly delivered; the remaining rural/agricultural misses are the open edge |

**Main failure mode still open:** the personalization judge score moved from
86 ±2 (baseline) to 80 ±3 (final) — verification pushes the analyst toward
safe, grounded phrasing at a small personalization cost. Judge scores also
carry LLM variance (±5). Next step: tune the repair prompt to preserve
user-specific detail while staying grounded. Honest non-convergence cases
remain: when 2 repairs cannot satisfy the coherence floor, the run ships
with a `repair` verdict that is visible to the user rather than being
silently passed.

**Challenging case (watch repairer — occupation absent from the curated
database):** all three occupation lookups honestly returned "No direct
match"; the gatherer fell back to research evidence per policy; the news tool
hit a live 429 rate limit and the pipeline still completed with a passing
verdict and two fully verified citations (Frey & Osborne; Stanford AI Index
2024). The agent generalizes instead of fabricating — the exact behavior the
challenging case was designed to probe.
