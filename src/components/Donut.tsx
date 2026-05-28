import { createMemo, type Component } from 'solid-js';
import type { CalculatorResult } from '../lib/calculator';
import { formatCHF, formatPercent } from '../lib/format';
import { t } from '../lib/i18n';
import { COLORS, DEDUCTION_META, tooltipBase, tooltipChip } from '../lib/calculator-ui';
import EChart from './EChart';

const DONUT_NETTO = '__netto';

interface Props {
  result: CalculatorResult;
  gross: number;
}

const Donut: Component<Props> = (props) => {
  const data = createMemo(() => buildDonutData(props.result, props.gross));

  const option = createMemo(() => {
    const d = data();
    return {
      backgroundColor: 'transparent',
      tooltip: {
        ...tooltipBase,
        formatter: (params: any) => donutTooltip(params, d.gross),
      },
      series: [
        {
          type: 'pie',
          radius: ['58%', '86%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          label: { show: false },
          labelLine: { show: false },
          itemStyle: { borderColor: '#14141c', borderWidth: 2 },
          selectedMode: 'single',
          selectedOffset: 6,
          data: d.slices,
          animationDuration: 500,
          animationDurationUpdate: 350,
          animationEasing: 'cubicOut',
          animationEasingUpdate: 'cubicOut',
        },
      ],
    };
  });

  return (
    <div class="relative w-full h-viz">
      <EChart
        modules={['pie']}
        option={option()}
        class="absolute inset-0"
        ariaLabel={t.calculator.viz.donutAria}
      />
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
        <span class="font-mono text-2xs uppercase tracking-widest text-fg-muted">
          {t.calculator.viz.nodeNet}
        </span>
        <span class="text-2xl font-medium text-fg tabular-nums">{formatCHF(data().netto)}</span>
        <span class="font-mono text-xs text-fg-muted tabular-nums">
          {formatPercent(data().netPct)}
        </span>
      </div>
    </div>
  );
};

function buildDonutData(result: CalculatorResult, gross: number) {
  const netto = Math.max(0, result.net ?? gross - result.total);
  const slices: any[] = [
    {
      key: DONUT_NETTO,
      name: t.calculator.viz.nodeNet,
      value: netto,
      itemStyle: { color: COLORS.netto },
    },
  ];
  for (const meta of DEDUCTION_META) {
    const v = result[meta.key];
    if (v <= 0) continue;
    slices.push({
      key: meta.key,
      name: meta.label,
      value: v,
      itemStyle: { color: meta.color },
    });
  }
  const netPct = gross > 0 ? netto / gross : 0;
  return { slices, netto, netPct, gross };
}

function donutTooltip(params: any, gross: number): string {
  const key: string = params.data?.key ?? '';
  const value = params.value as number;
  const pct = gross > 0 ? value / gross : 0;
  if (key === DONUT_NETTO) {
    return tooltipChip({
      color: COLORS.netto,
      title: t.calculator.viz.nodeNet,
      line: `${formatCHF(value)} · ${formatPercent(pct)}`,
    });
  }
  const meta = DEDUCTION_META.find((d) => d.key === key);
  if (!meta) return '';
  return tooltipChip({
    color: meta.color,
    title: meta.label,
    line: `${formatCHF(value)} · ${formatPercent(pct)}`,
    explanation: meta.explanation,
  });
}

export default Donut;
