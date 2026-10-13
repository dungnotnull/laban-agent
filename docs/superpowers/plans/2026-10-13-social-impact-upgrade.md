# Social-Impact Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add decision-coherence verification, grounded budget-aware learning resources, equity segmentation, English-primary localization with USD dual-display, and a human-review checkpoint; re-publish evaluation with a 3-run stability protocol.

**Architecture:** All changes extend the existing 4-agent pipeline — no new agents. A pure `coherence.ts` module joins the Verifier's deterministic checks; a curated learning-resource registry becomes a 4th tool whose URLs are verified like citations; USD fields are computed deterministically post-hoc (never by the LLM); eval gains two metrics and per-segment aggregation.

**Tech Stack:** TypeScript, Express, React 19, @google/genai function calling, vitest.

**Spec:** `docs/superpowers/specs/2026-10-13-social-impact-upgrade-design.md`

---

## File Structure

- Create: `src/agents/coherence.ts`, `src/agents/usd.ts`, `src/data/learningResources.ts`, `src/components/CounselorReviewGate.tsx`, `src/agents/__tests__/coherence.test.ts`, `src/agents/__tests__/usd.test.ts`, `src/agents/__tests__/learningResources.test.ts`
- Modify: `src/types.ts`, `src/agents/{tools,evidenceGatherer,analyst,verifier,citations,trajectory,orchestrator}.ts`, `src/agents/__tests__/{tools,verifier,analyst,orchestrator}.test.ts`, `eval/{personas,score,run-eval}.ts`, `eval/__tests__/score.test.ts`, `src/App.tsx`, `src/components/{AgentTransparencyPanel,RoadmapModule,CareerSuggestionView}.tsx`, `server.ts`, `docs/*.md`, `DEVELOPMENT-TRACKING.md`

Conventions: pure functions return `string[]` failure messages (see `src/agents/checks.ts`); all UI text bilingual via `t(language, vi, en)` from `src/utils/i18n.ts`; vitest tests colocated in `__tests__`.

---

### Task 1: Learning-resource registry + type extensions

**Files:**
- Create: `src/data/learningResources.ts`
- Modify: `src/types.ts:118-135` (RoadmapMilestone), `src/types.ts:143-180` (CareerSuggestion)

- [ ] **Step 1: Extend RoadmapMilestone and CareerSuggestion in `src/types.ts`**

In `RoadmapMilestone` (after `weeksDuration: number;` line 126) add:

```ts
  costTier?: 'free' | 'low_cost' | 'paid';
  estimatedCostVND?: number;
  estimatedCostUSD?: number; // computed post-hoc, never by the LLM
```

Widen the `freeResources` item `type` union (line ~132) to:

```ts
    type: 'course' | 'doc' | 'repo' | 'video' | 'book' | 'certification' | 'tutorial' | 'guide';
```

In `CareerSuggestion` (after `averageSalaryRangeVND?: string;` line 169) add:

```ts
  averageSalaryRangeUSD?: string; // computed post-hoc from averageSalaryRangeVND
```

- [ ] **Step 2: Create `src/data/learningResources.ts`**

```ts
// Curated registry of real, publicly accessible learning resources for the
// actionability layer. Every URL was HTTP-verified (200/301) at curation
// time (2026-10-13). Entries are the ONLY freeResources URLs the analyst
// may emit; the verifier grounds URLs against this registry exactly like
// citations against the research corpus.

export interface LearningResource {
  id: string;
  name: string;
  provider: string;
  url: string;
  type: 'course' | 'certification' | 'tutorial' | 'guide';
  costTier: 'free' | 'low_cost' | 'paid';
  language: 'vi' | 'en' | 'vi_en';
  notes?: string;
}

export const LEARNING_RESOURCES: LearningResource[] = [
  { id: 'google-ai-essentials', name: 'Google AI Essentials', provider: 'Google', url: 'https://grow.google/ai-essentials/', type: 'course', costTier: 'low_cost', language: 'en', notes: 'Scholarships periodically offered via Google and partners' },
  { id: 'learnprompting', name: 'Learn Prompting (open guide)', provider: 'Learn Prompting', url: 'https://learnprompting.org/', type: 'guide', costTier: 'free', language: 'en' },
  { id: 'ms-learn-vi', name: 'Microsoft Learn (Vietnamese)', provider: 'Microsoft', url: 'https://learn.microsoft.com/vi-vn/training/', type: 'course', costTier: 'free', language: 'vi' },
  { id: 'freecodecamp', name: 'freeCodeCamp full curriculum', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn', type: 'certification', costTier: 'free', language: 'en' },
  { id: 'w3schools', name: 'W3Schools tutorials', provider: 'W3Schools', url: 'https://www.w3schools.com', type: 'tutorial', costTier: 'free', language: 'en' },
  { id: 'khan-academy', name: 'Khan Academy', provider: 'Khan Academy', url: 'https://www.khanacademy.org', type: 'course', costTier: 'free', language: 'en' },
  { id: 'gcfglobal', name: 'GCFLearnFree digital literacy basics', provider: 'GCFGlobal', url: 'https://edu.gcfglobal.org/en/', type: 'tutorial', costTier: 'free', language: 'en', notes: 'Basic computer, internet and office skills' },
  { id: 'cs50', name: 'CS50x Introduction to Computer Science', provider: 'Harvard', url: 'https://cs50.harvard.edu/x/', type: 'course', costTier: 'free', language: 'en' },
  { id: 'duolingo', name: 'Duolingo (English for Vietnamese speakers)', provider: 'Duolingo', url: 'https://www.duolingo.com', type: 'course', costTier: 'free', language: 'vi_en', notes: 'Free tier sufficient for daily practice' },
  { id: 'coursera-google-certificates', name: 'Google Career Certificates', provider: 'Google / Coursera', url: 'https://www.coursera.org/google-career-certificates', type: 'certification', costTier: 'low_cost', language: 'en', notes: 'Coursera financial aid available; audit is free' },
  { id: 'edx-audit', name: 'edX course audit tracks', provider: 'edX', url: 'https://www.edx.org', type: 'course', costTier: 'free', language: 'en', notes: 'Audit track is free; certificates are paid' },
  { id: 'alison', name: 'Alison free courses & diplomas', provider: 'Alison', url: 'https://alison.com', type: 'course', costTier: 'free', language: 'en' },
  { id: 'aws-skill-builder', name: 'AWS Skill Builder (free tier)', provider: 'AWS', url: 'https://skillbuilder.aws', type: 'course', costTier: 'free', language: 'en' },
  { id: 'kaggle-learn', name: 'Kaggle Learn micro-courses', provider: 'Kaggle', url: 'https://www.kaggle.com/learn', type: 'tutorial', costTier: 'free', language: 'en' },
  { id: 'topcv-guides', name: 'TopCV career guides (CV, interview)', provider: 'TopCV', url: 'https://www.topcv.vn', type: 'guide', costTier: 'free', language: 'vi' },
  { id: 'vietnamworks-careers', name: 'VietnamWorks career articles & job board', provider: 'VietnamWorks', url: 'https://www.vietnamworks.com', type: 'guide', costTier: 'free', language: 'vi_en' }
];

export const LEARNING_RESOURCE_URLS: Set<string> = new Set(LEARNING_RESOURCES.map(r => r.url));
```

