# Solution Video Script (target: 5:00, limit 5:00)

Recording: OBS Studio, 1920x1080, browser at http://localhost:3000.
Prepare: server running (`npm run dev`), a terminal at repo root,
docs/EVALUATION.md open in the browser, VS Code showing
eval/trajectories/final_tools_verifier--persona-watchrepair.json.

| Time | Scene | Narration (EN) | On screen |
|---|---|---|---|
| 0:00-0:30 | Problem | "Millions of Vietnamese workers ask whether AI will take their job. The advice they get online is generic — and when LLMs write it, the citations are sometimes fabricated. For career decisions, that's disqualifying." | Scroll a generic AI-generated career advice page; highlight a citation and ask 'is this real?' |
| 0:30-1:00 | Baseline | "Here's our frozen baseline: one prompt, the whole research library pasted in. Across 16 personas and three repetitions it averages 89.5% grounding with hallucinated citations in every rep — 3 in the representative run — and a couple of runs still fail to parse at all." | Terminal: npm run eval output scrolling; open docs/EVALUATION.md baseline row |
| 1:00-2:30 | Agent walkthrough | "The agent pipeline: a Profiler normalizes the intake. The Evidence Gatherer calls real tools — the Vietnam occupation database, the research library and a curated learning-resource registry — and only what the tools return can be cited. The Verifier then checks schema, guardrails, every citation and every resource URL against the corpus; when it finds a failure, the analyst repairs its own output. Malformed JSON is retried automatically." | App UI: submit the accountant persona; open the 'Quy trình Agent minh bạch' panel; step through tool_call / verification_result events |
| 2:30-3:15 | Challenging case | "The watch repairer isn't in our database. The agent says so honestly — three lookups, three 'no direct match' — generalizes from research evidence, and even when the live news tool hits a rate limit, the pipeline finishes with fully verified citations." | Show the watch-repair trajectory JSON; point at the no-match lookups and the 429 tool_response |
| 3:15-3:35 | Social-impact safeguards | "We also made the advice itself trustworthy: the verifier now rejects recommendations whose own evidence signals decline, every learning link is grounded in a verified registry with cost tiers that respect the user's budget — and a counselor approves before anything is delivered." | Show the coherence-check verification failure in the transparency panel; the registry table in src/data/learningResources.ts; the counselor-review checkpoint in the UI |
| 3:35-4:20 | Results | "Same 16 personas, three repetitions, same scorer: grounding goes from 91% to 100% in the representative run — 99% ±1.5 across reps with zero hallucinated citations; actionable-path rate jumps from 0% to 94% — at about half a cent per task. And the ablation shows the interesting part: tools alone dropped coherence to 87.5% because the model recommended declining occupations; the verifier repaired most of it to 95.8%. When repairs don't converge, the run ships with a visible repair flag — not a hidden pass." | docs/EVALUATION.md tables; walk the stability and ablation tables row by row |
| 4:20-5:00 | Changelog + hot take | "Each stage earned its place, and one experiment was cut: news-on-every-run added cost with no grounding gain, so it now fires only when the occupation lookup misses. Lesson: retrieval alone doesn't stop fabrication — verification that can send work back does. And verified authenticity is not sound direction: we now ground every resource URL and reject recommendations whose own evidence says the job is shrinking." | docs/IMPROVEMENT_CHANGELOG.md; final shot of the README |

## Recording checklist

- [ ] 1080p, cursor highlight on
- [ ] Kill notifications; clean browser profile
- [ ] Say numbers exactly as in docs/EVALUATION.md
- [ ] Re-watch once for audio clarity before exporting
