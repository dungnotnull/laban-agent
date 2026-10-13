import { describe, it, expect } from 'vitest';
import { checkCoherence, currentOccupationResilience, UNKNOWN_OCCUPATION_FLOOR } from '../coherence';

const sug = (over: any = {}) => ({
  roleTitle: 'X',
  resilienceDetail: { overallResilienceScore: 70, uncertaintyRange: '±8', vietnamDemandSignal: 'stable' },
  trajectories: [
    { pathId: 'stay_augment', riskLevel: 'low', actionStepNow: 'do' },
    { pathId: 'pivot_adjacent', riskLevel: 'moderate', actionStepNow: 'do' },
    { pathId: 'full_switch', riskLevel: 'high', actionStepNow: 'do' }
  ],
  ...over
});

describe('currentOccupationResilience', () => {
  it('returns max resilience of pack occupations', () => {
    const pack: any = { occupations: [{ detail: { overallResilienceScore: 61 } }, { detail: { overallResilienceScore: 44 } }] };
    expect(currentOccupationResilience(pack)).toBe(61);
  });
  it('returns null for empty pack', () => {
    expect(currentOccupationResilience({ occupations: [] } as any)).toBeNull();
  });
});

describe('checkCoherence', () => {
  it('passes a coherent top suggestion', () => {
    expect(checkCoherence([sug()], 60)).toEqual([]);
  });

  it('C1 fails when top suggestion is below the current-occupation floor', () => {
    const f = checkCoherence([sug({ resilienceDetail: { overallResilienceScore: 42, uncertaintyRange: '±8', vietnamDemandSignal: 'stable' } })], 60);
    expect(f.some(x => x.includes('coherence: top suggestion resilience'))).toBe(true);
  });

  it('C1 applies the unknown-occupation floor when current is null', () => {
    const ok = checkCoherence([sug({ resilienceDetail: { overallResilienceScore: UNKNOWN_OCCUPATION_FLOOR, uncertaintyRange: '±8', vietnamDemandSignal: 'stable' } })], null);
    expect(ok).toEqual([]);
    const bad = checkCoherence([sug({ resilienceDetail: { overallResilienceScore: 50, uncertaintyRange: '±8', vietnamDemandSignal: 'stable' } })], null);
    expect(bad.length).toBeGreaterThan(0);
  });

  it('C2 fails a declining demand signal on the top suggestion', () => {
    const f = checkCoherence([sug({ resilienceDetail: { overallResilienceScore: 80, uncertaintyRange: '±8', vietnamDemandSignal: 'declining' } })], 60);
    expect(f.some(x => x.includes("demand signal is 'declining'"))).toBe(true);
  });

  it('C3 fails missing uncertaintyRange and empty actionStepNow', () => {
    const s = sug();
    delete (s.resilienceDetail as any).uncertaintyRange;
    s.trajectories[1].actionStepNow = '';
    const f = checkCoherence([s], 60);
    expect(f.some(x => x.includes('uncertaintyRange'))).toBe(true);
    expect(f.some(x => x.includes('actionStepNow'))).toBe(true);
  });

  it('C3 flags a riskLevel outside the enum', () => {
    const s = sug();
    (s.trajectories[2] as any).riskLevel = 'extreme';
    const f = checkCoherence([s], 60);
    expect(f.some(x => x.includes('riskLevel'))).toBe(true);
  });

  it('C1 fails on NaN resilience score', () => {
    const f = checkCoherence([sug({ resilienceDetail: { overallResilienceScore: NaN, uncertaintyRange: '±8', vietnamDemandSignal: 'stable' } })], 60);
    expect(f.some(x => x.includes('coherence: top suggestion resilience'))).toBe(true);
  });

  it('C3 skips null trajectory entries without throwing', () => {
    const s = sug();
    (s.trajectories as any[])[1] = null;
    expect(() => checkCoherence([s], 60)).not.toThrow();
  });
});
