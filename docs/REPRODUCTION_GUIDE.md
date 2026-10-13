# Reproduction Guide

Written for a clean environment (Windows/macOS/Linux, Node.js 20+).

## 1. Setup

```bash
git clone <repo-url> laban && cd laban
npm install
cp .env.example .env        # edit: set GEMINI_API_KEY (Google AI Studio, free tier works)
```

## 2. Run the solution

```bash
npm run dev                 # starts Express + Vite on http://localhost:3000
```

Open http://localhost:3000, fill the intake form (or pick a golden persona)
and submit — the suggestion flow runs the agent pipeline; the
"Quy trình Agent minh bạch" panel shows each pipeline step, tool call and
verification result.

## 3. Run the baseline and the evaluation

With the server still running, in a second terminal:

```bash
npm run eval
```

This runs the frozen baseline (`POST /api/eval/baseline`) and both agent
configs (`POST /api/agent/career-analyze`) over the same 16 personas
(`eval/personas.ts`, covering 5 worker segments), scores them identically
(`eval/score.ts`), and writes:

- `eval/results/runs/<stamp>/EVALUATION.md` — comparison + ablation tables
  + per-segment results
- `eval/results/runs/<stamp>/summary.json` — raw per-run scores
- `eval/trajectories/*.json` — one full trajectory per agent run
  (every LLM call, tool call and verification, with model + token counts)
- `eval/results/latest.json` — pointer to the newest run

By default `npm run eval` performs 3 repetitions of the full matrix
(3 reps x 16 personas x 3 configs = 144 runs) and additionally writes
`eval/results/runs/<stamp>-stability/STABILITY.md` with mean ± sd across
reps. Use `--reps N` to change the number of repetitions, and
`--render-only <baseStamp>` to re-render the report tables from previously
published run directories without new API calls.

Expected runtime: ~60-75 minutes total for the default 3-rep protocol.
Expected cost: ~$0.55 total at $0.30/1M tokens.
Expected result (published run 2026-10-13T05-05-07, mean ± sd across 3 reps):
baseline grounding 89.5% ±1.5% / coherence 100.0% / actionable-path 0.0%;
final agent grounding 99.0% ±1.5% / coherence 95.8% ±5.9% / actionable-path
93.8% ±0.0% / personalization 80 ±3 — LLM stochasticity means your exact
numbers will vary.

Metrics now scored: evidence grounding (citations + resource-URL registry
match), schema validity, guardrail compliance, risk coherence
(current-occupation resilience floor), actionable-path (registry resource +
action step + free/low-cost milestone), personalization judge, per-segment
breakdowns. Output is English-primary; costs are displayed in VND with USD
dual-display at a fixed rate of 1 USD = 26,000 VND computed in code (pass
`"language": "vi"` in the body for Vietnamese output).

## 4. Single-run spot checks

```bash
curl -s http://localhost:3000/api/agent/health
curl -s -X POST http://localhost:3000/api/eval/baseline -H "Content-Type: application/json" \
  -d '{"intakeProfile":{"currentRole":"Accountant","education":"BA","location":"Hanoi","forecastMode":"realistic"}}'
curl -s -X POST http://localhost:3000/api/agent/career-analyze -H "Content-Type: application/json" \
  -d '{"intakeProfile":{"currentRole":"Accountant","education":"BA","location":"Hanoi","forecastMode":"realistic"},"config":"final_tools_verifier"}'
```

The agent response includes `suggestions`, `verification` (verdict, failures,
judge scores, citation report), `trajectory` (all events) and `meta`
(models, tokens, latency).

## 5. Tests

```bash
npm test          # 93 vitest unit tests (agents, checks, citations, coherence, scoring)
npm run lint      # tsc --noEmit, 0 errors expected
npm run build     # production build
```

## 6. Versions and models

- Node.js 20+, npm 10+ (developed and tested on Windows 11)
- Model chain: `gemini-3.7-flash` primary → `gemini-3.5-flash-lite` →
  `gemini-3.1-flash-lite` → `gemini-flash-latest`. With our key the primary
  was unavailable, so all published calls ran on `gemini-3.5-flash-lite`; the
  exact model of every call is recorded in each trajectory event.
- Key dependency versions: see package.json (React 19, Express 4,
  @google/genai 2.x, vitest 4)
- No external services required: persistence is localStorage (Firebase was
  removed); the only network dependency is the Gemini API.
