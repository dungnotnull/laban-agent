import { describe, it, expect } from 'vitest';
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
