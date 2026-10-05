import { DEDUCTION_RATES_2026 } from './deduction-rates';

export type Frequency = 'monthly' | 'annual';

export interface SalaryInput {
  frequency: Frequency;
  /** Gross salary for the selected frequency, in CHF. */
  grossSalary: number | undefined;
  age: number | undefined;
  thirteenthSalary: boolean;
  ktg: boolean;
}

/** All amounts are in CHF for the selected frequency. */
export interface SalaryResult {
  ahvIvEo: number;
  alv: number;
  bvg: number;
  nbu: number;
  ktg: number;
  total: number;
  totalPercentage: number;
  net: number | undefined;
}

export function calculateNetSalary(
  input: SalaryInput,
  rates: typeof DEDUCTION_RATES_2026 = DEDUCTION_RATES_2026,
): SalaryResult {
  const gross = input.grossSalary ?? 0;
  const numberOfSalaries = input.thirteenthSalary ? 13 : 12;
  const isMonthly = input.frequency === 'monthly';
  const annualGross = gross ? (isMonthly ? gross * numberOfSalaries : gross) : 0;
  const toDisplayFrequency = (annual: number) => (isMonthly ? annual / numberOfSalaries : annual);

  // Simple percentage deductions
  const ahvIvEo = gross * rates.socialSecurity.ahvIvEo.rate;
  const nbu = gross * rates.nbu.rate;
  const ktg = input.ktg ? gross * rates.ktg.rate : 0;

  // ALV with solidarity rate for high earners
  const { annualThreshold, standardRate, solidarityRate } = rates.socialSecurity.alv;
  const alv = annualGross
    ? toDisplayFrequency(
        annualGross <= annualThreshold
          ? annualGross * standardRate
          : annualThreshold * standardRate + (annualGross - annualThreshold) * solidarityRate,
      )
    : 0;

  // BVG coordinated salary (clamped between min/max thresholds)
  const { entryThreshold, coordinationDeduction, minimumInsured, maximumInsured } =
    rates.bvg.thresholds;
  const coordinatedAnnual =
    annualGross < entryThreshold
      ? 0
      : Math.min(Math.max(annualGross - coordinationDeduction, minimumInsured), maximumInsured);
  const age = input.age;
  const bvgRate =
    age === undefined
      ? 0
      : (rates.bvg.contributionRates.find((r) => age >= r.minAge && age <= r.maxAge)
          ?.employeeShare ?? 0);
  const bvg = coordinatedAnnual && bvgRate ? toDisplayFrequency(coordinatedAnnual * bvgRate) : 0;

  // Totals
  const total = ahvIvEo + alv + nbu + ktg + bvg;

  return {
    ahvIvEo,
    alv,
    bvg,
    nbu,
    ktg,
    total,
    totalPercentage: gross ? total / gross : 0,
    net: gross ? gross - total : undefined,
  };
}

const currencyFormat = new Intl.NumberFormat('de-CH', {
  style: 'currency',
  currency: 'CHF',
});

const percentFormat = new Intl.NumberFormat('de-CH', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// ICU versions disagree on the de-CH group separator (' or ’), so pin it to keep
// build-time and browser output identical.
export const formatCurrency = (value: number) =>
  currencyFormat
    .formatToParts(value)
    .map((part) => (part.type === 'group' ? '’' : part.value))
    .join('');
export const formatPercent = (value: number) => percentFormat.format(value);
