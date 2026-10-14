import { describe, it, expect } from 'vitest';
import { getVideosForRole, DEFAULT_MEDIA_VIDEOS } from '../roleVideos';

describe('getVideosForRole', () => {
  it('returns default 2 VTV24 videos when role is empty or undefined', () => {
    const emptyResult = getVideosForRole();
    expect(emptyResult.isCustomRole).toBe(false);
    expect(emptyResult.videos).toEqual(DEFAULT_MEDIA_VIDEOS);

    const blankResult = getVideosForRole('   ');
    expect(blankResult.isCustomRole).toBe(false);
    expect(blankResult.videos).toEqual(DEFAULT_MEDIA_VIDEOS);
  });

  it('resolves manual QC / QA tester to dedicated testing videos', () => {
    const result = getVideosForRole('manual QC');
    expect(result.isCustomRole).toBe(true);
    expect(result.targetRoleEn).toContain('QA');
    expect(result.videos.length).toBe(2);
    expect(result.videos[0].id).toBe('xe3AvrYX1ss');
  });

  it('resolves accountant / kế toán to dedicated accounting videos', () => {
    const result = getVideosForRole('Kế toán viên');
    expect(result.isCustomRole).toBe(true);
    expect(result.targetRoleVi).toContain('Kế toán');
    expect(result.videos.length).toBe(2);
    expect(result.videos[0].id).toBe('K3Ga8p2aH2Y');
  });

  it('resolves graphic designer to creative design videos', () => {
    const result = getVideosForRole('Graphic Designer');
    expect(result.isCustomRole).toBe(true);
    expect(result.targetRoleEn).toContain('Graphic');
    expect(result.videos.length).toBe(2);
    expect(result.videos[0].id).toBe('Uiea_Ub5Bgk');
  });
});
