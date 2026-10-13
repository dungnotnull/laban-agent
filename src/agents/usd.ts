// Deterministic VND->USD display conversion. Fixed documented rate (see README);
// NEVER computed by the LLM. Rounding to whole dollars is intentional.
export const USD_VND_RATE = 26000;

export function vndToUsd(vnd: number): number {
  return Math.round(vnd / USD_VND_RATE);
}

export function formatUsdRange(vndRange: string): string | null {
  if (!vndRange) return null;
  const nums = vndRange.match(/([\d.,]+)\s*[-–]\s*([\d.,]+)/);
  if (!nums) return null;
  const toVnd = (s: string) => {
    // "8,000,000" (thousands separators) -> 8000000; "8.000.000" -> 8000000
    if (/[.,]\d{3}(?:[.,]|$)/.test(s)) return Number(s.replace(/[.,]/g, ''));
    return Number(s);
  };
  const lo = toVnd(nums[1]);
  const hi = toVnd(nums[2]);
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo <= 0 || hi <= 0) return null;
  return `$${vndToUsd(lo).toLocaleString('en-US')} - $${vndToUsd(hi).toLocaleString('en-US')} / month`;
}
