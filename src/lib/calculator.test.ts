import { describe, expect, it } from 'vitest';
import { calculateNetSalary, formatCurrency, formatPercent, type SalaryInput } from './calculator';

const base: SalaryInput = {
  frequency: 'monthly',
  grossSalary: undefined,
  age: undefined,
  thirteenthSalary: false,
  ktg: false,
};

const cases: [string, Partial<SalaryInput>][] = [
  ['empty input', {}],
  ['monthly, no age', { grossSalary: 6000 }],
  ['monthly, age 18', { grossSalary: 4000, age: 18 }],
  ['monthly, age 24', { grossSalary: 4000, age: 24 }],
  ['monthly, age 25', { grossSalary: 6000, age: 25 }],
  ['monthly, age 34', { grossSalary: 6000, age: 34 }],
  ['monthly, age 35', { grossSalary: 8000, age: 35 }],
  ['monthly, age 45', { grossSalary: 8000, age: 45 }],
  ['monthly, age 55', { grossSalary: 8000, age: 55 }],
  ['monthly, age 65', { grossSalary: 8000, age: 65 }],
  ['monthly, age 66 (outside bands)', { grossSalary: 8000, age: 66 }],
  ['monthly, age 17 (outside bands)', { grossSalary: 8000, age: 17 }],
  ['monthly, below BVG entry threshold', { grossSalary: 1800, age: 40 }],
  ['monthly, just above BVG entry threshold', { grossSalary: 1900, age: 40 }],
  ['monthly, coordinated salary at minimum insured', { grossSalary: 2200, age: 40 }],
  ['monthly, above BVG maximum insured', { grossSalary: 9000, age: 40 }],
  ['monthly, at ALV threshold', { grossSalary: 12350, age: 40 }],
  ['monthly, above ALV threshold', { grossSalary: 20000, age: 40 }],
  ['monthly, 13th salary', { grossSalary: 6000, age: 30, thirteenthSalary: true }],
  ['monthly, 13th salary above ALV threshold', { grossSalary: 12000, age: 40, thirteenthSalary: true }],
  ['monthly, KTG', { grossSalary: 6000, age: 30, ktg: true }],
  ['monthly, all options', { grossSalary: 7500, age: 50, thirteenthSalary: true, ktg: true }],
  ['annual, no age', { frequency: 'annual', grossSalary: 80000 }],
  ['annual, age 30', { frequency: 'annual', grossSalary: 80000, age: 30 }],
  ['annual, above ALV threshold', { frequency: 'annual', grossSalary: 200000, age: 45 }],
  ['annual, 13th salary', { frequency: 'annual', grossSalary: 91000, age: 40, thirteenthSalary: true }],
  ['annual, KTG', { frequency: 'annual', grossSalary: 60000, age: 22, ktg: true }],
  ['annual, below BVG entry threshold', { frequency: 'annual', grossSalary: 20000, age: 40 }],
  ['zero gross salary', { grossSalary: 0, age: 40 }],
];

describe('calculateNetSalary', () => {
  it.each(cases)('%s', (_name, input) => {
    expect(calculateNetSalary({ ...base, ...input })).toMatchSnapshot();
  });
});

describe('formatting', () => {
  it.each([0, 0.5, 1234.5, 6543.21, 1234567.891, -12.3])('formatCurrency(%s)', (value) => {
    expect(formatCurrency(value)).toMatchSnapshot();
  });

  it.each([0, 0.12345, 0.1, 0.0999, 1])('formatPercent(%s)', (value) => {
    expect(formatPercent(value)).toMatchSnapshot();
  });
});
