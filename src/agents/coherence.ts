import type { EvidencePack } from './tools';

// Decision-coherence rules (deterministic, no LLM). Design spec section A:
// verified citations can still support a bad decision, so the verifier also
// checks that the recommended DIRECTION is defensible.

export const UNKNOWN_OCCUPATION_FLOOR = 55;
const RISK_LEVELS = ['low', 'moderate', 'high'];

/** Max resilience among the user's current-occupation DB matches, or null when unmatched. */
export function currentOccupationResilience(pack: EvidencePack): number | null {
  if (pack.occupations.length === 0) return null;
  return Math.max(...pack.occupations.map(m => m.detail.overallResilienceScore ?? 0));
}

export function checkCoherence(suggestions: any[], currentResilience: number | null): string[] {
  const failures: string[] = [];
  if (!Array.isArray(suggestions) || suggestions.length === 0) return failures;

  const top = suggestions[0] || {};
  const floor = currentResilience ?? UNKNOWN_OCCUPATION_FLOOR;
  const topScore = top.resilienceDetail?.overallResilienceScore;
  if (typeof topScore !== 'number' || topScore < floor) {
    failures.push(`coherence: top suggestion resilience ${topScore ?? 'missing'} below floor ${floor}`);
  }
  if (top.resilienceDetail?.vietnamDemandSignal === 'declining') {
    failures.push(`coherence: top suggestion demand signal is 'declining'`);
  }

  suggestions.forEach((sug, i) => {
    const tag = `suggestion[${i}]`;
    if (!sug?.resilienceDetail?.uncertaintyRange) {
      failures.push(`${tag}: coherence: missing uncertaintyRange`);
    }
    for (const t of sug?.trajectories || []) {
      if (!RISK_LEVELS.includes(t.riskLevel)) {
        failures.push(`${tag}: coherence: trajectory '${t.pathId}' riskLevel missing or invalid`);
      }
      if (!t.actionStepNow) {
        failures.push(`${tag}: coherence: trajectory '${t.pathId}' missing actionStepNow`);
      }
    }
  });
  return failures;
}
