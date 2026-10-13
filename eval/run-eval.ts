import fs from 'fs';
import path from 'path';
import { EVAL_PERSONAS } from './personas';
import { scoreOutput, aggregate, type RunScore } from './score';

const BASE_URL = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:3000';

interface EvalConfig {
  id: string;
  endpoint: string;
  body: (intake: any, personaId: string) => object;
}

const CONFIGS: EvalConfig[] = [
  {
    id: 'baseline',
    endpoint: '/api/eval/baseline',
    body: (intake) => ({ intakeProfile: intake })
  },
  {
    id: 'stage1_tools',
    endpoint: '/api/agent/career-analyze',
    body: (intake) => ({ intakeProfile: intake, useTools: true, useVerifier: false })
  },
  {
    id: 'final_tools_verifier',
    endpoint: '/api/agent/career-analyze',
    body: (intake) => ({ intakeProfile: intake, useTools: true, useVerifier: true })
  }
];

async function postJson(url: string, body: object, retries = 1): Promise<any> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 2000));
      return postJson(url, body, retries - 1);
    }
    throw err;
  }
}

function pct(v: number | null): string {
  return v === null ? 'n/a' : `${(v * 100).toFixed(1)}%`;
}

function renderEvaluationMd(byConfig: Record<string, RunScore[]>, stamp: string, segmentsById: Record<string, string>): string {
  // Centralized so the pointer survives re-renders; the runner no longer appends it post-hoc.
  const baseStamp = stamp.replace(/-r\d+$/, '');
  const b = byConfig['baseline'] ? aggregate(byConfig['baseline'], segmentsById) : null;
  const s1 = byConfig['stage1_tools'] ? aggregate(byConfig['stage1_tools'], segmentsById) : null;
  const f = byConfig['final_tools_verifier'] ? aggregate(byConfig['final_tools_verifier'], segmentsById) : null;

  const perPersona = Object.entries(byConfig).map(([config, scores]) => {
    const lines = scores.map(s =>
      `| ${s.personaId} | ${s.ok ? pct(s.groundingRate) : 'FAILED'} | ${s.hallucinatedCount} | ${s.schemaFailures} | ${s.personalization ?? 'n/a'} | ${s.ok ? (s.coherent ? 'yes' : 'NO') : 'n/a'} | ${s.ok ? (s.actionable ? 'yes' : 'NO') : 'n/a'} |`
    ).join('\n');
    return `#### ${config}\n\n| Persona | Grounding | Hallucinated | Schema failures | Personalization | Coherent | Actionable |\n|---|---|---|---|---|---|---|\n${lines}\n`;
  }).join('\n');

  const segmentSections = Object.entries(byConfig).map(([config, scores]) => {
    const agg = aggregate(scores, segmentsById);
    const rows = Object.entries(agg.bySegment).map(([seg, m]) =>
      `| ${seg} | ${m.runs} | ${pct(m.groundingRate)} | ${m.personalizationAvg?.toFixed(0) ?? 'n/a'} | ${(m.coherenceRate * 100).toFixed(1)}% | ${(m.actionableRate * 100).toFixed(1)}% |`
    ).join('\n');
    return `### ${config}\n\n| Segment | Runs | Grounding | Personalization | Coherence | Actionable |\n|---|---|---|---|---|---|\n${rows}\n`;
  }).join('\n');

  return `# Evaluation Report

Generated: ${new Date().toISOString()} (run stamp: ${stamp})

## Comparison (competition format)

| Metric | Simple Baseline | Agent Solution (final) |
|---|---|---|
| Primary outcome: evidence grounding rate | ${b ? pct(b.groundingRate) : 'n/a'} | ${f ? pct(f.groundingRate) : 'n/a'} |
| Hallucinated citations (total across ${b?.runs ?? 0} personas) | ${b ? b.hallucinatedCount : 'n/a'} | ${f ? f.hallucinatedCount : 'n/a'} |
| Schema-valid runs | ${b ? pct(b.schemaValidRate) : 'n/a'} | ${f ? pct(f.schemaValidRate) : 'n/a'} |
| Guardrail compliance | ${b ? pct(b.guardrailComplianceRate) : 'n/a'} | ${f ? pct(f.guardrailComplianceRate) : 'n/a'} |
| Personalization (judge 0-100) | ${b?.personalizationAvg?.toFixed(0) ?? 'n/a'} | ${f?.personalizationAvg?.toFixed(0) ?? 'n/a'} |
| Risk coherence rate | ${b ? pct(b.coherenceRate) : 'n/a'} | ${f ? pct(f.coherenceRate) : 'n/a'} |
| Actionable-path rate | ${b ? pct(b.actionableRate) : 'n/a'} | ${f ? pct(f.actionableRate) : 'n/a'} |
| Human time per task (avg wall-clock, s) | ${b ? b.avgLatencySec : 'n/a'} | ${f ? f.avgLatencySec : 'n/a'} |
| Cost per task (USD, $0.30/1M tokens) | ${b ? b.costPerTaskAvgUsd : 'n/a'} | ${f ? f.costPerTaskAvgUsd : 'n/a'} |

## Ablation (stage evidence for the changelog)

| Stage | Grounding | Hallucinated | Schema-valid | Personalization | Coherence | Actionable |
|---|---|---|---|---|---|---|
| Baseline (single prompt) | ${b ? pct(b.groundingRate) : 'n/a'} | ${b ? b.hallucinatedCount : 'n/a'} | ${b ? pct(b.schemaValidRate) : 'n/a'} | ${b?.personalizationAvg?.toFixed(0) ?? 'n/a'} | ${b ? pct(b.coherenceRate) : 'n/a'} | ${b ? pct(b.actionableRate) : 'n/a'} |
| + Evidence tools | ${s1 ? pct(s1.groundingRate) : 'n/a'} | ${s1 ? s1.hallucinatedCount : 'n/a'} | ${s1 ? pct(s1.schemaValidRate) : 'n/a'} | ${s1?.personalizationAvg?.toFixed(0) ?? 'n/a'} | ${s1 ? pct(s1.coherenceRate) : 'n/a'} | ${s1 ? pct(s1.actionableRate) : 'n/a'} |
| + Tools + Verifier (final) | ${f ? pct(f.groundingRate) : 'n/a'} | ${f ? f.hallucinatedCount : 'n/a'} | ${f ? pct(f.schemaValidRate) : 'n/a'} | ${f?.personalizationAvg?.toFixed(0) ?? 'n/a'} | ${f ? pct(f.coherenceRate) : 'n/a'} | ${f ? pct(f.actionableRate) : 'n/a'} |

## Per-persona results

${perPersona}

## Results by worker segment

${segmentSections}

## Notes

- Cost model: USD 0.30 per 1M tokens (Gemini Flash public-tier assumption, in+out blended).
- Grounding per persona = verified citations / total citations (token-set Jaccard >= 0.75 vs curated corpus).
- Failed runs are reported as failures; no fallback data is substituted.

Stability across repetitions: see ../${baseStamp}-stability/STABILITY.md
`;
}

