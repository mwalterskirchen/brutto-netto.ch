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
  /**
   * Social Security Contributions (Employee Share)
   * These are mandatory for all employees in Switzerland
   */
  socialSecurity: {
    /**
     * AHV/IV/EO Combined Rate
     * AHV (Old-age insurance): 4.35%
     * IV (Disability insurance): 0.7%
     * EO (Income compensation): 0.25%
     * Total: 5.3%
     */
    ahvIvEo: {
      rate: 0.053, // 5.3% employee share (employer pays another 5.3%)
    },

    /**
     * ALV (Unemployment Insurance)
     * Standard rate up to income threshold
     * Additional solidarity rate above threshold
     */
    alv: {
      standardRate: 0.011, // 1.1% employee share
      annualThreshold: 148200, // CHF per year (unchanged)
      solidarityRate: 0.005, // Additional 0.5% on income above threshold
    },
  },

  /**
   * BVG (Occupational Pension Fund)
   * Second pillar of Swiss pension system
   * Mandatory for employees earning above entry threshold
   *
   * Age-based coverage:
   * - Age 18-24: Risk coverage only (death & disability) - lower contributions
   * - Age 25+: Full coverage (risk + retirement savings) - higher contributions
   *
   * IMPORTANT: These are the MANDATORY MINIMUM rates set by federal law.
   * - Rates are UNIFORM across all cantons (federal regulation)
   * - Individual pension funds (Pensionskassen) may offer HIGHER rates
   * - Employer/employee split is typically 50/50 but can vary
   * - Some employers contribute more than the minimum 50%
   */
  bvg: {
    /**
     * Salary thresholds (annual amounts in CHF)
     */
    thresholds: {
      entryThreshold: 22680, // Minimum annual salary for BVG obligation (unchanged)
      coordinationDeduction: 26460, // CHANGED from 25,725 in 2024 (+735 CHF)
      minimumInsured: 3780, // Minimum insured amount (unchanged)
      maximumInsured: 64260, // Maximum insured salary (unchanged)
      upperLimit: 90720, // Upper limit for insured salary (max gross for full BVG)
    },

    /**
     * Age-based contribution rates (TYPICAL ESTIMATES including risk premiums)
     *
     * NOTE: These rates are HIGHER than the statutory minimum because they include
     * both retirement savings credits AND risk premiums (death & disability coverage).
     *
     * Statutory MINIMUM rates (Art. 16 BVG) for retirement savings credits ONLY:
     * - Age 25-34: 7% total (3.5% employee)
     * - Age 35-44: 10% total (5% employee)
     * - Age 45-54: 15% total (7.5% employee)
     * - Age 55-65: 18% total (9% employee)
     *
     * The rates below represent typical pension fund contributions including:
     * - Retirement savings credits (as per Art. 16 BVG)
     * - Risk premiums for death & disability (varies by pension fund, typically 1-3%)
     *
     * Actual rates depend on your specific pension fund (Pensionskasse).
     * These are TOTAL rates (employer + employee combined), typically split 50/50.
     */
    contributionRates: [
      {
        ageGroup: '18-24',
        minAge: 18,
        maxAge: 24,
        totalRate: 0.016, // ~1.6% total - RISK COVERAGE ONLY (no retirement savings)
        employeeShare: 0.008, // 0.8% employee share (50/50 split)
        description: 'Risk coverage only (death and disability) - no retirement savings',
      },
      {
        ageGroup: '25-34',
        minAge: 25,
        maxAge: 34,
        totalRate: 0.094, // ~9.4% total (7% statutory retirement + ~2.4% risk)
        employeeShare: 0.047, // 4.7% employee share (50/50 split)
        description: 'Young professionals - includes retirement savings + risk',
      },
      {
        ageGroup: '35-44',
        minAge: 35,
        maxAge: 44,
        totalRate: 0.131, // ~13.1% total (10% statutory retirement + ~3.1% risk)
        employeeShare: 0.0655, // 6.55% employee share (50/50 split)
        description: 'Mid-career - includes retirement savings + risk',
      },
      {
        ageGroup: '45-54',
        minAge: 45,
        maxAge: 54,
        totalRate: 0.188, // ~18.8% total (15% statutory retirement + ~3.8% risk)
        employeeShare: 0.094, // 9.4% employee share (50/50 split)
        description: 'Senior professionals - includes retirement savings + risk',
      },
      {
        ageGroup: '55-65',
        minAge: 55,
        maxAge: 65,
        totalRate: 0.202, // ~20.2% total (18% statutory retirement + ~2.2% risk)
        employeeShare: 0.101, // 10.1% employee share (50/50 split)
        description: 'Pre-retirement - includes retirement savings + risk',
      },
    ],
  },

  /**
   * NBU (Non-Occupational Accident Insurance) - OPTIONAL
   * This is typically paid by the employee
   * Only mandatory if working more than 8 hours/week
   */
  nbu: {
    rate: 0.01, // ~1% (varies by insurance company and employer)
  },

  /**
   * KTG (Krankentaggeldversicherung - Daily Sickness Benefit Insurance) - OPTIONAL
   * Not federally mandatory but often required by employers or collective agreements
   * Covers ~80% of salary for up to 720 days of sickness
   * Rate varies by insurance and employer (typically 0.8-1.5% total)
   */
  ktg: {
    rate: 0.008, // ~0.8% employee share (varies by insurance and employer)
  },
} as const;
