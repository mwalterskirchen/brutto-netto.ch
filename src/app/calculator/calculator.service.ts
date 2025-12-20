import { computed, Injectable, signal } from '@angular/core';
import { TAXES_RATES_2026 } from './taxes-rates';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private readonly taxesRates = TAXES_RATES_2026;

  grossSalary = signal<number | undefined>(undefined);
  age = signal<number | undefined>(undefined);
  ktgEnabled = signal<boolean>(false);
  thirteenthSalaryEnabled = signal<boolean>(false);
  totalContributions = computed<number>(
    () =>
      this.ahvIvEoContributions() +
      this.alvContributions() +
      this.nbuContributions() +
      this.ktgContributions() +
      this.bvgContributions()
  );
  totalContributionsPercentage = computed<number>(
    () => this.totalContributions() / this.grossSalary()!
  );

  ahvIvEoContributions = computed<number>(() =>
    this.grossSalary() ? this.grossSalary()! * this.taxesRates.socialSecurity.ahvIvEo.rate : 0
  );
  /**
   * ALV contributions with solidarity rate for high earners
   * - Standard rate (1.1%) applies up to annual threshold (CHF 148,200)
   * - Additional solidarity rate (0.5%) applies on income above threshold
   */
  alvContributions = computed<number>(() => {
    const monthlyGross = this.grossSalary();
    if (!monthlyGross) return 0;

    const numberOfSalaries = this.thirteenthSalaryEnabled() ? 13 : 12;
    const annualGross = monthlyGross * numberOfSalaries;
    const monthlyThreshold = this.taxesRates.socialSecurity.alv.annualThreshold / numberOfSalaries;

    if (annualGross <= this.taxesRates.socialSecurity.alv.annualThreshold) {
      // Standard rate only
      return monthlyGross * this.taxesRates.socialSecurity.alv.standardRate;
    } else {
      // Standard rate on income up to threshold + solidarity rate on income above
      const standardContribution =
        monthlyThreshold * this.taxesRates.socialSecurity.alv.standardRate;
      const solidarityContribution =
        (monthlyGross - monthlyThreshold) * this.taxesRates.socialSecurity.alv.solidarityRate;
      return standardContribution + solidarityContribution;
    }
  });
  nbuContributions = computed<number>(() =>
    this.grossSalary() ? this.grossSalary()! * this.taxesRates.nbu.rate : 0
  );

  ktgContributions = computed<number>(() => {
    if (!this.ktgEnabled()) return 0;
    return this.grossSalary() ? this.grossSalary()! * this.taxesRates.ktg.rate : 0;
  });

  /**
   * Calculate BVG coordinated salary (insured salary) - MONTHLY
   * Formula: (Annual Gross - Coordination Deduction) / numberOfSalaries
   * Subject to minimum (CHF 3,780) and maximum (CHF 64,260) annually
   * Only applies if annual gross salary >= entry threshold (CHF 22,680)
   */
  coordinatedSalary = computed<number>(() => {
    const monthlyGross = this.grossSalary();
    if (!monthlyGross) return 0;

    // Determine number of salaries per year (12 or 13)
    const numberOfSalaries = this.thirteenthSalaryEnabled() ? 13 : 12;

    // Convert monthly to annual for threshold checks
    const annualGross = monthlyGross * numberOfSalaries;

    // Check if salary meets BVG entry threshold (annual)
    if (annualGross < this.taxesRates.bvg.thresholds.entryThreshold) {
      return 0; // No BVG contributions below entry threshold
    }

    // Calculate coordinated salary (annual)
    const annualCoordinated = annualGross - this.taxesRates.bvg.thresholds.coordinationDeduction;

    // Apply minimum and maximum limits (annual)
    let finalAnnualCoordinated = annualCoordinated;
    if (annualCoordinated < this.taxesRates.bvg.thresholds.minimumInsured) {
      finalAnnualCoordinated = this.taxesRates.bvg.thresholds.minimumInsured;
    }
    if (annualCoordinated > this.taxesRates.bvg.thresholds.maximumInsured) {
      finalAnnualCoordinated = this.taxesRates.bvg.thresholds.maximumInsured;
    }

    // Return monthly coordinated salary (spread across number of salaries)
    return finalAnnualCoordinated / numberOfSalaries;
  });

  bvgContributionRate = computed<number>(
    () =>
      this.taxesRates.bvg.contributionRates.find(
        (rate) => this.age()! >= rate.minAge && this.age()! <= rate.maxAge
      )?.employeeShare ?? 0
  );

  bvgContributions = computed<number>(() => {
    const coordinated = this.coordinatedSalary();
    const rate = this.bvgContributionRate();
    const age = this.age();

    // No BVG if no coordinated salary, no rate, or age not in valid range
    if (!coordinated || coordinated === 0 || !rate || !age) {
      return 0;
    }

    // BVG only applies to ages 18-65
    if (age < 18 || age > 65) {
      return 0;
    }

    return coordinated * rate;
  });

  netSalary = computed<number | undefined>(() =>
    this.grossSalary()
      ? this.grossSalary()! -
        this.ahvIvEoContributions()! -
        this.alvContributions()! -
        this.nbuContributions()! -
        this.bvgContributions()! -
        this.ktgContributions()!
      : undefined
  );
}
