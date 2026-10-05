// Temporary adapter: exposes the Angular CalculatorService behind the
// framework-agnostic API so the tests capture today's results.
import '@angular/compiler';
import { formatCurrency as ngFormatCurrency, formatPercent as ngFormatPercent, registerLocaleData } from '@angular/common';
import localeDeCH from '@angular/common/locales/de-CH';
import { CalculatorService } from '../app/calculator/calculator.service';
import { SalaryFrequency } from '../app/shared/enums/salary-frequency.enum';

registerLocaleData(localeDeCH);

export type Frequency = 'monthly' | 'annual';

export interface SalaryInput {
  frequency: Frequency;
  grossSalary: number | undefined;
  age: number | undefined;
  thirteenthSalary: boolean;
  ktg: boolean;
}

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

export function calculateNetSalary(input: SalaryInput): SalaryResult {
  const s = new CalculatorService();
  s.salaryFrequency.set(input.frequency === 'monthly' ? SalaryFrequency.MONTHLY : SalaryFrequency.ANNUAL);
  s.grossSalary.set(input.grossSalary);
  s.age.set(input.age);
  s.thirteenthSalaryEnabled.set(input.thirteenthSalary);
  s.ktgEnabled.set(input.ktg);
  return {
    ahvIvEo: s.ahvIvEoContributions(),
    alv: s.alvContributions(),
    bvg: s.bvgContributions(),
    nbu: s.nbuContributions(),
    ktg: s.ktgContributions(),
    total: s.totalContributions(),
    totalPercentage: s.totalContributionsPercentage(),
    net: s.netSalary(),
  };
}

export const formatCurrency = (value: number) => ngFormatCurrency(value, 'de-CH', 'CHF', 'CHF');
export const formatPercent = (value: number) => ngFormatPercent(value, 'de-CH', '1.2-2');
