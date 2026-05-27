import { describe, it, expect } from 'vitest';
import { encodeInputs, decodeInputs } from './share';

describe('share encode/decode round-trip', () => {
  it('preserves valid inputs', () => {
    const decoded = decodeInputs('#' + encodeInputs({
      gross: 8000, age: 30, frequency: 'monthly', thirteenth: true, ktg: false,
    }));
    expect(decoded).toEqual({ gross: 8000, age: 30, frequency: 'monthly', thirteenth: true, ktg: false });
  });
});

describe('decodeInputs guards', () => {
  const encodeRaw = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  it('rejects negative gross', () => {
    const out = decodeInputs('#' + encodeRaw({ g: -100, f: 'm' }));
    expect(out?.gross).toBeUndefined();
  });

  it('rejects out-of-range age (too low, too high)', () => {
    expect(decodeInputs('#' + encodeRaw({ a: 5 }))?.age).toBeUndefined();
    expect(decodeInputs('#' + encodeRaw({ a: 99 }))?.age).toBeUndefined();
  });

  it('accepts boundary ages 18 and 70', () => {
    expect(decodeInputs('#' + encodeRaw({ a: 18 }))?.age).toBe(18);
    expect(decodeInputs('#' + encodeRaw({ a: 70 }))?.age).toBe(70);
  });

  it('rejects NaN/Infinity gross', () => {
    // JSON.stringify(NaN) → "null" so this exercises the typeof guard
    const out = decodeInputs('#' + encodeRaw({ g: null }));
    expect(out?.gross).toBeUndefined();
  });
});
