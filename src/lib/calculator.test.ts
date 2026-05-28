import { describe, it, expect } from 'vitest';
import { calculate, type CalculatorInputs } from './calculator';

const base: CalculatorInputs = {
  grossSalary: undefined,
  age: undefined,
  ktgEnabled: false,
  thirteenthSalaryEnabled: false,
  frequency: 'monthly',
};

describe('calculate', () => {
  it('returns zeros and undefined net for empty inputs', () => {
    const r = calculate(base);
    expect(r.annualGrossSalary).toBe(0);
    expect(r.ahvIvEo).toBe(0);
    expect(r.alv).toBe(0);
    expect(r.nbu).toBe(0);
    expect(r.ktg).toBe(0);
    expect(r.bvg).toBe(0);
    expect(r.total).toBe(0);
    expect(r.totalPct).toBe(0);
    expect(r.net).toBeUndefined();
  });

  it('low earner: CHF 5,000/mo, age 30, no 13th, no KTG', () => {
    const r = calculate({ ...base, grossSalary: 5000, age: 30 });
    expect(r.annualGrossSalary).toBe(60000);
    expect(r.ahvIvEo).toBeCloseTo(265, 2); // 5000 * 0.053
    expect(r.alv).toBeCloseTo(55, 2); // 5000 * 0.011 (under threshold)
    expect(r.nbu).toBeCloseTo(50, 2); // 5000 * 0.01
    expect(r.ktg).toBe(0);
    // coordinated = clamp(60000 - 26460, 3780, 64260) = 33540
    // monthly bvg = 33540 * 0.047 / 12 ≈ 131.365
    expect(r.bvg).toBeCloseTo((33540 * 0.047) / 12, 2);
    expect(r.total).toBeCloseTo(265 + 55 + 50 + (33540 * 0.047) / 12, 2);
    expect(r.net).toBeCloseTo(5000 - r.total, 6);
  });

  it('mid earner with 13th: CHF 10,000/mo, age 45, 13th on', () => {
    const r = calculate({
      ...base,
      grossSalary: 10000,
      age: 45,
      thirteenthSalaryEnabled: true,
    });
    expect(r.annualGrossSalary).toBe(130000);
    // 45 → 45-54 bracket → 0.094 employee share
    // coordinated = clamp(130000 - 26460, 3780, 64260) = 64260 (clamped at max)
    // monthly bvg = 64260 * 0.094 / 13 ≈ 464.65
    expect(r.bvg).toBeCloseTo((64260 * 0.094) / 13, 2);
    expect(r.ahvIvEo).toBeCloseTo(530, 2);
    // ALV under annual threshold (130000 < 148200): all standard
    expect(r.alv).toBeCloseTo((130000 * 0.011) / 13, 2);
  });

  it('high earner above ALV solidarity threshold: CHF 200,000/yr, age 40, annual', () => {
    const r = calculate({
      ...base,
      grossSalary: 200000,
      age: 40,
      frequency: 'annual',
    });
    expect(r.annualGrossSalary).toBe(200000);
    // ALV: 148200 * 0.011 + (200000 - 148200) * 0.005 = 1630.2 + 259 = 1889.2
    expect(r.alv).toBeCloseTo(1630.2 + 259, 2);
    expect(r.ahvIvEo).toBeCloseTo(200000 * 0.053, 2);
  });

  it('BVG entry threshold: just below → 0, just above → > 0', () => {
    // entryThreshold = 22680 → monthly = 1890
    const below = calculate({ ...base, grossSalary: 1889, age: 30 });
    expect(below.bvg).toBe(0);
    const above = calculate({ ...base, grossSalary: 1900, age: 30 });
    // 1900 * 12 = 22800 > 22680
    // coordinated = clamp(22800 - 26460, 3780, 64260) = 3780 (clamped to min)
    expect(above.bvg).toBeGreaterThan(0);
    expect(above.bvg).toBeCloseTo((3780 * 0.047) / 12, 2);
  });

  it('BVG maximum insured clamp at very high annual salary', () => {
    const r = calculate({ ...base, grossSalary: 500000, age: 50, frequency: 'annual' });
    // coordinated clamped to 64260
    expect(r.bvg).toBeCloseTo(64260 * 0.094, 2);
  });

  it('KTG toggle on increases total by gross * 0.008', () => {
    const off = calculate({ ...base, grossSalary: 8000, age: 30 });
    const on = calculate({ ...base, grossSalary: 8000, age: 30, ktgEnabled: true });
    expect(on.ktg).toBeCloseTo(8000 * 0.008, 6);
    expect(on.total - off.total).toBeCloseTo(8000 * 0.008, 6);
  });

  it('monthly×12 ≡ annual (no 13th) for equivalent annual gross', () => {
    const monthly = calculate({ ...base, grossSalary: 7000, age: 35 });
    const annual = calculate({ ...base, grossSalary: 84000, age: 35, frequency: 'annual' });
    expect(monthly.annualGrossSalary).toBe(annual.annualGrossSalary);
    expect(monthly.alv * 12).toBeCloseTo(annual.alv, 4);
    expect(monthly.bvg * 12).toBeCloseTo(annual.bvg, 4);
    // AHV/IV/EO and NBU are flat percentages of display gross — convert
    expect(monthly.ahvIvEo * 12).toBeCloseTo(annual.ahvIvEo, 4);
    expect(monthly.nbu * 12).toBeCloseTo(annual.nbu, 4);
  });

  it('age outside any bracket gives zero BVG even if salary qualifies', () => {
    const r = calculate({ ...base, grossSalary: 10000, age: 16 });
    expect(r.bvg).toBe(0);
  });
});
