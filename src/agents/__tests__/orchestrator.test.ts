import { describe, it, expect } from 'vitest';
import { runCareerPipeline, DEFAULT_CONFIG } from '../orchestrator';
import { RESEARCH_LIBRARY } from '../../data/researchLibrary';
import type { AgentDeps } from '../deps';
import type { UserIntakeProfile } from '../../types';

const INTAKE: UserIntakeProfile = {
  currentRole: 'Graphic Designer',
  education: 'BA Design',
  location: 'Ho Chi Minh City',
  forecastMode: 'realistic',
  currentSkills: ['Photoshop'],
  strengths: ['visual sense']
};

const PROFILER_JSON = JSON.stringify({
  normalizedSummary: 'Junior graphic designer',
  occupationKeywords: ['graphic designer'],
  riskFlags: []
});

function suggestion(repair: boolean): any {
  return {
    roleTitle: repair ? 'AI Art Director' : 'Broken Role',
    roleTitleVi: 'Vai trò',
    matchScore: 80,
    reasoning: 'Lộ trình tăng cường AI.',
    evidenceCitations: repair
      ? [{ paperTitle: RESEARCH_LIBRARY[0].title, source: 'x', year: 2024, url: 'https://x.org', quoteOrDataPoint: 'q' }]
      : [{ paperTitle: 'Made Up Source', source: 'x', year: 2024, url: 'https://x.org', quoteOrDataPoint: 'q' }],
    trajectories: [
      { pathId: 'stay_augment', feasibilityScore: 80, riskLevel: 'low', actionStepNow: 'do' },
      { pathId: 'pivot_adjacent', feasibilityScore: 70, riskLevel: 'moderate', actionStepNow: 'do' },
      { pathId: 'full_switch', feasibilityScore: 60, riskLevel: 'high', actionStepNow: 'do' }
    ],
    roadmap: [{ milestoneNumber: 1, estimatedCostVND: 260000 }, { milestoneNumber: 2 }],
    averageSalaryRangeVND: '8,000,000 - 15,000,000 VND / tháng',
    resilienceDetail: { overallResilienceScore: 70, uncertaintyRange: '±5', vietnamDemandSignal: 'stable' }
  };
}

const JUDGE_GOOD = JSON.stringify({ personalization: 90, groundedness: 90, rationale: 'ok' });

/** Deps with a callRich that routes by prompt content; analyst responses come from a queue. */
function makeDeps(analystQueue: string[], occupationMatches: any[] = []) {
  const state = { toolCalls: 0, gathererTurns: 0 };
  const deps: AgentDeps = {
    callRich: async (prompt: string) => {
      if (prompt.includes('career-intake analyst')) {
        return { text: PROFILER_JSON, model: 'fake', usageTokens: 10, latencyMs: 1 };
      }
      if (prompt.includes('Chief Career Analyst')) {
        const text = analystQueue.shift() || analystQueue[analystQueue.length - 1];
        return { text, model: 'fake', usageTokens: 10, latencyMs: 1 };
      }
      // judge
      return { text: JUDGE_GOOD, model: 'fake', usageTokens: 5, latencyMs: 1 };
    },
    callContents: async () => {
      state.gathererTurns++;
      // First turn: one tool call. Second turn: DONE.
      if (state.gathererTurns === 1) {
        return { text: '', functionCalls: [{ name: 'lookupOccupation', args: { query: 'graphic designer' } }], model: 'fake', usageTokens: 10, latencyMs: 1 };
      }
      return { text: 'DONE', model: 'fake', usageTokens: 5, latencyMs: 1 };
    },
    executeTool: async (name: string) => {
      state.toolCalls++;
      if (name === 'lookupOccupation' && occupationMatches.length > 0) {
        return { ok: true, data: occupationMatches };
      }
      return { ok: true, data: [] };
    }
  };
  return { deps, state };
}

