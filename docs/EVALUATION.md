# Evaluation

## Methodology

- **Primary metric — evidence grounding rate:** for every `evidenceCitations`
  entry in the output, we check whether it traces back to the curated corpus
  (research library titles via token-set Jaccard >= 0.75; occupation database
  source texts via >= 0.75 token containment). Grounding = verified / total.
  The checker (`src/agents/citations.ts`) is shared by the runtime verifier
  and the eval, so product and measurement cannot drift apart. Since the
  social-impact upgrade, resource-URL grounding additionally requires every
  learning-resource URL to exact-match the curated registry
  (`src/data/learningResources.ts`, HTTP-verified).
- **Risk coherence rate:** passes the C1-C3 deterministic checks
  (`src/agents/coherence.ts`) — the top suggestion's resilience must be at or
  above the user's current-occupation floor (55 when the occupation lookup
  does not match) and no 'declining' Vietnam demand signal may support it.
- **Actionable-path rate:** the top suggestion must include a
  registry-grounded learning resource, a non-empty `actionStepNow`, and at
  least one free/low-cost milestone.
- **Cases:** 16 personas — 3 golden (platform demo set) + 13 synthetic
  covering accountants, garment workers, teachers, developers, students,
  nurses, logistics staff, farmers, receptionists, electricians, retail
  cashiers and agritech workers — plus 1 challenging case (watch repairer,
  an occupation absent from the curated database) to test honest behavior
  under missing evidence. Each persona belongs to a worker segment
  (knowledge_worker, wage_worker, rural_agricultural, student, craft_trade).
- **Stability protocol:** every config runs each persona 3 times (independent
  repetitions); reported config scores are mean ± sd across reps
  (`eval/results/runs/<stamp>-stability/STABILITY.md`).
- **Fairness:** baseline and agent configs run the same personas through the
  same server; scoring is computed identically and independently of the
  pipeline's internal verifier; the personalization judge runs at temperature 0.
  Three known asymmetries are documented rather than hidden:
  1. *Coherence floor asymmetry:* the agent is checked against its looked-up
     current-occupation resilience (e.g. 82 for the accountant), while the
     baseline has no tools and is therefore held to the unknown-occupation
     default floor (55). Baseline coherence of 100% reflects a weaker
     standard; the operative comparison is the ablation (stage1 87.5% ±5.1 →
     final 95.8% ±5.9).
  2. *Registry-unaware baseline:* the baseline cannot know the resource
     registry, so its 0% actionable-path rate is structural. The metric
     measures "user receives real, affordable learning resources", which the
     pre-existing platform could not guarantee.
  3. *Language:* baseline output is Vietnamese (frozen prompt), agent output
     is English-primary; the personalization judge is instructed to judge
     content irrespective of language.
- **Honest failure reporting:** runs that end with verdict `repair` (the
  coherence floor was not met after 2 repairs) are scored as-is and listed as
  observed failures — the flag remains visible to the user. Failed runs are
  reported as failures; no fallback data is ever substituted. In the earlier
  12-persona run (before the parse-retry fix, commit a9e5b2e) malformed JSON
  killed 2/12 baseline and 1/12 agent runs — that failure mode motivated
  Iteration 3 in the changelog and is now unit-tested against.
- **Cost model:** USD 0.30 per 1M tokens (Gemini Flash public-tier assumption,
  in+out blended). USD display uses a fixed documented rate of 1 USD =
  26,000 VND (approximate interbank, set 2026-10-13), computed in code.

---

# Evaluation Report — 2026-10-13 (16 personas x 3 reps)

Run stamps: `2026-10-13T05-05-07-r{1,2,3}` + `2026-10-13T05-05-07-stability`.

## Comparison (representative single rep, r1)

| Metric | Simple Baseline | Agent Solution (final) |
|---|---|---|
| Primary outcome: evidence grounding rate | 91.1% | 100.0% |
| Hallucinated citations (total across 16 personas) | 3 | 0 |
| Schema-valid runs | 100.0% | 100.0% |
| Guardrail compliance | 100.0% | 100.0% |
| Personalization (judge 0-100) | 86 | 81 |
| Risk coherence rate | 100.0% | 100.0% |
| Actionable-path rate | 0.0% | 93.8% |
| Human time per task (avg wall-clock, s) | 9.8 | 28.5 |
| Cost per task (USD, $0.30/1M tokens) | 0.0024 | 0.0051 |

## Stability across 3 reps (mean ± sd)

| Config | Grounding | Coherence | Actionable | Personalization |
|---|---|---|---|---|
| baseline | 89.5% ±1.5% | 100.0% ±0.0% | 0.0% ±0.0% | 86 ±2 |
| stage1_tools | 97.9% ±1.5% | 87.5% ±5.1% | 93.8% ±5.1% | 75 ±1 |
| final_tools_verifier | 99.0% ±1.5% | 95.8% ±5.9% | 93.8% ±0.0% | 80 ±3 |

## Results by worker segment (r1, final config)

| Segment | Runs | Grounding | Coherence | Actionable | Personalization |
|---|---|---|---|---|---|
| knowledge_worker | 7 | 100.0% | 100.0% | 100.0% | 86 |
| wage_worker | 5 | 100.0% | 100.0% | 100.0% | 75 |
| rural_agricultural | 2 | 100.0% | 100.0% | 50.0% | 68 |
| student | 1 | 100.0% | 100.0% | 100.0% | 95 |
| craft_trade | 1 | 100.0% | 100.0% | 100.0% | 95 |

## Honest observed failures

