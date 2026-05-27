import type { Frequency } from './calculator';

export interface ShareableInputs {
  gross: number | undefined;
  age: number | undefined;
  frequency: Frequency;
  thirteenth: boolean;
  ktg: boolean;
}

interface Payload {
  g?: number;
  a?: number;
  f?: 'm' | 'y';
  t?: 1;
  k?: 1;
}

function toBase64Url(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64u: string): string | null {
  try {
    return atob(b64u.replace(/-/g, '+').replace(/_/g, '/'));
  } catch {
    return null;
  }
}

const MIN_AGE = 18;
const MAX_AGE = 70;

const isValidGross = (n: unknown): n is number =>
  typeof n === 'number' && Number.isFinite(n) && n >= 0;
const isValidAge = (n: unknown): n is number =>
  typeof n === 'number' && Number.isFinite(n) && n >= MIN_AGE && n <= MAX_AGE;

export function encodeInputs(inputs: ShareableInputs): string {
  const payload: Payload = {};
  if (isValidGross(inputs.gross)) payload.g = inputs.gross;
  if (isValidAge(inputs.age)) payload.a = inputs.age;
  if (inputs.frequency === 'annual') payload.f = 'y';
  if (inputs.thirteenth) payload.t = 1;
  if (inputs.ktg) payload.k = 1;
  return toBase64Url(JSON.stringify(payload));
}

export function decodeInputs(hash: string): Partial<ShareableInputs> | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) return null;
  const json = fromBase64Url(raw);
  if (!json) return null;
  let parsed: Payload;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;
  const out: Partial<ShareableInputs> = {};
  if (isValidGross(parsed.g)) out.gross = parsed.g;
  if (isValidAge(parsed.a)) out.age = parsed.a;
  out.frequency = parsed.f === 'y' ? 'annual' : 'monthly';
  out.thirteenth = parsed.t === 1;
  out.ktg = parsed.k === 1;
  return out;
}

export function buildShareUrl(inputs: ShareableInputs): string {
  if (typeof window === 'undefined') return '';
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#${encodeInputs(inputs)}`;
}
