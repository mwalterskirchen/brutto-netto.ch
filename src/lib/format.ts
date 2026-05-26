const chf = new Intl.NumberFormat('de-CH', {
  style: 'currency',
  currency: 'CHF',
});

const pct = new Intl.NumberFormat('de-CH', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCHF(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return '-';
  return chf.format(value);
}

export function formatPercent(value: number): string {
  return pct.format(value);
}