- r3 persona-golden-2: the analyst invented a citation ("Báo cáo thị trường
  tuyển dụng"); the verifier caught it, but 2 repairs did not converge — the
  run shipped with final verdict `repair` and the flag visible to the user
  (grounding 50% on that run; this drives final grounding to 99.0% ±1.5
  rather than 100%).
- r2: persona-accountant and persona-student ended `repair` (coherence floor
  not met after 2 repairs) → final coherence 95.8% ±5.9.
- persona-garment was not-actionable in r2+r3 and persona-farmer in r1 (top
  suggestion lacked a registry-grounded free resource after repairs) →
  actionable-path 93.8%.
- Baseline robustness: r1 had 2 parse-failed runs; r2 had 1 schema-invalid
  run (93.3%).
- Rural/agricultural actionability is the open equity gap (50% in the
  segment table above).

## Vietnam labor-force context

Context for persona selection — these figures are background for choosing
realistic personas, not impact claims of this project.

| Occupation / sector | Workforce figure | Source (year) |
|---|---|---|
| Garment/textile workers | ~3 million | VITAS - Vietnam Textile and Apparel Association (2024) |
| Agriculture, forestry and fishery employment | ~27% of national employment (labour force ~52.4 million) | GSO - General Statistics Office of Vietnam (2023/2024) |
| Teachers (general education) | 1,251,377 | MOET - Ministry of Education and Training, 2023-24 school year |

No verifiable public figures could be sourced from this search for
electronics assembly, retail cashiers or accountants; those occupations are
omitted rather than estimated.

---

# Historical run (2026-08-30, 12 personas)

Generated: 2026-08-30T11:04:13.741Z (run stamp: 2026-08-30T10-53-20)

## Comparison (competition format)

| Metric | Simple Baseline | Agent Solution (final) |
|---|---|---|
| Primary outcome: evidence grounding rate | 91.7% | 100.0% |
| Hallucinated citations (total across 12 personas) | 2 | 0 |
| Schema-valid runs | 100.0% | 100.0% |
| Guardrail compliance | 100.0% | 100.0% |
| Personalization (judge 0-100) | 83 | 76 |
| Human time per task (avg wall-clock, s) | 10.7 | 20.9 |
| Cost per task (USD, $0.30/1M tokens) | 0.00243 | 0.00398 |

## Ablation (stage evidence for the changelog)

| Stage | Grounding | Hallucinated | Schema-valid | Personalization |
|---|---|---|---|---|
| Baseline (single prompt) | 91.7% | 2 | 100.0% | 83 |
| + Evidence tools | 91.7% | 2 | 91.7% | 78 |
| + Tools + Verifier (final) | 100.0% | 0 | 100.0% | 76 |

## Per-persona results

#### baseline

| Persona | Grounding | Hallucinated | Schema failures | Personalization |
|---|---|---|---|---|
| persona-golden-1 | 100.0% | 0 | 0 | 40 |
| persona-golden-2 | 100.0% | 0 | 0 | 95 |
| persona-golden-3 | 100.0% | 0 | 0 | 40 |
| persona-accountant | 50.0% | 1 | 0 | 85 |
| persona-garment | 100.0% | 0 | 0 | 90 |
| persona-teacher | 100.0% | 0 | 0 | 95 |
| persona-juniordev | 100.0% | 0 | 0 | 90 |
| persona-student | 100.0% | 0 | 0 | 90 |
| persona-nurse | 50.0% | 1 | 0 | 95 |
| persona-logistics | 100.0% | 0 | 0 | 90 |
| persona-farmer | 100.0% | 0 | 0 | 90 |
| persona-watchrepair | 100.0% | 0 | 0 | 95 |

#### stage1_tools

| Persona | Grounding | Hallucinated | Schema failures | Personalization |
|---|---|---|---|---|
| persona-golden-1 | 50.0% | 1 | 0 | 10 |
| persona-golden-2 | 100.0% | 0 | 0 | 90 |
| persona-golden-3 | 100.0% | 0 | 0 | 90 |
| persona-accountant | 50.0% | 1 | 0 | 75 |
| persona-garment | 100.0% | 0 | 1 | 90 |
| persona-teacher | 100.0% | 0 | 0 | 95 |
| persona-juniordev | 100.0% | 0 | 0 | 90 |
| persona-student | 100.0% | 0 | 0 | 90 |
| persona-nurse | 100.0% | 0 | 0 | 45 |
| persona-logistics | 100.0% | 0 | 0 | 75 |
| persona-farmer | 100.0% | 0 | 0 | 90 |
| persona-watchrepair | 100.0% | 0 | 0 | 90 |

#### final_tools_verifier

| Persona | Grounding | Hallucinated | Schema failures | Personalization |
|---|---|---|---|---|
| persona-golden-1 | 100.0% | 0 | 0 | 85 |
| persona-golden-2 | 100.0% | 0 | 0 | 75 |
| persona-golden-3 | 100.0% | 0 | 0 | 40 |
| persona-accountant | 100.0% | 0 | 0 | 95 |
| persona-garment | 100.0% | 0 | 0 | 45 |
| persona-teacher | 100.0% | 0 | 0 | 95 |
| persona-juniordev | 100.0% | 0 | 0 | 75 |
| persona-student | 100.0% | 0 | 0 | 90 |
| persona-nurse | 100.0% | 0 | 0 | 75 |
| persona-logistics | 100.0% | 0 | 0 | 45 |
| persona-farmer | 100.0% | 0 | 0 | 95 |
| persona-watchrepair | 100.0% | 0 | 0 | 95 |


## Notes

- Cost model: USD 0.30 per 1M tokens (Gemini Flash public-tier assumption, in+out blended).
- Grounding per persona = verified citations / total citations (token-set Jaccard >= 0.75 vs curated corpus).
- Failed runs are reported as failures; no fallback data is substituted.