function renderStabilityMd(runs: Record<string, RunScore[]>[], segmentsById: Record<string, string>): string {
  const meanSd = (xs: number[]) => {
    const m = xs.reduce((a, b) => a + b, 0) / xs.length;
    const sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length);
    return { m, sd };
  };
  const pctf = (v: number) => `${(v * 100).toFixed(1)}%`;
  const rows = ['baseline', 'stage1_tools', 'final_tools_verifier'].map(cfg => {
    const aggs = runs.map(r => aggregate(r[cfg] || [], segmentsById)).filter(Boolean);
    const g = meanSd(aggs.map(a => a.groundingRate ?? 0));
    const coh = meanSd(aggs.map(a => a.coherenceRate));
    const act = meanSd(aggs.map(a => a.actionableRate));
    const per = meanSd(aggs.map(a => a.personalizationAvg ?? 0));
    return `| ${cfg} | ${pctf(g.m)} ±${pctf(g.sd)} | ${pctf(coh.m)} ±${pctf(coh.sd)} | ${pctf(act.m)} ±${pctf(act.sd)} | ${per.m.toFixed(0)} ±${per.sd.toFixed(0)} |`;
  }).join('\n');
  return `# Stability across ${runs.length} runs (mean ± sd)\n\n| Config | Grounding | Coherence | Actionable | Personalization |\n|---|---|---|---|---|\n${rows}\n`;
}

