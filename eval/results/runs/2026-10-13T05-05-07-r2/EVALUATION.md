# Evaluation Report

Generated: 2026-10-13T06:04:28.887Z (run stamp: 2026-10-13T05-05-07-r2)

## Comparison (competition format)

| Metric | Simple Baseline | Agent Solution (final) |
|---|---|---|
| Primary outcome: evidence grounding rate | 90.0% | 100.0% |
| Hallucinated citations (total across 16 personas) | 3 | 0 |
| Schema-valid runs | 93.3% | 100.0% |
| Guardrail compliance | 100.0% | 100.0% |
| Personalization (judge 0-100) | 88 | 83 |
| Risk coherence rate | 100.0% | 87.5% |
| Actionable-path rate | 0.0% | 93.8% |
| Human time per task (avg wall-clock, s) | 9.9 | 27.5 |
| Cost per task (USD, $0.30/1M tokens) | 0.00241 | 0.00501 |

## Ablation (stage evidence for the changelog)

| Stage | Grounding | Hallucinated | Schema-valid | Personalization | Coherence | Actionable |
|---|---|---|---|---|---|---|
| Baseline (single prompt) | 90.0% | 3 | 93.3% | 88 | 100.0% | 0.0% |
| + Evidence tools | 96.9% | 1 | 93.8% | 76 | 87.5% | 100.0% |
| + Tools + Verifier (final) | 100.0% | 0 | 100.0% | 83 | 87.5% | 93.8% |

## Per-persona results

#### baseline

| Persona | Grounding | Hallucinated | Schema failures | Personalization | Coherent | Actionable |
|---|---|---|---|---|---|---|
| persona-golden-1 | 100.0% | 0 | 1 | 95 | yes | NO |
| persona-golden-2 | 100.0% | 0 | 0 | 95 | yes | NO |
| persona-golden-3 | 50.0% | 1 | 0 | 40 | yes | NO |
| persona-accountant | 100.0% | 0 | 0 | 90 | yes | NO |
| persona-garment | 100.0% | 0 | 0 | 85 | yes | NO |
| persona-teacher | 100.0% | 0 | 0 | 95 | yes | NO |
| persona-juniordev | 100.0% | 0 | 0 | 85 | yes | NO |
| persona-student | 100.0% | 0 | 0 | 90 | yes | NO |
| persona-nurse | 100.0% | 0 | 0 | 85 | yes | NO |
| persona-logistics | 100.0% | 0 | 0 | 95 | yes | NO |
| persona-farmer | 100.0% | 0 | 0 | 95 | yes | NO |
| persona-watchrepair | FAILED | 0 | 0 | n/a | n/a | n/a |
| persona-receptionist | 100.0% | 0 | 0 | 90 | yes | NO |
| persona-electrician | 100.0% | 0 | 0 | 90 | yes | NO |
| persona-retailcashier | 50.0% | 1 | 0 | 95 | yes | NO |
| persona-agritech | 50.0% | 1 | 0 | 95 | yes | NO |

#### stage1_tools

| Persona | Grounding | Hallucinated | Schema failures | Personalization | Coherent | Actionable |
|---|---|---|---|---|---|---|
| persona-golden-1 | 100.0% | 0 | 0 | 95 | NO | yes |
| persona-golden-2 | 100.0% | 0 | 0 | 90 | yes | yes |
| persona-golden-3 | 100.0% | 0 | 0 | 40 | yes | yes |
| persona-accountant | 100.0% | 0 | 0 | 90 | yes | yes |
| persona-garment | 100.0% | 0 | 0 | 88 | yes | yes |
| persona-teacher | 50.0% | 1 | 0 | 95 | yes | yes |
| persona-juniordev | 100.0% | 0 | 0 | 75 | yes | yes |
| persona-student | 100.0% | 0 | 0 | 85 | NO | yes |
| persona-nurse | 100.0% | 0 | 0 | 90 | yes | yes |
| persona-logistics | 100.0% | 0 | 0 | 90 | yes | yes |
| persona-farmer | 100.0% | 0 | 0 | 95 | yes | yes |
| persona-watchrepair | 100.0% | 0 | 0 | 95 | yes | yes |
| persona-receptionist | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-electrician | 100.0% | 0 | 0 | 15 | yes | yes |
| persona-retailcashier | 100.0% | 0 | 0 | 10 | yes | yes |
| persona-agritech | 100.0% | 0 | 1 | 75 | yes | yes |

#### final_tools_verifier

| Persona | Grounding | Hallucinated | Schema failures | Personalization | Coherent | Actionable |
|---|---|---|---|---|---|---|
| persona-golden-1 | 100.0% | 0 | 0 | 100 | yes | yes |
| persona-golden-2 | 100.0% | 0 | 0 | 45 | yes | yes |
| persona-golden-3 | 100.0% | 0 | 0 | 45 | yes | yes |
| persona-accountant | 100.0% | 0 | 0 | 95 | NO | yes |
| persona-garment | 100.0% | 0 | 0 | 95 | yes | NO |
| persona-teacher | 100.0% | 0 | 0 | 95 | yes | yes |
| persona-juniordev | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-student | 100.0% | 0 | 0 | 85 | NO | yes |
| persona-nurse | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-logistics | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-farmer | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-watchrepair | 100.0% | 0 | 0 | 95 | yes | yes |
| persona-receptionist | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-electrician | 100.0% | 0 | 0 | 90 | yes | yes |
| persona-retailcashier | 100.0% | 0 | 0 | 90 | yes | yes |
| persona-agritech | 100.0% | 0 | 0 | 65 | yes | yes |


## Results by worker segment

### baseline

| Segment | Runs | Grounding | Personalization | Coherence | Actionable |
|---|---|---|---|---|---|
| knowledge_worker | 7 | 92.9% | 84 | 100.0% | 0.0% |
| wage_worker | 5 | 90.0% | 91 | 100.0% | 0.0% |
| student | 1 | 100.0% | 90 | 100.0% | 0.0% |
| rural_agricultural | 2 | 75.0% | 95 | 100.0% | 0.0% |

### stage1_tools

| Segment | Runs | Grounding | Personalization | Coherence | Actionable |
|---|---|---|---|---|---|
| knowledge_worker | 7 | 92.9% | 82 | 85.7% | 100.0% |
| wage_worker | 5 | 100.0% | 58 | 100.0% | 100.0% |
| student | 1 | 100.0% | 85 | 0.0% | 100.0% |
| rural_agricultural | 2 | 100.0% | 85 | 100.0% | 100.0% |
| craft_trade | 1 | 100.0% | 95 | 100.0% | 100.0% |

### final_tools_verifier

| Segment | Runs | Grounding | Personalization | Coherence | Actionable |
|---|---|---|---|---|---|
| knowledge_worker | 7 | 100.0% | 79 | 85.7% | 100.0% |
| wage_worker | 5 | 100.0% | 89 | 100.0% | 80.0% |
| student | 1 | 100.0% | 85 | 0.0% | 100.0% |
| rural_agricultural | 2 | 100.0% | 75 | 100.0% | 100.0% |
| craft_trade | 1 | 100.0% | 95 | 100.0% | 100.0% |


## Notes

- Cost model: USD 0.30 per 1M tokens (Gemini Flash public-tier assumption, in+out blended).
- Grounding per persona = verified citations / total citations (token-set Jaccard >= 0.75 vs curated corpus).
- Failed runs are reported as failures; no fallback data is substituted.

Stability across repetitions: see ../2026-10-13T05-05-07-stability/STABILITY.md