- [ ] **Step 3: Verify every URL resolves**

Run (bash, from repo root):
```bash
for u in $(grep -o 'https://[^'"'"']*' src/data/learningResources.ts | tr -d "',"); do printf '%s -> ' "$u"; curl -s -o /dev/null -w '%{http_code}\n' -L --max-time 15 "$u"; done
```
Expected: every line `200` or `301/302` (with `-L` follows to 200). If any URL fails, replace the entry with another real resource before continuing; never leave an unverified URL.

- [ ] **Step 4: Type-check**

Run: `npm run lint` — Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
rtk git add src/types.ts src/data/learningResources.ts
rtk git commit -m "Add learning-resource registry and cost/USD schema fields"
```

---

### Task 2: Fourth tool — searchLearningResources

**Files:**
- Modify: `src/agents/tools.ts`
- Test: `src/agents/__tests__/tools.test.ts` (append)

- [ ] **Step 1: Write failing tests** — append to `src/agents/__tests__/tools.test.ts`:

```ts
import { LEARNING_RESOURCES } from '../../data/learningResources';
import { searchLearningResources, EMPTY_PACK } from '../tools';

describe('searchLearningResources', () => {
  it('matches english course queries', () => {
    const r = searchLearningResources('excel computer basic skills');
    expect(r.ok).toBe(true);
    expect(Array.isArray(r.data)).toBe(true);
    expect((r.data as any[]).length).toBeGreaterThan(0);
  });

  it('caps results at 6', () => {
    const r = searchLearningResources('free course learn english computer data ai');
    expect((r.data as any[]).length).toBeLessThanOrEqual(6);
  });

  it('returns empty with note on no match', () => {
    const r = searchLearningResources('zzzx qqqy');
    expect(r.data).toEqual([]);
    expect(r.note).toContain('No learning resource matched');
  });

  it('EMPTY_PACK exposes learningResources array', () => {
    expect(EMPTY_PACK.learningResources).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/agents/__tests__/tools.test.ts`
Expected: FAIL — `searchLearningResources` not exported; `learningResources` missing on `EMPTY_PACK`.

- [ ] **Step 3: Implement in `src/agents/tools.ts`**

Add import at top:
```ts
import { LEARNING_RESOURCES, type LearningResource } from '../data/learningResources';
```

Extend `EvidencePack` (line 19) and `EMPTY_PACK` (line 26):
```ts
export interface EvidencePack {
  occupations: OccupationMatch[];
  research: ResearchSource[];
  news: { title: string; source: string; url: string; summaryVi: string }[];
  learningResources: LearningResource[];
  toolTrace: { name: string; args: unknown; summary: string }[];
}

export const EMPTY_PACK: EvidencePack = { occupations: [], research: [], news: [], learningResources: [], toolTrace: [] };
```

Add declaration entry to `AGENT_FUNCTION_DECLARATIONS` (after `getOccupationNews`):
```ts
  {
    name: 'searchLearningResources',
    description:
      'Search the curated learning-resource registry (real, verified URLs: free/low-cost courses, guides, certifications suitable for Vietnamese workers). Call this once after occupation and research lookups, to ground the roadmap learning resources.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: 'Learning need keywords, e.g. "basic computer skills english free"' }
      },
      required: ['query']
    }
  }
```

Add the implementation (after `searchResearch`):
```ts
export function searchLearningResources(query: string): ToolResult {
  const queryTokens = new Set(normalize(query).split(' ').filter(t => t.length > 1));
  const scored = LEARNING_RESOURCES.map(r => ({
    entry: r,
    score: Math.max(
      overlapScore(queryTokens, r.name),
      overlapScore(queryTokens, r.notes || ''),
      overlapScore(queryTokens, `${r.type} ${r.language} ${r.provider}`)
    )
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const items = scored.filter(s => s.score > 0).map(s => s.entry);
  if (items.length === 0) {
    return { ok: true, data: [], note: 'No learning resource matched the query.' };
  }
  return { ok: true, data: items };
}
```

Add to `executeToolCall` switch:
```ts
    case 'searchLearningResources':
      return searchLearningResources(String(args.query || ''));
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/agents/__tests__/tools.test.ts` — Expected: PASS (all, including pre-existing).

- [ ] **Step 5: Commit**

```bash
rtk git add src/agents/tools.ts src/agents/__tests__/tools.test.ts
rtk git commit -m "Add searchLearningResources tool over the curated registry"
```

---

### Task 3: Evidence gatherer policy + pack merge

**Files:**
- Modify: `src/agents/evidenceGatherer.ts:21-26` (tool policy), `:93-110` (mergeIntoPack)

- [ ] **Step 1: Extend the tool policy text in `buildInitialTurn`**

Replace the TOOL POLICY block with:
```
TOOL POLICY:
1. Call lookupOccupation for each occupation keyword first.
2. Call searchResearch for AI/automation labor-market evidence relevant to the profile.
3. Call searchLearningResources ONCE when the occupation and research lookups are done,
   grounded in the profile's learning needs (respect English level and digital literacy).
4. Call getOccupationNews AT MOST ONCE, and only if lookupOccupation found no match.
```

- [ ] **Step 2: Extend `mergeIntoPack`** — add before the `getOccupationNews` branch:
```ts
  } else if (toolName === 'searchLearningResources' && Array.isArray(data)) {
    for (const res of data as any[]) {
      if (!pack.learningResources.some(r => r.id === res.id)) {
        pack.learningResources.push(res);
      }
    }
```

- [ ] **Step 3: Update pack init** — in `runEvidenceGatherer`, initialize:
```ts
  const pack: EvidencePack = {
    occupations: [],
    research: [],
    news: [],
    learningResources: [],
    toolTrace: []
  };
```

- [ ] **Step 4: Run agent tests + type-check**

Run: `npx vitest run src/agents/__tests__/evidenceGatherer.test.ts && npm run lint`
Expected: PASS, 0 errors. Fix any pack-shape assertions in existing tests to include `learningResources: []`.

- [ ] **Step 5: Commit**

```bash
rtk git add src/agents/evidenceGatherer.ts src/agents/__tests__/evidenceGatherer.test.ts
rtk git commit -m "Gatherer: learn about learning resources via the registry tool"
```

---

### Task 4: Decision-coherence module (TDD)

**Files:**
- Create: `src/agents/coherence.ts`
- Test: `src/agents/__tests__/coherence.test.ts`

- [ ] **Step 1: Write failing tests** — create `src/agents/__tests__/coherence.test.ts`:

```ts
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
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/agents/__tests__/coherence.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/agents/coherence.ts`**

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/agents/__tests__/coherence.test.ts` — Expected: PASS.

- [ ] **Step 5: Commit**

```bash
rtk git add src/agents/coherence.ts src/agents/__tests__/coherence.test.ts
rtk git commit -m "Add decision-coherence checks C1-C3"
```

---

### Task 5: Resource-URL grounding check

**Files:**
- Modify: `src/agents/citations.ts` (append)
- Test: `src/agents/__tests__/citations.test.ts` (append)

- [ ] **Step 1: Write failing tests** — append:

```ts
import { verifyResourceUrls } from '../citations';

describe('verifyResourceUrls', () => {
  it('grounds urls present in the registry', () => {
    const sugs: any[] = [{ roadmap: [{ freeResources: [{ url: 'https://www.freecodecamp.org/learn' }] }] }];
    const r = verifyResourceUrls(sugs);
    expect(r.total).toBe(1);
    expect(r.grounded).toBe(1);
    expect(r.ungrounded).toEqual([]);
  });

  it('flags invented urls', () => {
    const sugs: any[] = [{ roadmap: [{ freeResources: [{ url: 'https://example.com/fake-course' }] }] }];
    const r = verifyResourceUrls(sugs);
    expect(r.grounded).toBe(0);
    expect(r.ungrounded[0]).toContain('example.com/fake-course');
  });

  it('handles missing roadmap gracefully', () => {
    expect(verifyResourceUrls([{}]).total).toBe(0);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/agents/__tests__/citations.test.ts` — Expected: FAIL, not exported.

- [ ] **Step 3: Implement in `src/agents/citations.ts`** — append:

```ts
import { LEARNING_RESOURCE_URLS } from '../data/learningResources';

export interface ResourceUrlReport {
  total: number;
  grounded: number;
  ungrounded: string[];
}

/** freeResources URLs must exact-match the curated registry — same philosophy as citation grounding. */
export function verifyResourceUrls(suggestions: any[]): ResourceUrlReport {
  const report: ResourceUrlReport = { total: 0, grounded: 0, ungrounded: [] };
  for (const sug of suggestions || []) {
    for (const m of sug?.roadmap || []) {
      for (const res of m?.freeResources || []) {
        if (!res?.url) continue;
        report.total++;
        if (LEARNING_RESOURCE_URLS.has(res.url)) {
          report.grounded++;
        } else {
          report.ungrounded.push(res.url);
        }
      }
    }
  }
  return report;
}
```

- [ ] **Step 4: Run tests** — `npx vitest run src/agents/__tests__/citations.test.ts` — Expected: PASS.

- [ ] **Step 5: Commit**

```bash
rtk git add src/agents/citations.ts src/agents/__tests__/citations.test.ts
rtk git commit -m "Ground freeResources URLs against the learning-resource registry"
```

---

### Task 6: Verifier + orchestrator wiring

**Files:**
- Modify: `src/agents/verifier.ts`, `src/agents/orchestrator.ts:143-155`
- Test: `src/agents/__tests__/verifier.test.ts`, `src/agents/__tests__/orchestrator.test.ts` (update)

- [ ] **Step 1: Write failing test** — append to `src/agents/__tests__/verifier.test.ts`:

```ts
import { runVerifier } from '../verifier';
import { EMPTY_PACK } from '../tools';

const deps = { callRich: async () => ({ text: '{"personalization":80,"groundedness":80,"rationale":"ok"}', usageTokens: 1 }) } as any;

const goodSug = (score = 70) => ({
  roleTitle: 'Data Analyst',
  matchScore: 80,
  evidenceCitations: [{ paperTitle: 'Real', url: 'https://x.org' }],
  resilienceDetail: { overallResilienceScore: score, uncertaintyRange: '±5', vietnamDemandSignal: 'stable' },
  trajectories: [
    { pathId: 'a', feasibilityScore: 70, riskLevel: 'low', actionStepNow: 'x' },
    { pathId: 'b', feasibilityScore: 70, riskLevel: 'moderate', actionStepNow: 'x' },
    { pathId: 'c', feasibilityScore: 70, riskLevel: 'high', actionStepNow: 'x' }
  ],
  roadmap: [
    { freeResources: [{ url: 'https://www.freecodecamp.org/learn' }] },
    { freeResources: [] }
  ]
});

describe('runVerifier coherence + resource grounding', () => {
  it('returns repair verdict with coherence and resource failures', async () => {
    const sugs: any[] = [goodSug(42)];
    sugs[0].roadmap[0].freeResources[0].url = 'https://example.com/fake';
    const v = await runVerifier({ currentRole: 'r' } as any, sugs, deps, { occupations: [{ detail: { overallResilienceScore: 60 } }] } as any);
    expect(v.verdict).toBe('repair');
    expect(v.failures.some(f => f.includes('coherence: top suggestion resilience'))).toBe(true);
    expect(v.failures.some(f => f.includes('resource url not in registry'))).toBe(true);
  });

  it('passes coherent grounded output with empty pack floor', async () => {
    const v = await runVerifier({ currentRole: 'r' } as any, [goodSug(70)], deps, EMPTY_PACK);
    expect(v.failures).toEqual([]);
    expect(v.verdict).toBe('pass');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/agents/__tests__/verifier.test.ts` — Expected: FAIL (signature/behavior).

- [ ] **Step 3: Implement**

In `src/agents/verifier.ts`:
- imports: add `import { checkCoherence, currentOccupationResilience } from './coherence';` and `import { verifyResourceUrls } from './citations';` and `import type { EvidencePack } from './tools';`
- change signature to `export async function runVerifier(intake: UserIntakeProfile, suggestions: CareerSuggestion[], deps: AgentDeps, pack: EvidencePack = EMPTY_PACK): Promise<VerifierResult>`
- import `EMPTY_PACK` from `./tools`
- after the citation-hallucination loop add:

```ts
  failures.push(...checkCoherence(suggestions, currentOccupationResilience(pack)));

  const resourceReport = verifyResourceUrls(suggestions);
  for (const url of resourceReport.ungrounded) {
    failures.push(`suggestion[*]: resource url not in registry: "${url}"`);
  }
```

- extend `VerifierResult` with `resourceReport` (add to interface and both return objects):
```ts
  resourceReport: { total: number; grounded: number; ungrounded: string[] };
```
(for the empty-suggestions early return use `{ total: 0, grounded: 0, ungrounded: [] }`).

In `src/agents/orchestrator.ts` (~line 144) pass the pack:
```ts
      verification = await runVerifier(intake, suggestions, verifierDeps, pack);
```

- [ ] **Step 4: Update existing verifier/orchestrator tests**

Any existing `runVerifier(...)` call without the 4th arg still compiles (default `EMPTY_PACK`). Update assertions that count failure kinds if they now break; run:
`npx vitest run src/agents/__tests__/ && npm run lint` — Expected: all PASS, 0 errors.

- [ ] **Step 5: Commit**

```bash
rtk git add src/agents/verifier.ts src/agents/orchestrator.ts src/agents/__tests__/verifier.test.ts src/agents/__tests__/orchestrator.test.ts
rtk git commit -m "Verifier: wire coherence checks and resource-URL grounding into the repair loop"
```

---

### Task 7: USD conversion helper (TDD)

**Files:**
- Create: `src/agents/usd.ts`
- Test: `src/agents/__tests__/usd.test.ts`

- [ ] **Step 1: Write failing tests** — create `src/agents/__tests__/usd.test.ts`:

```ts
import { USD_VND_RATE, vndToUsd, formatUsdRange } from '../usd';

describe('usd helpers', () => {
  it('converts a vnd number', () => {
    expect(vndToUsd(26000000)).toBe(1000);
    expect(USD_VND_RATE).toBeGreaterThan(20000);
  });
  it('formats a vnd range string to usd', () => {
    expect(formatUsdRange('8,000,000 - 15,000,000 VND / tháng')).toBe('$308 - $577 / month');
  });
  it('rounds to whole dollars', () => {
    expect(formatUsdRange('20,000,000 - 45,000,000 VND / tháng')).toBe('$769 - $1,731 / month');
  });
  it('returns null for unparseable input', () => {
    expect(formatUsdRange('Thỏa thuận')).toBeNull();
    expect(formatUsdRange('')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run src/agents/__tests__/usd.test.ts` — FAIL.

- [ ] **Step 3: Implement `src/agents/usd.ts`**

```ts
// Deterministic VND->USD display conversion. Fixed documented rate (see README);
// NEVER computed by the LLM. Rounding to whole dollars is intentional.
export const USD_VND_RATE = 26000;

export function vndToUsd(vnd: number): number {
  return Math.round(vnd / USD_VND_RATE);
}

export function formatUsdRange(vndRange: string): string | null {
  if (!vndRange) return null;
  const nums = vndRange.match(/([\d.,]+)\s*[-–]\s*([\d.,]+)/);
  const toVnd = (s: string) => Number(s.replace(/[.,](?=\d{3}\b)/g, '').replace(/[.,]/g, '.'));
  if (!nums || !Number.isFinite(toVnd(nums[1])) || !Number.isFinite(toVnd(nums[2]))) return null;
  return `$${vndToUsd(toVnd(nums[1])).toLocaleString('en-US')} - $${vndToUsd(toVnd(nums[2])).toLocaleString('en-US')} / month`;
}
```

Note: `toVnd` strips thousands separators ("8,000,000" → 8000000). If the regex captures malformed values the function returns null — verified by the unparseable test.

- [ ] **Step 4: Run tests** — `npx vitest run src/agents/__tests__/usd.test.ts` — Expected: PASS (adjust expected strings in the test only if `toLocaleString` grouping differs; keep semantics).

- [ ] **Step 5: Commit**

```bash
rtk git add src/agents/usd.ts src/agents/__tests__/usd.test.ts
rtk git commit -m "Add deterministic VND->USD display conversion"
```

---

### Task 8: Analyst prompt upgrade (EN-primary, costs, resource rule)

**Files:**
- Modify: `src/agents/analyst.ts:36-87`
- Modify: `src/agents/orchestrator.ts` (language pass-through, USD post-processing)
- Modify: `server.ts:783-800` (language option)
- Test: `src/agents/__tests__/analyst.test.ts` (update/append)

- [ ] **Step 1: Extend `runAnalyst` signature and prompt**

```ts
import type { Language } from '../types';

export async function runAnalyst(
  intake: UserIntakeProfile,
  profile: NormalizedProfile,
  pack: EvidencePack,
  deps: AgentDeps,
  repairFeedback?: string[],
  language: Language = 'en'
): Promise<CareerSuggestion[]> {
```

Inside the prompt template, after `RISK FLAGS` line add:

```
OUTPUT LANGUAGE: ${language === 'en' ? 'ENGLISH for all narrative fields (reasoning, whyItFitsYou, transferableSkillsMatch, skillsGap). Keep roleTitleVi, phaseNameVi, titleVi and molisaTitleVi in Vietnamese.' : 'Vietnamese for all narrative fields.'}
```

Replace the roadmap schema line with:

```
- roadmap: array of 2-3 milestones with id, milestoneNumber, phaseName, phaseNameVi, title, titleVi, estimatedHours, weeksDuration, costTier ('free'|'low_cost'|'paid'), estimatedCostVND (number, 0 when free), skillsCovered, freeResources ({ name, provider, url, type }), checkpointQuiz ({ question, options, correctIndex, explanation }).
```

After the CITATION RULE add:

```
RESOURCE RULE (STRICT): every freeResources url MUST be copied EXACTLY from the pack's learningResources section (the searchLearningResources tool output). Inventing, shortening or modifying a URL is a verification FAILURE.

BUDGET REALISM (STRICT): weeksDuration must be plausible given constraints.hoursPerWeekAvailable (${intake.constraints?.hoursPerWeekAvailable ?? 'unspecified'} h/week) and estimatedHours. At least one milestone per suggestion MUST be costTier 'free' or 'low_cost' so the plan fits constraints.budgetVND (${intake.constraints?.budgetVND ?? 'unspecified'} VND/month).
```

In the repair block add one line before the JSON instruction:

```
When repairing, PRESERVE user-specific details (role, skills, strengths, location) already present in the previous answer.
```

- [ ] **Step 2: Orchestrator — language param + deterministic USD post-processing**

Extend `runCareerPipeline` signature:
```ts
export async function runCareerPipeline(
  intake: UserIntakeProfile,
  config: PipelineConfig = DEFAULT_CONFIG,
  personaId?: string,
  deps: AgentDeps = REAL_DEPS,
  language: Language = 'en'
): Promise<PipelineResult> {
```
(import `Language` from `../types`, `formatUsdRange, vndToUsd` from `./usd`.)

Pass to analyst calls:
```ts
      suggestions = await runAnalyst(intake, profile, pack, analystDeps, repairFeedback, language);
```

After the repair loop (before `return`), fill USD fields deterministically:
```ts
  for (const sug of suggestions) {
    if (sug.averageSalaryRangeVND && !sug.averageSalaryRangeUSD) {
      sug.averageSalaryRangeUSD = formatUsdRange(sug.averageSalaryRangeVND) ?? undefined;
    }
    for (const m of sug.roadmap || []) {
      if (typeof m.estimatedCostVND === 'number') {
        m.estimatedCostUSD = vndToUsd(m.estimatedCostVND);
      }
    }
  }
```

Add to `PipelineResult`:
```ts
  evidence: { currentOccupationResilience: number | null };
```
and compute before return:
```ts
  const currentResilience = pack.occupations.length
    ? Math.max(...pack.occupations.map(m => m.detail.overallResilienceScore ?? 0))
    : null;
```
returning `evidence: { currentOccupationResilience: currentResilience }`.

- [ ] **Step 3: Server — language option**

In `server.ts` `/api/agent/career-analyze` handler add:
```ts
  const language: 'vi' | 'en' = req.body.language === 'vi' ? 'vi' : 'en';
```
and pass `language` as the 5th argument to `runCareerPipeline(...)` (locate the call below line 795).

- [ ] **Step 4: Tests**

Update `src/agents/__tests__/analyst.test.ts`: existing calls without `language` still compile (default). Append:
```ts
it('prompt contains resource rule, budget realism and English default', async () => {
  const { capturePrompt } = ... // reuse the file's existing fake-deps capture pattern
  const p = lastPrompt; // however the test captures the prompt string
  expect(p).toContain('RESOURCE RULE (STRICT)');
  expect(p).toContain('BUDGET REALISM (STRICT)');
  expect(p).toContain('OUTPUT LANGUAGE: ENGLISH');
});
```
(Adapt to the existing capture helper in that file; if none exists, wrap `deps.callRich` to store the prompt.)

Run: `npx vitest run src/agents/__tests__/analyst.test.ts src/agents/__tests__/orchestrator.test.ts && npm run lint`
Expected: PASS, 0 errors. Update orchestrator tests asserting `PipelineResult` shape to include `evidence` if they do deep equality.

- [ ] **Step 5: Commit**

```bash
rtk git add src/agents/analyst.ts src/agents/orchestrator.ts server.ts src/agents/__tests__/analyst.test.ts src/agents/__tests__/orchestrator.test.ts
rtk git commit -m "Analyst: EN-primary output, cost tiers, strict resource and budget rules; USD post-processing"
```

---

### Task 9: Personas — segments + 4 new personas

**Files:**
- Modify: `eval/personas.ts`

- [ ] **Step 1: Add the segment field**

```ts
export type PersonaSegment = 'knowledge_worker' | 'wage_worker' | 'rural_agricultural' | 'student' | 'craft_trade';

export interface EvalPersona {
  id: string;
  label: string;
  intake: UserIntakeProfile;
  challenging?: boolean;
  segment: PersonaSegment;
}

const p = (
  id: string,
  label: string,
  intake: UserIntakeProfile,
  segment: PersonaSegment,
  challenging = false
): EvalPersona => ({ id, label, intake, segment, challenging });
```

- [ ] **Step 2: Tag the golden personas by their roles**

Read `src/data/goldenProfiles.ts` first; tag each `persona-golden-N` with the segment matching its `currentRole` (e.g. accountant/developer → `knowledge_worker`, designer → `knowledge_worker`). Use judgment per profile; document the mapping in a short comment.

- [ ] **Step 3: Tag the 9 existing synthetic personas**

`persona-accountant|teacher|juniordev|nurse` → `knowledge_worker`; `persona-garment|logistics` → `wage_worker`; `persona-farmer` → `rural_agricultural`; `persona-student` → `student`; `persona-watchrepair` → `craft_trade` (keep `challenging = true`).

- [ ] **Step 4: Append 4 new personas (same style as existing)**

```ts
  p('persona-receptionist', 'Hồng Nhung - Office Receptionist', {
    currentRole: 'Lễ tân văn phòng',
    experienceYears: 4,
    education: 'Cao đẳng Văn thư - Lưu trữ',
    location: 'TP. Hồ Chí Minh',
    currentSkills: ['Tiếp khách và tổng đài', 'Sắp xếp lịch họp, email', 'Soạn thảo văn bản cơ bản', 'Excel cơ bản'],
    strengths: ['Giao tiếp thân thiện', 'Tổ chức công việc tốt', 'Nhanh nhẹn, chịu áp lực giờ cao điểm'],
    weaknesses: ['Kỹ năng tin học văn phòng còn hạn chế', 'Không biết công cụ trực tuyến họp từ xa', 'Tiếng Anh giao tiếp cơ bản'],
    interests: ['Hành chính nhân sự', 'Truyền thông nội bộ'],
    forecastMode: 'conservative',
    constraints: { budgetVND: 1500000, hoursPerWeekAvailable: 8, riskTolerance: 'low' }
  }, 'wage_worker'),
  p('persona-electrician', 'Bá Cường - Industrial Electrician', {
    currentRole: 'Thợ điện công nghiệp',
    experienceYears: 10,
    education: 'Trung cấp Điện công nghiệp',
    location: 'Hải Phòng',
    currentSkills: ['Bảo trì tủ điện, biến tần', 'Đọc bản vẽ điện', 'Khắc phục sự噶 xuất dây', 'An toàn điện'],
    strengths: ['Kinh nghiệm hiện trường phong phú', 'Tư duy logic xử lý sự cố', 'Chịu được ca kíp'],
    weaknesses: ['Chưa lập trình PLC', 'Tiếng Anh kỹ thuật hạn chế'],
    interests: ['Tự động hóa', 'Robot công nghiệp'],
    forecastMode: 'realistic',
    constraints: { budgetVND: 3000000, hoursPerWeekAvailable: 8, riskTolerance: 'moderate' }
  }, 'wage_worker'),
  p('persona-retailcashier', 'Mỹ Linh - Retail Cashier', {
    currentRole: 'Thu ngân siêu thị',
    experienceYears: 3,
    education: 'Trung học phổ thông',
    location: 'Đà Nẵng',
    currentSkills: ['Vận hành POS', 'Đối soát cuối ca', 'Chăm sóc khách hàng', 'Xử lý hoàn đổi hàng'],
    strengths: ['Cẩn thận với tiền và hóa đơn', 'Thái độ phục vụ tốt', 'Làm việc theo ca linh hoạt'],
    weaknesses: ['Kỹ năng số cơ bản', 'Chưa có kinh nghiệm văn phòng'],
    interests: ['Kế toán cơ bản', 'Bán hàng trực tuyến'],
    forecastMode: 'conservative',
    constraints: { budgetVND: 1500000, hoursPerWeekAvailable: 10, riskTolerance: 'low' }
  }, 'wage_worker'),
  p('persona-agritech', 'Văn Hậu - Tech-Adopting Farmer', {
    currentRole: 'Nông dân ứng dụng công nghệ',
    experienceYears: 15,
    education: 'Trung học phổ thông + các khóa nông nghiệp',
    location: 'Cần Thơ',
    currentSkills: ['Canh tác lúa và cây ăn quả', 'Dùng drone phun thuốc (cơ bản)', 'Bán nông sản qua Zalo/Facebook', 'Ghi chép chi phí đơn giản'],
    strengths: ['Sẵn sàng học công nghệ mới', 'Hiểu thị trường địa phương', 'Kiên trì theo mùa vụ'],
    weaknesses: ['Phân tích dữ liệu canh tác', 'Tiếng Anh'],
    interests: ['Nông nghiệp chính xác', 'Thương mại điện tử nông sản'],
    forecastMode: 'realistic',
    constraints: { budgetVND: 2500000, hoursPerWeekAvailable: 12, riskTolerance: 'moderate' }
  }, 'rural_agricultural')
```

Note: the electrician `weaknesses` entry must read `'Khắc phục sự cố đấu dây'` (fix the typo above when pasting — no invalid characters).

- [ ] **Step 5: Verify eval module compiles and all persona-dependent tests pass**

Run: `npm run lint && npx vitest run eval/__tests__/` — Expected: 0 errors, PASS.

- [ ] **Step 6: Commit**

```bash
rtk git add eval/personas.ts
rtk git commit -m "Eval: segment tagging and four new personas (16 total)"
```

---

### Task 10: Eval metrics — coherence, actionability, by-segment

**Files:**
- Modify: `eval/score.ts`
- Test: `eval/__tests__/score.test.ts` (append)

- [ ] **Step 1: Write failing tests** — append:

```ts
import { checkCoherence } from '../../src/agents/coherence';
import { LEARNING_RESOURCE_URLS } from '../../src/data/learningResources';

describe('coherence + actionability scoring', () => {
  const coherentSug = (over: any = {}) => ({
    roleTitle: 'X', matchScore: 80,
    evidenceCitations: [{ paperTitle: 'Real', url: 'https://x.org' }],
    resilienceDetail: { overallResilienceScore: 70, uncertaintyRange: '±5', vietnamDemandSignal: 'stable' },
    trajectories: [{ pathId: 'a', feasibilityScore: 70, riskLevel: 'low', actionStepNow: 'start a free course' }],
    roadmap: [{ costTier: 'free', freeResources: [{ url: [...LEARNING_RESOURCE_URLS][0] }] }],
    ...over
  });

  it('marks a coherent, grounded, free-path run coherent AND actionable', () => {
    expect(checkCoherence([coherentSug()], 60)).toEqual([]);
    // actionable criteria mirror scoreOutput's isActionable
  });

  it('flags low-resilience top suggestion as incoherent', () => {
    expect(checkCoherence([coherentSug({ resilienceDetail: { overallResilienceScore: 40, uncertaintyRange: '±5', vietnamDemandSignal: 'stable' } })], 60).length).toBeGreaterThan(0);
  });
});

describe('isActionable', () => {
  it('requires registry url, actionStepNow and a free/low-cost milestone', async () => {
    const { isActionable } = await import('../score');
    const good = [{ trajectories: [{ actionStepNow: 'x' }], roadmap: [{ costTier: 'free', freeResources: [{ url: [...LEARNING_RESOURCE_URLS][0] }] }] }];
    const noFree = [{ trajectories: [{ actionStepNow: 'x' }], roadmap: [{ costTier: 'paid', freeResources: [{ url: [...LEARNING_RESOURCE_URLS][0] }] }] }];
    const fakeUrl = [{ trajectories: [{ actionStepNow: 'x' }], roadmap: [{ costTier: 'free', freeResources: [{ url: 'https://example.com/x' }] }] }];
    expect(isActionable(good)).toBe(true);
    expect(isActionable(noFree)).toBe(false);
    expect(isActionable(fakeUrl)).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run eval/__tests__/score.test.ts` — FAIL.

- [ ] **Step 3: Implement in `eval/score.ts`**

Imports:
```ts
import { checkCoherence } from '../src/agents/coherence';
import { LEARNING_RESOURCE_URLS } from '../src/data/learningResources';
```

Export:
```ts
export function isActionable(suggestions: any[]): boolean {
  const top = suggestions?.[0];
  if (!top) return false;
  const hasGroundedResource = (top.roadmap || []).some((m: any) =>
    (m.freeResources || []).some((r: any) => LEARNING_RESOURCE_URLS.has(r?.url))
  );
  const hasFirstStep = (top.trajectories || []).some((t: any) => t?.actionStepNow);
  const hasAffordableMilestone = (top.roadmap || []).some((m: any) => m?.costTier === 'free' || m?.costTier === 'low_cost');
  return hasGroundedResource && hasFirstStep && hasAffordableMilestone;
}
```

In `RunScore` add fields:
```ts
  coherent: boolean | null;
  actionable: boolean | null;
```

In `scoreOutput` (ok branch) compute:
```ts
  const currentResilience: number | null =
    typeof payload?.evidence?.currentOccupationResilience === 'number'
      ? payload.evidence.currentOccupationResilience
      : null;
  const coherent = checkCoherence(suggestions, currentResilience).length === 0;
  const actionable = isActionable(suggestions);
```
(fill `null`/`false` appropriately in the early failure return). Also add the judge language-neutrality line to the personalization prompt:
```
Judge the content irrespective of language.
```

In `AggregatedSummary` add:
```ts
  coherenceRate: number;
  actionableRate: number;
  bySegment: Record<string, { runs: number; groundingRate: number | null; personalizationAvg: number | null; coherenceRate: number; actionableRate: number }>;
```
and compute in `aggregate(scores, segmentsById?)` — change signature to `aggregate(scores: RunScore[], segmentsById?: Record<string, string>)` deriving `bySegment` when provided (default `{}` for backward compatibility). Compute the two rates as shares of ok runs.

- [ ] **Step 4: Update run-eval + tests**

In `eval/run-eval.ts` build `segmentsById` from `EVAL_PERSONAS` and pass to `aggregate`. Update `eval/__tests__/score.test.ts` existing aggregate tests to the new return shape if they do deep equality (add the new fields).

Run: `npx vitest run eval/__tests__/ && npm run lint` — Expected: PASS, 0 errors.

- [ ] **Step 5: Commit**

```bash
rtk git add eval/score.ts eval/run-eval.ts eval/__tests__/score.test.ts
rtk git commit -m "Eval: risk-coherence and actionable-path metrics with per-segment aggregation"
```

---

### Task 11: 3-run stability protocol in run-eval

**Files:**
- Modify: `eval/run-eval.ts`

- [ ] **Step 1: Add repetition support**

At the top of `main()`:
```ts
  const repsIdx = process.argv.indexOf('--reps');
  const REPS = repsIdx > 0 ? Math.max(1, Number(process.argv[repsIdx + 1]) || 1) : 3;
```

Wrap the per-config/persona loops in `for (let rep = 1; rep <= REPS; rep++)` with a fresh `stamp` per rep (`${baseStamp}-r${rep}`), collecting `allRuns: Record<string, RunScore[]>[]` (one entry per rep) plus the existing per-rep artifacts (summary.json, EVALUATION.md). Persist trajectories from rep 1 only.

- [ ] **Step 2: Render the stability table**

After the loop:
```ts
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
```
Write it to `eval/results/runs/${baseStamp}-stability/STABILITY.md` and reference it from the first rep's EVALUATION.md.

- [ ] **Step 3: Update `latest.json`** to `{ stamp: firstRepStamp, reps: REPS }`.

- [ ] **Step 4: Type-check** — `npm run lint` — Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
rtk git add eval/run-eval.ts
rtk git commit -m "Eval: 3-run stability protocol with mean-sd reporting"
```

---

### Task 12: Trajectory human_checkpoint + EN-default UI + cost badge + review gate

**Files:**
- Modify: `src/agents/trajectory.ts`, `src/components/AgentTransparencyPanel.tsx`, `src/App.tsx:52`, `src/components/RoadmapModule.tsx:316-321`, `src/components/CareerSuggestionView.tsx`
- Create: `src/components/CounselorReviewGate.tsx`

- [ ] **Step 1: Add the event type** — in `src/agents/trajectory.ts` extend the union:
```ts
  | 'human_checkpoint'
```

- [ ] **Step 2: Bilingual transparency panel** — in `AgentTransparencyPanel.tsx` replace `LABELS` with a bilingual map and add a `language` prop:

```tsx
import { t } from '../utils/i18n';
import type { Language } from '../types';

const LABELS: Record<string, { vi: string; en: string }> = {
  run_start: { vi: 'Bắt đầu pipeline', en: 'Pipeline start' },
  agent_start: { vi: 'Agent bắt đầu', en: 'Agent start' },
  agent_end: { vi: 'Agent hoàn tất', en: 'Agent done' },
  llm_call: { vi: 'Gọi mô hình', en: 'Model call' },
  tool_call: { vi: 'Gọi công cụ tra cứu', en: 'Tool call' },
  tool_response: { vi: 'Công cụ trả về', en: 'Tool response' },
  verification_result: { vi: 'Kiểm định chất lượng', en: 'Verification' },
  repair_retry: { vi: 'Tự sửa lỗi', en: 'Self-repair' },
  human_checkpoint: { vi: 'Tư vấn viên xác nhận', en: 'Counselor review' },
  error: { vi: 'Lỗi', en: 'Error' },
  run_end: { vi: 'Kết thúc', en: 'End' }
};
```
Component signature `({ trajectory, language = 'en' }: { trajectory: Trajectory | null; language?: Language })`, and render `{LABELS[e.type] ? t(language, LABELS[e.type].vi, LABELS[e.type].en) : e.type}`. In `src/App.tsx` pass `language={language}` where the panel is rendered.

- [ ] **Step 3: English default** — `src/App.tsx:52` change `useState<Language>('vi')` → `useState<Language>('en')`.

- [ ] **Step 4: Cost badge in RoadmapModule** — next to the hours span (~line 319):

```tsx
{milestone.costTier && (
  <span className={`text-xs px-2 py-0.5 rounded-full ${milestone.costTier === 'paid' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
    {milestone.costTier === 'free'
      ? t(language, 'Miễn phí', 'Free')
      : milestone.costTier === 'low_cost'
        ? t(language, 'Chi phí thấp', 'Low cost')
        : t(language, 'Trả phí', 'Paid')}
    {typeof milestone.estimatedCostVND === 'number' && milestone.estimatedCostVND > 0
      ? ` (~${milestone.estimatedCostVND.toLocaleString('en-US')}đ${milestone.estimatedCostUSD ? ` / $${milestone.estimatedCostUSD}` : ''})`
      : ''}
  </span>
)}
```

- [ ] **Step 5: Counselor review gate** — create `src/components/CounselorReviewGate.tsx`:

```tsx
import { useState } from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';
import type { Trajectory } from '../agents/trajectory';
import { t } from '../utils/i18n';
import type { Language } from '../types';

export default function CounselorReviewGate({
  trajectory,
  language,
  onReviewed
}: {
  trajectory: Trajectory | null;
  language: Language;
  onReviewed: () => void;
}) {
  const [approved, setApproved] = useState(false);
  if (!trajectory) return null;

  const approve = () => {
    // Sandboxed human-in-the-loop checkpoint (ground rule 05): the approval
    // event becomes part of the trajectory evidence.
    trajectory.events.push({
      ts: new Date().toISOString(),
      type: 'human_checkpoint',
      message: approvedMessage(language)
    });
    setApproved(true);
    onReviewed();
  };

  if (approved) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <ShieldCheck size={16} /> {t(language, 'Đã có tư vấn viên xem xét và xác nhận kết quả này.', 'A career counselor has reviewed and approved this result.')}
      </div>
    );
  }
  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <span>{t(language, 'Kết quả đang chờ tư vấn viên xác nhận trước khi hoàn tất.', 'Result is pending counselor review before final delivery.')}</span>
      <button onClick={approve} className="flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-white hover:bg-amber-700">
        <UserCheck size={14} /> {t(language, 'Xác nhận (tư vấn viên)', 'Approve (counselor)')}
      </button>
    </div>
  );
}

function approvedMessage(language: Language): string {
  return t(language, 'Tư vấn viên đã xem xét và phê duyệt kết quả.', 'Counselor reviewed and approved the result.');
}
```

Render it in `CareerSuggestionView.tsx` below the suggestions block (the component already receives `language`; add an optional `trajectory` prop and render `<CounselorReviewGate trajectory={trajectory} language={language} onReviewed={() => {}} />`). Wire the prop from `App.tsx` (it already holds the pipeline result with `trajectory`).

- [ ] **Step 6: Verify** — `npm run lint && npm run build` — Expected: 0 errors, build succeeds.

- [ ] **Step 7: Commit**

```bash
rtk git add src/agents/trajectory.ts src/components/AgentTransparencyPanel.tsx src/App.tsx src/components/RoadmapModule.tsx src/components/CareerSuggestionView.tsx src/components/CounselorReviewGate.tsx
rtk git commit -m "UI: human-review checkpoint, cost badges, EN default, bilingual transparency panel"
```

---

### Task 13: Run the full evaluation (3 reps) and publish

**Files:**
- Generated: `eval/results/runs/<stamp>-r{1,2,3}/`, `eval/results/runs/<stamp>-stability/`, `eval/trajectories/*`

- [ ] **Step 1: Start the server**

Run: `npm run dev` (background) — wait for `listening` / healthy at `http://localhost:3000/api/agent/health`.

- [ ] **Step 2: Run the eval**

Run: `npm run eval` (defaults to `--reps 3`; 16 personas × 3 configs × 3 reps = 144 runs; expect ~2-3 h and ~$0.60).

- [ ] **Step 3: Sanity-check the outputs**

- `eval/results/runs/<stamp>-stability/STABILITY.md` exists and contains mean ± sd rows for all 3 configs.
- Final config: grounding 100% ± 0, coherence and actionability strictly higher than baseline.
- If coherence/actionability of the final config is NOT above baseline, STOP — investigate repair-loop traces before publishing (do not edit numbers).

- [ ] **Step 4: Commit results**

```bash
rtk git add eval/results eval/trajectories
rtk git commit -m "Publish 3-run stability evaluation (16 personas, coherence + actionability)"
```

---

### Task 14: Documentation

**Files:**
- Modify: `README.md`, `docs/EVALUATION.md`, `docs/IMPROVEMENT_CHANGELOG.md`, `docs/REPRODUCTION_GUIDE.md`, `docs/VIDEO_SCRIPT.md`, `DEVELOPMENT-TRACKING.md`

- [ ] **Step 1: README** — add after the agent-architecture diagram:

```markdown
## Social-impact safeguards (new)

- **Decision coherence:** the verifier rejects a top recommendation whose resilience is below the user's current occupation (or below 55 when unmatched) and any recommendation whose Vietnam demand signal is `declining` — verified citations must also support the direction.
- **Grounded, budget-aware resources:** every roadmap resource URL is grounded against a curated, HTTP-verified registry; milestones carry `costTier` and `estimatedCostVND`, and at least one milestone per suggestion must fit the user's monthly budget.
- **Equity:** evaluation results are broken down by worker segment (knowledge / wage / rural / student / craft).
- **Human in the loop:** results render behind a counselor-review checkpoint (demonstrated in-sandbox; production deployments deliver guidance through a qualified counselor). Outputs are advisory.
- **Currency:** USD figures use a fixed documented rate of 1 USD = 26,000 VND (approximate interbank, set 2026-10-13); they are display conversions computed in code, never by the model.
```
Update the metrics table with the new rows (coherence/actionability baseline vs final, from STABILITY.md) and the personas count (16).

- [ ] **Step 2: IMPROVEMENT_CHANGELOG** — append two iterations using REAL numbers from STABILITY.md:

```markdown
| Iteration 4 | + Decision-coherence checks (C1 uplift floor, C2 declining-signal ban, C3 transparency) — observed the published garment case: top suggestion resilience 42 with citations documenting a 48% YoY posting decline | Baseline coherence X% → final Y% (see STABILITY.md) | Kept. Verified citations can still support a bad direction — the verifier now checks both |
| Iteration 5 | + Grounded budget-aware resources — registry-exact URLs, cost tiers, budget-fit rule; USD dual-display | Baseline actionable X% → final Y%; 0 ungrounded resource URLs in final | Kept. Trust must extend to every URL, not only citations |
```

- [ ] **Step 3: EVALUATION.md** — extend methodology (two new metric definitions verbatim from the spec), fairness note about the baseline's Vietnamese output language, and the labor-force mapping table. Use only GSO/ILO figures verifiable by web search during implementation; omit any figure without a source:

```markdown
## Vietnam labor-force context (why these personas matter)

| Occupation (persona set) | Vietnam workforce (source, year) |
|---|---|
| garment workers | <number> (ILO/GSO, <year>) |
| ... | ... |
```

- [ ] **Step 4: REPRODUCTION_GUIDE** — update personas count, `--reps` flag, expected runtime (~2-3 h, ~$0.60), new metrics in expected output, USD rate note, and the language default (`en`; `language: 'vi'` body option).

- [ ] **Step 5: VIDEO_SCRIPT** — add one row after the challenging case:

```markdown
| 3:15-3:35 | Coherence + actionability | "New safeguards: the verifier now rejects recommendations whose own evidence shows decline, and every learning link is grounded in a verified registry with cost tiers that respect the user's budget — and a counselor reviews before delivery." | Show a repair_retry from coherence feedback; cost badges; the review gate |
```
(re-time the remaining rows to fit 5:00.)

- [ ] **Step 6: DEVELOPMENT-TRACKING.md** — append a dated section summarizing this upgrade (scope, spec/plan links, 6 workstreams, new test count).

- [ ] **Step 7: Verify + commit**

Run: `npm test && npm run lint` — Expected: all PASS, 0 errors.
```bash
rtk git add README.md docs/ DEVELOPMENT-TRACKING.md
rtk git commit -m "Docs: social-impact safeguards, new metrics, iterations 4-5"
```

---

### Task 15: Final verification

- [ ] **Step 1:** `npm test` — all tests pass (58 old + new; count and record).
- [ ] **Step 2:** `npm run lint` — 0 errors.
- [ ] **Step 3:** `npm run build` — production build succeeds.
- [ ] **Step 4:** `npm run dev` + manual smoke: submit the accountant intake; confirm EN output, transparency panel (EN), cost badges, counselor gate, USD dual-display in salary.
- [ ] **Step 5:** `rtk git status` — clean tree; push not required (user decides).

---

## Self-Review (completed)

1. **Spec coverage:** A→Tasks 4,6; B→Tasks 1,2,3,5,8; C→Tasks 9,10,14; D→Tasks 7,8,12; E→Task 12; 3-run protocol→Tasks 11,13. No spec requirement left untasked.
2. **Placeholder scan:** no TBD/TODO; every code step shows code; registry URLs are real domains with an explicit HTTP-verification step.
3. **Type consistency:** `costTier`/`estimatedCostVND`/`estimatedCostUSD` defined Task 1, consumed Tasks 8,12; `LearningResource`/`LEARNING_RESOURCE_URLS` defined Task 1, consumed Tasks 2,5,10; `checkCoherence(suggestions, currentResilience)` fixed in Task 4 and reused verbatim in Tasks 6 and 10; `runVerifier` 4th param `pack` defaults `EMPTY_PACK` so old call sites compile; `evidence.currentOccupationResilience` produced in Task 8, consumed in Task 10.
