import { describe, it, expect } from 'vitest';
import { scoreOutput, aggregate, isActionable } from '../score';
import { RESEARCH_LIBRARY } from '../../src/data/researchLibrary';
import { checkCoherence } from '../../src/agents/coherence';
import { LEARNING_RESOURCE_URLS } from '../../src/data/learningResources';
import { EVAL_PERSONAS } from '../personas';
import type { AgentDeps } from '../../src/agents/deps';

const judgeDeps: AgentDeps = {
  callRich: async () => ({
    text: JSON.stringify({ personalization: 75, groundedness: 80, rationale: 'ok' }),
    model: 'fake', usageTokens: 5, latencyMs: 1
  }),
  callContents: async () => { throw new Error('not used'); },
  executeTool: async () => ({ ok: true, data: [] })
};

function okPayload(): any {
  return {
    suggestions: [{
      roleTitle: 'Data Analyst',
      roleTitleVi: 'Phân tích dữ liệu',
      matchScore: 80,
      reasoning: 'This role fits well with the user skills',
      evidenceCitations: [{ paperTitle: RESEARCH_LIBRARY[0].title, source: 'x', year: 2024, url: 'https://x.org', quoteOrDataPoint: 'q' }],
      trajectories: [
        { pathId: 'a', feasibilityScore: 85, rationale: 'Good fit', actionStepNow: 'Learn SQL', shortDescription: 'Path A' },
        { pathId: 'b', feasibilityScore: 75, rationale: 'Alternative', actionStepNow: 'Take course', shortDescription: 'Path B' },
        { pathId: 'c', feasibilityScore: 70, rationale: 'Another option', actionStepNow: 'Build portfolio', shortDescription: 'Path C' }
      ],
      roadmap: [
        { title: 'Step 1', description: 'Learn basics' },
        { title: 'Step 2', description: 'Practice' }
      ],
      resilienceDetail: {
        overallResilienceScore: 70,
        tasksBreakdown: [{ taskName: 'Data cleaning' }, { taskName: 'Visualization' }]
      }
    }],
    meta: { usageTokens: 5000, latencyMs: 25000, models: ['fake'] }
  };
}

describe('scoreOutput', () => {
  it('scores a grounded output', async () => {
    const score = await scoreOutput('persona-x', 'baseline', okPayload(), { currentRole: 'Accountant' } as any, judgeDeps);
    expect(score.ok).toBe(true);
    expect(score.groundingRate).toBe(1);
    expect(score.hallucinatedCount).toBe(0);
    expect(score.schemaFailures).toBe(0);
    expect(score.personalization).toBe(75);
    expect(score.usageTokens).toBe(5005); // payload + judge
    expect(score.costPerTaskUsd).toBeCloseTo(5005 * 0.3 / 1_000_000, 8);
  });

  it('counts hallucinated citations', async () => {
    const payload = okPayload();
    payload.suggestions[0].evidenceCitations.push({
      paperTitle: 'Fake Journal of Nowhere', source: 'x', year: 2024, url: 'https://x.org', quoteOrDataPoint: 'q'
    });
    const score = await scoreOutput('persona-x', 'baseline', payload, { currentRole: 'Accountant' } as any, judgeDeps);
    expect(score.groundingRate).toBeCloseTo(0.5);
    expect(score.hallucinatedCount).toBe(1);
  });

  it('marks failed runs honestly without throwing', async () => {
    const score = await scoreOutput('persona-x', 'baseline', { error: 'boom' }, { currentRole: 'A' } as any, judgeDeps);
    expect(score.ok).toBe(false);
    expect(score.groundingRate).toBeNull();
  });
});

describe('aggregate', () => {
  it('aggregates per config', async () => {
    const scores = [
      await scoreOutput('p1', 'baseline', okPayload(), { currentRole: 'A' } as any, judgeDeps),
      await scoreOutput('p2', 'baseline', okPayload(), { currentRole: 'B' } as any, judgeDeps),
      await scoreOutput('p3', 'baseline', { error: 'x' }, { currentRole: 'C' } as any, judgeDeps)
    ];
    const summary = aggregate(scores);
    expect(summary.runs).toBe(3);
    expect(summary.okRuns).toBe(2);
    expect(summary.groundingRate).toBe(1);
    expect(summary.schemaValidRate).toBe(1);
  });
});

describe('checkCoherence integration', () => {
  const coherentSug = (over: any = {}) => ({
    roleTitle: 'X', matchScore: 80,
    evidenceCitations: [{ paperTitle: 'Real', url: 'https://x.org' }],
    resilienceDetail: { overallResilienceScore: 70, uncertaintyRange: '±5', vietnamDemandSignal: 'stable' },
    trajectories: [{ pathId: 'a', feasibilityScore: 70, riskLevel: 'low', actionStepNow: 'start a free course' }],
    roadmap: [{ costTier: 'free', freeResources: [{ url: [...LEARNING_RESOURCE_URLS][0] }] }],
    ...over
  });

  it('marks a coherent run coherent', () => {
    expect(checkCoherence([coherentSug()], 60)).toEqual([]);
  });

  it('flags low-resilience top suggestion as incoherent', () => {
    expect(checkCoherence([coherentSug({ resilienceDetail: { overallResilienceScore: 40, uncertaintyRange: '±5', vietnamDemandSignal: 'stable' } })], 60).length).toBeGreaterThan(0);
  });
});

describe('isActionable', () => {
  const regUrl = [...LEARNING_RESOURCE_URLS][0];
  it('requires registry url, actionStepNow and a free/low-cost milestone', () => {
    const good = [{ trajectories: [{ actionStepNow: 'x' }], roadmap: [{ costTier: 'free', freeResources: [{ url: regUrl }] }] }];
    const noFree = [{ trajectories: [{ actionStepNow: 'x' }], roadmap: [{ costTier: 'paid', freeResources: [{ url: regUrl }] }] }];
    const fakeUrl = [{ trajectories: [{ actionStepNow: 'x' }], roadmap: [{ costTier: 'free', freeResources: [{ url: 'https://example.com/x' }] }] }];
    const noStep = [{ trajectories: [{ actionStepNow: '' }], roadmap: [{ costTier: 'free', freeResources: [{ url: regUrl }] }] }];
    expect(isActionable(good)).toBe(true);
    expect(isActionable(noFree)).toBe(false);
    expect(isActionable(fakeUrl)).toBe(false);
    expect(isActionable(noStep)).toBe(false);
    expect(isActionable([])).toBe(false);
  });
});

describe('persona set', () => {
  it('has 16 personas with segments and one challenging case', () => {
    expect(EVAL_PERSONAS.length).toBe(16);
    expect(EVAL_PERSONAS.every(p => !!p.segment)).toBe(true);
    expect(EVAL_PERSONAS.filter(p => p.challenging).length).toBe(1);
  });
});

describe('isActionable hardening against malformed baseline output', () => {
  it('does not throw when roadmap/freeResources/trajectories are non-array', () => {
    const malformed = [{ roadmap: { m1: { freeResources: 'https://www.freecodecamp.org/learn' } }, trajectories: 'none' }];
    expect(() => isActionable(malformed)).not.toThrow();
    expect(isActionable(malformed)).toBe(false);
    const nullish = [{ roadmap: null, trajectories: undefined }];
    expect(() => isActionable(nullish)).not.toThrow();
  });
});