function renderTrajectoriesMd(trajDir: string): string {
  const files = fs.readdirSync(trajDir).filter(f => f.endsWith('.json'));
  const picks = ['persona-watchrepair', 'persona-accountant'];
  const sections = picks.map(pid => {
    const match = files.find(f => f.includes(pid));
    if (!match) return '';
    const traj = JSON.parse(fs.readFileSync(path.join(trajDir, match), 'utf-8'));
    const lines = traj.events.map((e: any) =>
      `- **${e.ts}** \`${e.type}\`${e.agent ? ` _${e.agent}_` : ''}${e.message ? ` — ${e.message}` : ''}${e.usageTokens ? ` (${e.usageTokens} tok)` : ''}`
    ).join('\n');
    return `## Trajectory: ${pid} (${match})\n\n${lines}\n`;
  }).join('\n');
  return `# Agent Trajectories (representative runs)\n\nFull JSON trajectories for every run are in \`eval/trajectories/\`.\n\n${sections}`;
}

async function main() {
  // Re-render reports from an existing run without hitting the server
  const roIdx = process.argv.indexOf('--render-only');
  if (roIdx > 0) {
    const baseStamp = String(process.argv[roIdx + 1] || '');
    if (!baseStamp) { console.error('Usage: --render-only <baseStamp>'); process.exit(1); }
    const latest = JSON.parse(fs.readFileSync(path.join('eval', 'results', 'latest.json'), 'utf-8'));
    const reps = latest.reps || 3;
    const segmentsById = Object.fromEntries(EVAL_PERSONAS.map(p => [p.id, p.segment]));
    const runs: Record<string, RunScore[]>[] = [];
    for (let rep = 1; rep <= reps; rep++) {
      const stamp = `${baseStamp}-r${rep}`;
      const summary = JSON.parse(fs.readFileSync(path.join('eval', 'results', 'runs', stamp, 'summary.json'), 'utf-8'));
      runs.push(summary);
      fs.writeFileSync(
        path.join('eval', 'results', 'runs', stamp, 'EVALUATION.md'),
        renderEvaluationMd(summary, stamp, segmentsById)
      );
    }
    const stabDir = path.join('eval', 'results', 'runs', `${baseStamp}-stability`);
    fs.mkdirSync(stabDir, { recursive: true });
    fs.writeFileSync(path.join(stabDir, 'STABILITY.md'), renderStabilityMd(runs, segmentsById));
    console.log(`Re-rendered ${reps} EVALUATION.md files + STABILITY.md for ${baseStamp}`);
    process.exit(0);
  }

  // 1. Server must be running
  try {
    const health = await (await fetch(`${BASE_URL}/api/agent/health`)).json();
    if (!health.geminiKeyConfigured) {
      console.error('Server reports no Gemini key. Set GEMINI_API_KEY in .env and restart npm run dev.');
      process.exit(1);
    }
    console.log(`Server healthy. Primary model: ${health.primaryModel}`);
  } catch {
    console.error(`Cannot reach ${BASE_URL}/api/agent/health. Start the server first:  npm run dev`);
    process.exit(1);
  }

  const repsIdx = process.argv.indexOf('--reps');
  const REPS = repsIdx > 0 ? Math.max(1, Number(process.argv[repsIdx + 1]) || 1) : 3;

  const baseStamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const trajDir = path.join('eval', 'trajectories');
  fs.mkdirSync(trajDir, { recursive: true });
  const segmentsById = Object.fromEntries(EVAL_PERSONAS.map(p => [p.id, p.segment]));
  const allRuns: Record<string, RunScore[]>[] = [];

  for (let rep = 1; rep <= REPS; rep++) {
    const stamp = `${baseStamp}-r${rep}`;
    const runDir = path.join('eval', 'results', 'runs', stamp);
    fs.mkdirSync(path.join(runDir, 'baseline'), { recursive: true });
    fs.mkdirSync(path.join(runDir, 'stage1_tools'), { recursive: true });
    fs.mkdirSync(path.join(runDir, 'final_tools_verifier'), { recursive: true });

    const byConfig: Record<string, RunScore[]> = {};

    for (const cfg of CONFIGS) {
      byConfig[cfg.id] = [];
      for (const persona of EVAL_PERSONAS) {
        process.stdout.write(`[r${rep}][${cfg.id}] ${persona.id} ... `);
        let payload: any;
        try {
          payload = await postJson(`${BASE_URL}${cfg.endpoint}`, cfg.body(persona.intake, persona.id));
        } catch (err: any) {
          payload = { error: `transport failed: ${err?.message || err}` };
        }
        // Persist trajectory for agent runs (rep 1 only to avoid overwrite churn)
        if (rep === 1 && payload?.trajectory) {
          fs.writeFileSync(
            path.join(trajDir, `${cfg.id}--${persona.id}.json`),
            JSON.stringify(payload.trajectory, null, 1)
          );
        }
        const score = await scoreOutput(persona.id, cfg.id, payload, persona.intake);
        byConfig[cfg.id].push(score);
        fs.writeFileSync(
          path.join(runDir, cfg.id, `${persona.id}.json`),
          JSON.stringify({ score, payload }, null, 1)
        );
        console.log(score.ok ? `grounding=${score.groundingRate ?? 'n/a'} hall=${score.hallucinatedCount} schema=${score.schemaFailures}` : `FAILED (${score.error})`);
        await new Promise(r => setTimeout(r, 300));
      }
    }

    fs.writeFileSync(path.join(runDir, 'summary.json'), JSON.stringify(byConfig, null, 1));
    fs.writeFileSync(path.join(runDir, 'EVALUATION.md'), renderEvaluationMd(byConfig, stamp, segmentsById));
    if (rep === 1) {
      fs.writeFileSync(path.join(trajDir, 'TRAJECTORIES.md'), renderTrajectoriesMd(trajDir));
    }
    allRuns.push({ ...byConfig });
  }

  // Stability report across repetitions
  const stabilityDir = path.join('eval', 'results', 'runs', `${baseStamp}-stability`);
  fs.mkdirSync(stabilityDir, { recursive: true });
  fs.writeFileSync(path.join(stabilityDir, 'STABILITY.md'), renderStabilityMd(allRuns, segmentsById));

  // latest.json points to rep-1 stamp so downstream tooling finds a per-run dir
  fs.writeFileSync(
    path.join('eval', 'results', 'latest.json'),
    JSON.stringify({ stamp: `${baseStamp}-r1`, baseStamp, reps: REPS }, null, 1)
  );

  // Pointer to the stability report is rendered inside renderEvaluationMd
  const rep1EvalPath = path.join('eval', 'results', 'runs', `${baseStamp}-r1`, 'EVALUATION.md');

  console.log(`\nDone (${REPS} rep(s)). Results: ${rep1EvalPath}`);
  console.log(`Stability: ${path.join(stabilityDir, 'STABILITY.md')}`);
}

main().catch(err => {
  console.error('Eval run crashed:', err);
  process.exit(1);
});
