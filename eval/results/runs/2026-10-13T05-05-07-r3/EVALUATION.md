# Evaluation Report

Generated: 2026-10-13T06:04:28.888Z (run stamp: 2026-10-13T05-05-07-r3)

## Comparison (competition format)

| Metric | Simple Baseline | Agent Solution (final) |
|---|---|---|
| Primary outcome: evidence grounding rate | 87.5% | 96.9% |
| Hallucinated citations (total across 16 personas) | 4 | 1 |
| Schema-valid runs | 93.8% | 100.0% |
| Guardrail compliance | 100.0% | 100.0% |
| Personalization (judge 0-100) | 83 | 76 |
| Risk coherence rate | 100.0% | 100.0% |
| Actionable-path rate | 0.0% | 93.8% |
| Human time per task (avg wall-clock, s) | 12.6 | 34.5 |
| Cost per task (USD, $0.30/1M tokens) | 0.0023 | 0.00436 |

## Ablation (stage evidence for the changelog)

| Stage | Grounding | Hallucinated | Schema-valid | Personalization | Coherence | Actionable |
|---|---|---|---|---|---|---|
| Baseline (single prompt) | 87.5% | 4 | 93.8% | 83 | 100.0% | 0.0% |
| + Evidence tools | 96.9% | 1 | 100.0% | 75 | 93.8% | 87.5% |
| + Tools + Verifier (final) | 96.9% | 1 | 100.0% | 76 | 100.0% | 93.8% |

## Per-persona results

#### baseline

| Persona | Grounding | Hallucinated | Schema failures | Personalization | Coherent | Actionable |
|---|---|---|---|---|---|---|
| persona-golden-1 | 100.0% | 0 | 0 | 40 | yes | NO |
| persona-golden-2 | 100.0% | 0 | 0 | 95 | yes | NO |
| persona-golden-3 | 50.0% | 1 | 0 | 40 | yes | NO |
| persona-accountant | 50.0% | 1 | 0 | 75 | yes | NO |
| persona-garment | 100.0% | 0 | 0 | 95 | yes | NO |
| persona-teacher | 100.0% | 0 | 0 | 90 | yes | NO |
| persona-juniordev | 100.0% | 0 | 0 | 85 | yes | NO |
| persona-student | 100.0% | 0 | 0 | 90 | yes | NO |
| persona-nurse | 100.0% | 0 | 0 | 90 | yes | NO |
| persona-logistics | 100.0% | 0 | 0 | 90 | yes | NO |
| persona-farmer | 100.0% | 0 | 0 | 95 | yes | NO |
| persona-watchrepair | 100.0% | 0 | 0 | 100 | yes | NO |
| persona-receptionist | 50.0% | 1 | 0 | 85 | yes | NO |
| persona-electrician | 100.0% | 0 | 2 | 85 | yes | NO |
| persona-retailcashier | 100.0% | 0 | 0 | 90 | yes | NO |
| persona-agritech | 50.0% | 1 | 0 | 90 | yes | NO |

#### stage1_tools

| Persona | Grounding | Hallucinated | Schema failures | Personalization | Coherent | Actionable |
|---|---|---|---|---|---|---|
| persona-golden-1 | 100.0% | 0 | 0 | 95 | NO | yes |
| persona-golden-2 | 50.0% | 1 | 0 | 85 | yes | yes |
| persona-golden-3 | 100.0% | 0 | 0 | 20 | yes | yes |
| persona-accountant | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-garment | 100.0% | 0 | 0 | 85 | yes | NO |
| persona-teacher | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-juniordev | 100.0% | 0 | 0 | 65 | yes | yes |
| persona-student | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-nurse | 100.0% | 0 | 0 | 40 | yes | yes |
| persona-logistics | 100.0% | 0 | 0 | 75 | yes | yes |
| persona-farmer | 100.0% | 0 | 0 | 65 | yes | yes |
| persona-watchrepair | 100.0% | 0 | 0 | 95 | yes | yes |
| persona-receptionist | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-electrician | 100.0% | 0 | 0 | 90 | yes | NO |
| persona-retailcashier | 100.0% | 0 | 0 | 65 | yes | yes |
| persona-agritech | 100.0% | 0 | 0 | 85 | yes | yes |

#### final_tools_verifier

| Persona | Grounding | Hallucinated | Schema failures | Personalization | Coherent | Actionable |
|---|---|---|---|---|---|---|
| persona-golden-1 | 100.0% | 0 | 0 | 20 | yes | yes |
| persona-golden-2 | 50.0% | 1 | 0 | 85 | yes | yes |
| persona-golden-3 | 100.0% | 0 | 0 | 90 | yes | yes |
| persona-accountant | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-garment | 100.0% | 0 | 0 | 20 | yes | NO |
| persona-teacher | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-juniordev | 100.0% | 0 | 0 | 75 | yes | yes |
| persona-student | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-nurse | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-logistics | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-farmer | 100.0% | 0 | 0 | 75 | yes | yes |
| persona-watchrepair | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-receptionist | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-electrician | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-retailcashier | 100.0% | 0 | 0 | 85 | yes | yes |
| persona-agritech | 100.0% | 0 | 0 | 85 | yes | yes |


## Results by worker segment

### baseline

| Segment | Runs | Grounding | Personalization | Coherence | Actionable |
|---|---|---|---|---|---|
| knowledge_worker | 7 | 85.7% | 74 | 100.0% | 0.0% |
| wage_worker | 5 | 90.0% | 89 | 100.0% | 0.0% |
| student | 1 | 100.0% | 90 | 100.0% | 0.0% |
| rural_agricultural | 2 | 75.0% | 93 | 100.0% | 0.0% |
| craft_trade | 1 | 100.0% | 100 | 100.0% | 0.0% |

### stage1_tools

| Segment | Runs | Grounding | Personalization | Coherence | Actionable |
|---|---|---|---|---|---|
| knowledge_worker | 7 | 92.9% | 68 | 85.7% | 100.0% |
| wage_worker | 5 | 100.0% | 80 | 100.0% | 60.0% |
| student | 1 | 100.0% | 85 | 100.0% | 100.0% |
| rural_agricultural | 2 | 100.0% | 75 | 100.0% | 100.0% |
| craft_trade | 1 | 100.0% | 95 | 100.0% | 100.0% |

### final_tools_verifier

| Segment | Runs | Grounding | Personalization | Coherence | Actionable |
|---|---|---|---|---|---|
| knowledge_worker | 7 | 92.9% | 75 | 100.0% | 100.0% |
| wage_worker | 5 | 100.0% | 72 | 100.0% | 80.0% |
| student | 1 | 100.0% | 85 | 100.0% | 100.0% |
| rural_agricultural | 2 | 100.0% | 80 | 100.0% | 100.0% |
| craft_trade | 1 | 100.0% | 85 | 100.0% | 100.0% |


## Notes

- Cost model: USD 0.30 per 1M tokens (Gemini Flash public-tier assumption, in+out blended).
- Grounding per persona = verified citations / total citations (token-set Jaccard >= 0.75 vs curated corpus).
- Failed runs are reported as failures; no fallback data is substituted.

Stability across repetitions: see ../2026-10-13T05-05-07-stability/STABILITY.md