describe('runCareerPipeline', () => {
  it('runs the full pipeline and repairs once when the first analyst output fails verification', async () => {
    const { deps } = makeDeps([
      JSON.stringify([suggestion(false)]),  // attempt 1: hallucinated citation
      JSON.stringify([suggestion(true)])    // attempt 2: fixed
    ]);
    const result = await runCareerPipeline(INTAKE, DEFAULT_CONFIG, 'persona-test', deps);
    expect(result.source).toBe('agentic_pipeline');
    expect(result.suggestions[0].roleTitle).toBe('AI Art Director');
    expect(result.verification?.verdict).toBe('pass');
    const types = result.trajectory.events.map(e => e.type);
    expect(types).toContain('repair_retry');
    expect(types).toContain('tool_call');
    expect(result.meta.usageTokens).toBeGreaterThan(0);
    expect(result.trajectory.personaId).toBe('persona-test');
  });

  it('computes evidence resilience and deterministic USD fields after the repair loop', async () => {
    const { deps } = makeDeps(
      [JSON.stringify([suggestion(true)])],
      [{ key: 'graphic-designer', detail: { overallResilienceScore: 70 }, matchedQuery: 'graphic designer' }]
    );
    const result = await runCareerPipeline(INTAKE, DEFAULT_CONFIG, undefined, deps);
    expect(result.evidence.currentOccupationResilience).toBe(70);
    expect(result.suggestions[0].averageSalaryRangeUSD).toBe('$308 - $577 / month');
    expect(result.suggestions[0].roadmap[0].estimatedCostUSD).toBe(10);
  });

  it('skips tools and verifier when config flags are off', async () => {
    const { deps, state } = makeDeps([JSON.stringify([suggestion(true)])]);
    const result = await runCareerPipeline(INTAKE, { useTools: false, useVerifier: false }, undefined, deps);
    expect(state.toolCalls).toBe(0);
    expect(state.gathererTurns).toBe(0);
    expect(result.verification).toBeNull();
    expect(result.suggestions[0].roleTitle).toBe('AI Art Director');
  });

  it('keeps verifier but skips tools when only useTools=false', async () => {
    const { deps } = makeDeps([JSON.stringify([suggestion(true)])]);
    const result = await runCareerPipeline(INTAKE, { useTools: false, useVerifier: true }, undefined, deps);
    expect(result.verification?.verdict).toBe('pass');
    expect(result.suggestions[0].evidenceCitations?.[0].paperTitle).toBe(RESEARCH_LIBRARY[0].title);
  });

  it('gives up after max repair attempts and reports the failure honestly', async () => {
    // Analyst always returns the broken suggestion.
    const { deps } = makeDeps(Array.from({ length: 5 }, () => JSON.stringify([suggestion(false)])));
    const result = await runCareerPipeline(INTAKE, DEFAULT_CONFIG, undefined, deps);
    expect(result.verification?.verdict).toBe('repair');
    expect(result.suggestions[0].roleTitle).toBe('Broken Role');
    const retries = result.trajectory.events.filter(e => e.type === 'repair_retry').length;
    expect(retries).toBe(2);
  });

  it('recovers when the analyst returns unparseable JSON on the first attempt', async () => {
    // First analyst response is malformed JSON (long-output failure mode seen in eval);
    // the pipeline must retry with parse feedback instead of failing the whole run.
    const { deps } = makeDeps(['{invalid json from a truncated response', JSON.stringify([suggestion(true)])]);
    const result = await runCareerPipeline(INTAKE, DEFAULT_CONFIG, undefined, deps);
    expect(result.suggestions[0].roleTitle).toBe('AI Art Director');
    expect(result.verification?.verdict).toBe('pass');
    const types = result.trajectory.events.map(e => e.type);
    expect(types).toContain('error');
    expect(types).toContain('repair_retry');
  });

  it('forwards the evidence pack to the verifier so the pack floor forces coherence repair', async () => {
    // Suggestion is otherwise fully coherent (grounded citation, registry-backed
    // resource, valid trajectories) but its resilience score (60) sits BELOW the
    // pack floor (70) while ABOVE the empty-pack floor (55). Only a forwarded
    // pack makes the verifier demand repair — this pins orchestrator -> verifier
    // pack forwarding.
    const sug = suggestion(true);
    sug.resilienceDetail.overallResilienceScore = 60;
    sug.roadmap = [
      { milestoneNumber: 1, freeResources: [{ name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn' }] },
      { milestoneNumber: 2, freeResources: [] }
    ];
    const { deps } = makeDeps(
      Array.from({ length: 3 }, () => JSON.stringify([sug])),
      [{ key: 'graphic-designer', detail: { overallResilienceScore: 70 }, matchedQuery: 'graphic designer' }]
    );
    const result = await runCareerPipeline(INTAKE, DEFAULT_CONFIG, undefined, deps);
    const types = result.trajectory.events.map(e => e.type);
    expect(types).toContain('repair_retry');
    expect(result.verification?.verdict).toBe('repair');
    expect(
      result.verification?.failures.some(f => f.includes('coherence: top suggestion resilience 60 below floor 70'))
    ).toBe(true);
  });
});
