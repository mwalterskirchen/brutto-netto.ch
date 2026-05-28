/**
 * Swiss Payroll Tax Rates - 2026
 *
 * Sources:
 * - Federal Social Insurance Office (BSV): https://www.bsv.admin.ch/
 * - ASGA: https://www.asga.ch/wp-content/uploads/downloads/merkblaetter/merkblaetter-e/renten-und-grenzbetraege_2026_e.pdf
 *
 * Last Updated: December 2025
 * Effective From: January 1, 2026
 * Next Review: December 2026
 */

export const DEDUCTION_RATES_2026 = {
  socialSecurity: {
    ahvIvEo: {
      rate: 0.053,
    },
    alv: {
      standardRate: 0.011,
      annualThreshold: 148200,
      solidarityRate: 0.005,
    },
  },
  bvg: {
    thresholds: {
      entryThreshold: 22680,
      coordinationDeduction: 26460,
      minimumInsured: 3780,
      maximumInsured: 64260,
      upperLimit: 90720,
    },
    contributionRates: [
      { ageGroup: '18-24', minAge: 18, maxAge: 24, totalRate: 0.016, employeeShare: 0.008 },
      { ageGroup: '25-34', minAge: 25, maxAge: 34, totalRate: 0.094, employeeShare: 0.047 },
      { ageGroup: '35-44', minAge: 35, maxAge: 44, totalRate: 0.131, employeeShare: 0.0655 },
      { ageGroup: '45-54', minAge: 45, maxAge: 54, totalRate: 0.188, employeeShare: 0.094 },
      { ageGroup: '55-65', minAge: 55, maxAge: 65, totalRate: 0.202, employeeShare: 0.101 },
    ],
  },
  nbu: {
    rate: 0.01,
  },
  ktg: {
    rate: 0.008,
  },
} as const;
