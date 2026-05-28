import { DEDUCTION_RATES_2026 } from './deduction-rates';

export type Frequency = 'monthly' | 'annual';

export interface CalculatorInputs {
  grossSalary: number | undefined;
  age: number | undefined;
  ktgEnabled: boolean;
  thirteenthSalaryEnabled: boolean;
  frequency: Frequency;
}

export interface CalculatorResult {
  annualGrossSalary: number;
  ahvIvEo: number;
  alv: number;
  nbu: number;
  ktg: number;
  bvg: number;
  total: number;
  totalPct: number;
  net: number | undefined;
}

const rates = DEDUCTION_RATES_2026;

function bvgRateForAge(age: number | undefined): number {
  if (age === undefined) return 0;
  return rates.bvg.contributionRates.find((r) => age >= r.minAge && age <= r.maxAge)?.employeeShare ?? 0;
}

export function calculate(inputs: CalculatorInputs): CalculatorResult {
  const { grossSalary, age, ktgEnabled, thirteenthSalaryEnabled, frequency } = inputs;
  const gross = grossSalary ?? 0;
  const isMonthly = frequency === 'monthly';
  const numberOfSalaries = thirteenthSalaryEnabled ? 13 : 12;

  const annualGrossSalary = !grossSalary ? 0 : isMonthly ? gross * numberOfSalaries : gross;
  const toDisplay = (annual: number) => (isMonthly ? annual / numberOfSalaries : annual);

  const ahvIvEo = gross * rates.socialSecurity.ahvIvEo.rate;
  const nbu = gross * rates.nbu.rate;
  const ktg = ktgEnabled ? gross * rates.ktg.rate : 0;

  let alv = 0;
  if (annualGrossSalary) {
    const { annualThreshold, standardRate, solidarityRate } = rates.socialSecurity.alv;
    const alvAnnual =
      annualGrossSalary <= annualThreshold
        ? annualGrossSalary * standardRate
        : annualThreshold * standardRate + (annualGrossSalary - annualThreshold) * solidarityRate;
    alv = toDisplay(alvAnnual);
  }

  let bvg = 0;
  const { entryThreshold, coordinationDeduction, minimumInsured, maximumInsured } = rates.bvg.thresholds;
  if (annualGrossSalary >= entryThreshold) {
    const coordinated = Math.min(
      Math.max(annualGrossSalary - coordinationDeduction, minimumInsured),
      maximumInsured,
    );
    const rate = bvgRateForAge(age);
    if (coordinated && rate) {
      bvg = toDisplay(coordinated * rate);
    }
  }

  const total = ahvIvEo + alv + nbu + ktg + bvg;
  const totalPct = grossSalary ? total / gross : 0;
  const net = grossSalary ? gross - total : undefined;

  return { annualGrossSalary, ahvIvEo, alv, nbu, ktg, bvg, total, totalPct, net };
}
