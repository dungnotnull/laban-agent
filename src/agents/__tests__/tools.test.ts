import { describe, it, expect } from 'vitest';
import { lookupOccupation, searchResearch, AGENT_FUNCTION_DECLARATIONS } from '../tools';
import { LEARNING_RESOURCES } from '../../data/learningResources';
import { searchLearningResources, EMPTY_PACK } from '../tools';

describe('lookupOccupation', () => {
  it('finds graphic designer by natural language query', () => {
    const result = lookupOccupation('graphic designer việt nam');
    const matches = result.data as any[];
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].detail.occupationTitle).toBeDefined();
    expect(matches[0].key).toBeDefined();
  });

  it('matches a Vietnamese-language query with diacritics', () => {
    const result = lookupOccupation('kế toán');
    const matches = result.data as any[];
    expect(matches.length).toBeGreaterThan(0);
  });

  it('returns empty matches for unknown occupation', () => {
    const result = lookupOccupation('astronaut zookeeper mars');
    expect((result.data as any[]).length).toBe(0);
    expect(result.note).toBeDefined();
  });
});

describe('searchResearch', () => {
  it('returns up to 3 sources with metadata', () => {
    const result = searchResearch('AI automation impact jobs Vietnam');
    const items = result.data as any[];
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(3);
    expect(items[0]).toHaveProperty('title');
    expect(items[0]).toHaveProperty('keyFindings');
  });
});

describe('AGENT_FUNCTION_DECLARATIONS', () => {
  it('declares all four tools with proper parameters', () => {
    expect(AGENT_FUNCTION_DECLARATIONS).toHaveLength(4);
    for (const decl of AGENT_FUNCTION_DECLARATIONS) {
      expect(decl.name).toBeTruthy();
      // Each tool should have either 'query' or 'role' parameter
      const params = decl.parameters.properties;
      const hasParam = params.query || params.role;
      expect(hasParam).toBeTruthy();
    }
  });
});

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

  it('registry is non-empty', () => {
    expect(LEARNING_RESOURCES.length).toBeGreaterThan(0);
  });
});
