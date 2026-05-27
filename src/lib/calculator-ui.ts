import { t } from './i18n';

export const COLORS = {
  ahvIvEo: '#ff6b35',
  bvg: '#4cc9f0',
  alv: '#b5179e',
  nbu: '#f7b801',
  ktg: '#06d6a0',
  netto: '#ffffff',
  brutto: '#f5f5f7',
} as const;

type DeductionKey = 'ahvIvEo' | 'bvg' | 'alv' | 'nbu' | 'ktg';

interface DeductionMeta {
  key: DeductionKey;
  color: string;
  label: string;
  explanation: string;
}

export const DEDUCTION_META: DeductionMeta[] = [
  { key: 'ahvIvEo', color: COLORS.ahvIvEo, label: t.deductions.ahvIvEo.label, explanation: t.deductions.ahvIvEo.explanation },
  { key: 'bvg', color: COLORS.bvg, label: t.deductions.bvg.label, explanation: t.deductions.bvg.explanation },
  { key: 'alv', color: COLORS.alv, label: t.deductions.alv.label, explanation: t.deductions.alv.explanation },
  { key: 'nbu', color: COLORS.nbu, label: t.deductions.nbu.label, explanation: t.deductions.nbu.explanation },
  { key: 'ktg', color: COLORS.ktg, label: t.deductions.ktg.label, explanation: t.deductions.ktg.explanation },
];

export const DASH = '—';

const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, easing: REVEAL_EASE },
});

export const tooltipBase = {
  trigger: 'item',
  backgroundColor: '#1c1c26',
  borderColor: '#3a3a48',
  borderWidth: 1,
  textStyle: { color: '#f5f5f7', fontFamily: 'Geist Variable, system-ui, sans-serif' },
  extraCssText: 'box-shadow: 0 12px 30px -10px rgba(0,0,0,0.6); border-radius: 10px;',
} as const;

export function tooltipChip(opts: {
  color: string;
  title: string;
  line?: string;
  explanation?: string;
}): string {
  return `
    <div style="display:flex;flex-direction:column;gap:6px;min-width:220px;font-family:Geist Variable,system-ui;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="width:8px;height:8px;border-radius:99px;background:${opts.color};box-shadow:0 0 0 3px ${opts.color}22"></span>
        <strong style="font-weight:600">${opts.title}</strong>
      </div>
      ${opts.line ? `<div style="font-family:Geist Mono Variable,ui-monospace;font-size:13px;color:#f5f5f7;">${opts.line}</div>` : ''}
      ${opts.explanation ? `<div style="color:#8a8a94;font-size:12px;line-height:1.4;">${opts.explanation}</div>` : ''}
    </div>`;
}
