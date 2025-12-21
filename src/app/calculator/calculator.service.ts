import { computed, Injectable, signal } from '@angular/core';
import { DEDUCTION_RATES_2026 } from './deduction-rates';
import { SalaryFrequency } from '../shared/enums/salary-frequency.enum';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private readonly rates = DEDUCTION_RATES_2026;

  salaryFrequency = signal<SalaryFrequency>(SalaryFrequency.MONTHLY);
  grossSalary = signal<number | undefined>(undefined);
  age = signal<number | undefined>(undefined);
  ktgEnabled = signal<boolean>(false);
  thirteenthSalaryEnabled = signal<boolean>(false);

  private numberOfSalaries = computed(() => (this.thirteenthSalaryEnabled() ? 13 : 12));
  private isMonthly = computed(() => this.salaryFrequency() === SalaryFrequency.MONTHLY);

  annualGrossSalary = computed(() => {
    const gross = this.grossSalary();
    if (!gross) return 0;
    return this.isMonthly() ? gross * this.numberOfSalaries() : gross;
  });

  private toDisplayFrequency = (annual: number) =>
    this.isMonthly() ? annual / this.numberOfSalaries() : annual;

  // Simple percentage deductions
  ahvIvEoContributions = computed(
    () => (this.grossSalary() ?? 0) * this.rates.socialSecurity.ahvIvEo.rate
  );

  nbuContributions = computed(() => (this.grossSalary() ?? 0) * this.rates.nbu.rate);

  ktgContributions = computed(() =>
    this.ktgEnabled() ? (this.grossSalary() ?? 0) * this.rates.ktg.rate : 0
  );

  // ALV with solidarity rate for high earners
  alvContributions = computed(() => {
    const annualGross = this.annualGrossSalary();
    if (!annualGross) return 0;

    const { annualThreshold, standardRate, solidarityRate } = this.rates.socialSecurity.alv;

    const annualContribution =
      annualGross <= annualThreshold
        ? annualGross * standardRate
        : annualThreshold * standardRate + (annualGross - annualThreshold) * solidarityRate;

    return this.toDisplayFrequency(annualContribution);
  });

  // BVG coordinated salary (clamped between min/max thresholds)
  private coordinatedSalaryAnnual = computed(() => {
    const annualGross = this.annualGrossSalary();
    const { entryThreshold, coordinationDeduction, minimumInsured, maximumInsured } =
      this.rates.bvg.thresholds;

    if (annualGross < entryThreshold) return 0;

    const coordinated = annualGross - coordinationDeduction;
    return Math.min(Math.max(coordinated, minimumInsured), maximumInsured);
  });

  private bvgContributionRate = computed(
    () =>
      this.rates.bvg.contributionRates.find(
        (r) => this.age()! >= r.minAge && this.age()! <= r.maxAge
      )?.employeeShare ?? 0
  );

  bvgContributions = computed(() => {
    const coordinated = this.coordinatedSalaryAnnual();
    const rate = this.bvgContributionRate();
    if (!coordinated || !rate) return 0;
    return this.toDisplayFrequency(coordinated * rate);
  });

  // Totals
  totalContributions = computed(
    () =>
      this.ahvIvEoContributions() +
      this.alvContributions() +
      this.nbuContributions() +
      this.ktgContributions() +
      this.bvgContributions()
  );

  totalContributionsPercentage = computed(() => {
    const gross = this.grossSalary();
    return gross ? this.totalContributions() / gross : 0;
  });

  netSalary = computed(() => {
    const gross = this.grossSalary();
    return gross ? gross - this.totalContributions() : undefined;
  });
}
