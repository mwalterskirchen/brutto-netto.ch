import { createMemo, type Component } from 'solid-js';
import type { CalculatorResult } from '../lib/calculator';
import { formatCHF, formatPercent } from '../lib/format';
import { t } from '../lib/i18n';
import {
  COLORS,
  DEDUCTION_META,
  tooltipBase,
  tooltipChip,
} from '../lib/calculator-ui';
import EChart from './EChart';

const SANKEY_GROSS = '__gross';
const SANKEY_NET = '__net';

const NODE_LABEL_BY_KEY: Record<string, string> = {
  [SANKEY_GROSS]: t.calculator.viz.nodeGross,
  [SANKEY_NET]: t.calculator.viz.nodeNet,
  ...Object.fromEntries(DEDUCTION_META.map((m) => [m.key, m.label])),
};

interface Props {
  result: CalculatorResult;
  gross: number;
}

const Sankey: Component<Props> = (props) => {
  const data = createMemo(() => buildSankeyData(props.result, props.gross));

  const option = createMemo(() => {
    const d = data();
    return {
      backgroundColor: 'transparent',
      tooltip: {
        ...tooltipBase,
        formatter: (params: any) => sankeyTooltip(params, d.gross),
      },
      series: [
        {
          type: 'sankey',
          left: 8,
          right: 110,
          top: 16,
          bottom: 16,
          nodeWidth: 14,
          nodeGap: 14,
          nodeAlign: 'justify',
          draggable: false,
          emphasis: { focus: 'adjacency' },
          lineStyle: { curveness: 0.55 },
          label: {
            color: '#f5f5f7',
            fontFamily: 'Geist Mono Variable, ui-monospace, monospace',
            fontSize: 11,
            fontWeight: 500,
            formatter: (p: any) => NODE_LABEL_BY_KEY[p.name] ?? p.name,
          },
          data: d.nodes,
          links: d.links,
          animationDuration: 500,
          animationDurationUpdate: 350,
          animationEasing: 'cubicOut',
          animationEasingUpdate: 'cubicOut',
        },
      ],
    };
  });

  return (
    <EChart
      modules={['sankey']}
      option={option()}
      class="w-full h-viz"
      ariaLabel={t.calculator.viz.sankeyAria}
    />
  );
};

function buildSankeyData(result: CalculatorResult, gross: number) {
  const netto = Math.max(0, result.net ?? gross - result.total);
  const nodes: any[] = [
    { name: SANKEY_GROSS, itemStyle: { color: COLORS.brutto, borderColor: COLORS.brutto } },
    { name: SANKEY_NET, itemStyle: { color: COLORS.netto, borderColor: COLORS.netto } },
  ];
  const links: any[] = [
    {
      source: SANKEY_GROSS,
      target: SANKEY_NET,
      value: netto,
      lineStyle: { color: COLORS.netto, opacity: 0.5 },
    },
  ];
  for (const meta of DEDUCTION_META) {
    const v = result[meta.key];
    if (v <= 0) continue;
    nodes.push({
      name: meta.key,
      itemStyle: { color: meta.color, borderColor: meta.color },
    });
    links.push({
      source: SANKEY_GROSS,
      target: meta.key,
      value: v,
      lineStyle: { color: meta.color, opacity: 0.45 },
    });
  }
  return { nodes, links, gross };
}

function sankeyTooltip(params: any, gross: number): string {
  if (params.dataType === 'node') {
    const meta = DEDUCTION_META.find((d) => d.key === params.name);
    if (meta) return tooltipChip({ color: meta.color, title: meta.label, explanation: meta.explanation });
    return `<strong>${NODE_LABEL_BY_KEY[params.name] ?? params.name}</strong>`;
  }
  if (params.dataType === 'edge') {
    const value = params.value as number;
    const pct = gross > 0 ? value / gross : 0;
    const meta = DEDUCTION_META.find((d) => d.key === params.data.target);
    const color = meta?.color ?? COLORS.netto;
    const title = meta?.label ?? NODE_LABEL_BY_KEY[params.data.target] ?? params.data.target;
    return tooltipChip({
      color,
      title,
      line: `${formatCHF(value)} · ${formatPercent(pct)}`,
      explanation: meta?.explanation,
    });
  }
  return '';
}

export default Sankey;
