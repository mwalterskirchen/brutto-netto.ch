/**
 * Swiss median salary reference for the comparison hook.
 *
 * Source: BFS Schweizerische Lohnstrukturerhebung (LSE) 2024 — published 2026-01.
 * Definition: median monthly brutto, 100% FTE, total economy (private + public sector).
 * Does NOT include 13th-month assumption — annualize via × 12.
 */
export const SWISS_MEDIAN_MONTHLY_BRUTTO = 7024;
export const SWISS_MEDIAN_REFERENCE_YEAR = 2024;
export const SWISS_MEDIAN_PUBLISHED = '2026-01';
export const SWISS_MEDIAN_SOURCE_URL =
  'https://www.bfs.admin.ch/bfs/de/home/aktuell/neue-veroeffentlichungen.assetdetail.36195847.html';

export function medianForFrequency(frequency: 'monthly' | 'annual'): number {
  return frequency === 'monthly' ? SWISS_MEDIAN_MONTHLY_BRUTTO : SWISS_MEDIAN_MONTHLY_BRUTTO * 12;
}
