import {
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  createEffect,
  Show,
  For,
  type Component,
  type JSX,
} from 'solid-js';
import { Motion } from 'solid-motionone';
import { debounce } from '@solid-primitives/scheduled';
import type { ECharts } from 'echarts/core';
import { calculate, type CalculatorResult, type Frequency } from '../lib/calculator';
import { formatCHF, formatPercent } from '../lib/format';
import { t } from '../lib/i18n';
import {
  medianForFrequency,
  SWISS_MEDIAN_REFERENCE_YEAR,
  SWISS_MEDIAN_SOURCE_URL,
} from '../lib/comparison';

const COLORS = {
  ahvIvEo: '#ff6b35',
  bvg: '#4cc9f0',
  alv: '#b5179e',
  nbu: '#f7b801',
  ktg: '#06d6a0',
  netto: '#ffffff',
  brutto: '#f5f5f7',
} as const;

type DeductionKey = 'ahvIvEo' | 'bvg' | 'alv' | 'nbu' | 'ktg';

const DEDUCTION_META: { key: DeductionKey; color: string; label: string; explanation: string }[] = [
  { key: 'ahvIvEo', color: COLORS.ahvIvEo, label: t.deductions.ahvIvEo.label, explanation: t.deductions.ahvIvEo.explanation },
  { key: 'bvg', color: COLORS.bvg, label: t.deductions.bvg.label, explanation: t.deductions.bvg.explanation },
  { key: 'alv', color: COLORS.alv, label: t.deductions.alv.label, explanation: t.deductions.alv.explanation },
  { key: 'nbu', color: COLORS.nbu, label: t.deductions.nbu.label, explanation: t.deductions.nbu.explanation },
  { key: 'ktg', color: COLORS.ktg, label: t.deductions.ktg.label, explanation: t.deductions.ktg.explanation },
];

function parseNumber(value: string): number | undefined {
  if (value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

const DASH = '—';

const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, easing: REVEAL_EASE },
});

const Calculator: Component = () => {
  const [grossInput, setGrossInput] = createSignal<number | undefined>(undefined);
  const [age, setAge] = createSignal<number | undefined>(undefined);
  const [ktgEnabled, setKtgEnabled] = createSignal(false);
  const [thirteenthEnabled, setThirteenthEnabled] = createSignal(false);
  const [frequency, setFrequency] = createSignal<Frequency>('monthly');

  onMount(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      switch (e.key.toLowerCase()) {
        case 'm': setFrequency('monthly'); break;
        case 'y': setFrequency('annual'); break;
        case 't':
          if (frequency() === 'annual') return;
          setThirteenthEnabled(!thirteenthEnabled());
          break;
        case 'k': setKtgEnabled(!ktgEnabled()); break;
        default: return;
      }
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    onCleanup(() => window.removeEventListener('keydown', onKey));
  });

  const isGhost = createMemo(() => grossInput() === undefined);

  const result = createMemo<CalculatorResult>(() =>
    calculate({
      grossSalary: grossInput(),
      age: age() ?? 35,
      ktgEnabled: ktgEnabled(),
      thirteenthSalaryEnabled: thirteenthEnabled(),
      frequency: frequency(),
    }),
  );

  return (
    <section
      class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-12 lg:items-start"
      aria-label="Lohnrechner"
    >
      <ControlDeck
        gross={grossInput()}
        setGross={setGrossInput}
        age={age()}
        setAge={setAge}
        frequency={frequency()}
        setFrequency={setFrequency}
        thirteenth={thirteenthEnabled()}
        setThirteenth={setThirteenthEnabled}
        ktg={ktgEnabled()}
        setKtg={setKtgEnabled}
      />
      <FlowAndReceipt
        result={result()}
        ghost={isGhost()}
        gross={grossInput() ?? 0}
        frequency={frequency()}
      />
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   ControlDeck
   ───────────────────────────────────────────────────────────────────────────── */

interface ControlDeckProps {
  gross: number | undefined;
  setGross: (n: number | undefined) => void;
  age: number | undefined;
  setAge: (n: number | undefined) => void;
  frequency: Frequency;
  setFrequency: (f: Frequency) => void;
  thirteenth: boolean;
  setThirteenth: (b: boolean) => void;
  ktg: boolean;
  setKtg: (b: boolean) => void;
}

const ControlDeck: Component<ControlDeckProps> = (props) => {
  const isMonthly = () => props.frequency === 'monthly';
  const salaryLabel = () =>
    isMonthly() ? t.calculator.grossSalary.labelMonthly : t.calculator.grossSalary.labelAnnual;

  const onFreqChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
    props.setFrequency(e.currentTarget.value as Frequency);
  };

  return (
    <Motion.div class="flex flex-col gap-5 lg:sticky lg:top-6" {...reveal(0.12)}>
      {/* Frequency segmented control */}
      <div role="tablist" aria-label={t.calculator.frequency.label} class="segmented">
        <input
          type="radio"
          id="freq-monthly"
          name="frequency"
          value="monthly"
          class="sr-only"
          checked={isMonthly()}
          onChange={onFreqChange}
        />
        <label for="freq-monthly" role="tab" aria-selected={isMonthly()} aria-keyshortcuts="m">
          <span>{t.calculator.frequency.monthly}</span>
          <kbd class="kbd ml-2">M</kbd>
        </label>
        <input
          type="radio"
          id="freq-annual"
          name="frequency"
          value="annual"
          class="sr-only"
          checked={!isMonthly()}
          onChange={onFreqChange}
        />
        <label for="freq-annual" role="tab" aria-selected={!isMonthly()} aria-keyshortcuts="y">
          <span>{t.calculator.frequency.annual}</span>
          <kbd class="kbd ml-2">Y</kbd>
        </label>
      </div>

      <CryptoNumberField
        id="grossSalary"
        label={salaryLabel()}
        unit={t.calculator.grossSalary.unit}
        placeholder={t.calculator.grossSalary.placeholder}
        value={props.gross}
        onChange={props.setGross}
        min={1}
      />

      <CryptoNumberField
        id="age"
        label={t.calculator.age.label}
        unit={t.calculator.age.unit}
        placeholder={t.calculator.age.placeholder}
        value={props.age}
        onChange={props.setAge}
        min={18}
        max={70}
      />

      <div class="card p-4 flex flex-col gap-3.5">
        <ToggleRow
          id="thirteenth"
          label={t.calculator.toggles.thirteenth}
          shortcut="T"
          checked={props.thirteenth}
          onChange={props.setThirteenth}
          disabled={props.frequency === 'annual'}
        />
        <div class="border-t border-border" />
        <ToggleRow
          id="ktg"
          label={t.calculator.toggles.ktg}
          shortcut="K"
          checked={props.ktg}
          onChange={props.setKtg}
        />
      </div>
    </Motion.div>
  );
};

/* Encrypted-style number field — the privacy flourish lives here. */
const CryptoNumberField: Component<{
  id: string;
  label: string;
  unit: string;
  placeholder: string;
  value: number | undefined;
  onChange: (n: number | undefined) => void;
  min?: number;
  max?: number;
}> = (props) => {
  let inputRef: HTMLInputElement | undefined;

  const jitter = () => {
    if (!inputRef) return;
    inputRef.classList.remove('is-jittering');
    // force reflow to restart the animation
    void inputRef.offsetWidth;
    inputRef.classList.add('is-jittering');
  };

  return (
    <div class="flex flex-col gap-1.5">
      <div class="flex items-baseline justify-between">
        <label for={props.id} class="font-mono text-xs uppercase tracking-wider text-fg-muted">
          {props.label}
        </label>
        <span class="font-mono text-xs text-fg-subtle">{props.unit}</span>
      </div>
      <input
        ref={inputRef}
        id={props.id}
        type="number"
        inputmode="decimal"
        class="control-input"
        placeholder={props.placeholder}
        value={props.value ?? ''}
        min={props.min}
        max={props.max}
        onInput={(e) => {
          jitter();
          props.onChange(parseNumber(e.currentTarget.value));
        }}
      />
    </div>
  );
};

const ComparisonLine: Component<{ frequency: Frequency }> = (props) => {
  const median = () => medianForFrequency(props.frequency);
  const note = () =>
    props.frequency === 'monthly' ? t.comparison.monthlyNote : t.comparison.annualNote;
  return (
    <p class="font-mono text-xs text-fg-subtle flex flex-wrap items-center gap-x-2 gap-y-1">
      <span>{t.comparison.label(SWISS_MEDIAN_REFERENCE_YEAR)}</span>
      <span class="text-fg">{formatCHF(median())}</span>
      <span>· {note()} ·</span>
      <a
        href={SWISS_MEDIAN_SOURCE_URL}
        target="_blank"
        rel="noopener"
        class="no-underline text-fg-muted hover:text-fg"
      >
        {t.comparison.source} ↗
      </a>
    </p>
  );
};

const Stat: Component<{ label: string; value: string }> = (props) => (
  <div class="flex flex-col gap-0.5 min-w-0">
    <p class="font-mono text-2xs uppercase tracking-wider text-fg-subtle truncate">
      {props.label}
    </p>
    <p class="font-mono text-sm sm:text-base text-fg tabular-nums">{props.value}</p>
  </div>
);

const ToggleRow: Component<{
  id: string;
  label: string;
  shortcut?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}> = (props) => (
  <label
    class="flex items-center justify-between gap-3 text-sm"
    classList={{
      'cursor-pointer': !props.disabled,
      'cursor-not-allowed opacity-40': props.disabled,
    }}
    for={props.id}
    aria-disabled={props.disabled || undefined}
  >
    <span class="flex items-center gap-2 text-fg">
      <span>{props.label}</span>
      <Show when={props.shortcut && !props.disabled}>
        <kbd class="kbd">{props.shortcut}</kbd>
      </Show>
    </span>
    <span class="relative inline-block shrink-0">
      <input
        id={props.id}
        type="checkbox"
        class="peer sr-only"
        checked={props.checked}
        disabled={props.disabled}
        aria-keyshortcuts={!props.disabled ? props.shortcut?.toLowerCase() : undefined}
        onChange={(e) => props.onChange(e.currentTarget.checked)}
      />
      <span class="toggle-track" aria-hidden="true">
        <span class="toggle-thumb" />
      </span>
    </span>
  </label>
);

/* ─────────────────────────────────────────────────────────────────────────────
   FlowAndReceipt — Netto headline, Sankey/Waterfall, deduction receipt
   ───────────────────────────────────────────────────────────────────────────── */

const FlowAndReceipt: Component<{
  result: CalculatorResult;
  ghost: boolean;
  gross: number;
  frequency: Frequency;
}> = (props) => {
  const periodSuffix = () => (props.frequency === 'monthly' ? '/Monat' : '/Jahr');
  const totalPct = () => props.result.totalPct;

  return (
    <div class="flex flex-col gap-6">
      <Motion.header
        class="card p-5 sm:p-6 md:p-8 [container-type:inline-size]"
        {...reveal(0.2)}
      >
        <div class="flex flex-col gap-1.5">
          <p class="font-mono text-xs uppercase tracking-widest text-fg-muted">
            {t.calculator.receipt.netHeading}
            <span class="text-fg-subtle"> {periodSuffix()}</span>
          </p>
          <p
            class="font-mono text-[clamp(1.75rem,11cqw,6rem)] leading-none tracking-tight"
            classList={{ 'text-fg-subtle': props.ghost, 'text-fg': !props.ghost }}
          >
            {props.ghost ? DASH : formatCHF(props.result.net ?? 0)}
          </p>
        </div>
        <div class="mt-5 pt-5 border-t border-border grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
          <Stat
            label={`${t.calculator.receipt.grossHeading} ${periodSuffix()}`}
            value={props.ghost ? DASH : formatCHF(props.gross)}
          />
          <Stat
            label={t.calculator.receipt.totalLabel}
            value={props.ghost ? DASH : `−${formatCHF(props.result.total)}`}
          />
          <Stat
            label={t.calculator.receipt.ofGross}
            value={props.ghost ? DASH : formatPercent(totalPct())}
          />
        </div>
        <Show when={!props.ghost}>
          <div class="mt-4">
            <ComparisonLine frequency={props.frequency} />
          </div>
        </Show>
      </Motion.header>

      <FlowVisualization
        result={props.result}
        gross={props.gross}
        ghost={props.ghost}
        frequency={props.frequency}
      />

      <DeductionList result={props.result} ghost={props.ghost} frequency={props.frequency} />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   FlowVisualization — Sankey (desktop) / Donut (mobile)
   ───────────────────────────────────────────────────────────────────────────── */

const FlowVisualization: Component<{
  result: CalculatorResult;
  gross: number;
  ghost: boolean;
  frequency: Frequency;
}> = (props) => {
  const [isWide, setIsWide] = createSignal(false);

  onMount(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    setIsWide(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mql.addEventListener('change', handler);
    onCleanup(() => mql.removeEventListener('change', handler));
  });

  return (
    <Motion.div class="card p-4 sm:p-6" {...reveal(0.3)}>
      <Show when={!props.ghost} fallback={<SkeletonViz />}>
        <Show when={isWide()} fallback={<Donut result={props.result} gross={props.gross} />}>
          <Sankey result={props.result} gross={props.gross} />
        </Show>
      </Show>
    </Motion.div>
  );
};

/* Static wireframe shown while no gross has been entered.
   Same height as `.h-viz` to avoid layout shift when results arrive. */
const SkeletonViz: Component = () => {
  const widths = ['100%', '70%', '45%', '30%'];
  return (
    <div class="w-full h-viz flex flex-col justify-center gap-4" aria-hidden="true">
      <For each={widths}>
        {(w) => <div class="h-3 rounded-full bg-surface-elevated" style={{ width: w }} />}
      </For>
    </div>
  );
};

/* Stable join keys for sankey nodes — never user-visible. */
const SANKEY_GROSS = '__gross';
const SANKEY_NET = '__net';

const NODE_LABEL_BY_KEY: Record<string, string> = {
  [SANKEY_GROSS]: t.calculator.viz.nodeGross,
  [SANKEY_NET]: t.calculator.viz.nodeNet,
  ...Object.fromEntries(DEDUCTION_META.map((m) => [m.key, m.label])),
};

/* Build sankey nodes + links from result */
function buildSankeyData(result: CalculatorResult, gross: number) {
  const netto = Math.max(0, result.net ?? gross - result.total);
  const nodes: { name: string; itemStyle: { color: string; borderColor: string }; label?: any }[] = [
    {
      name: SANKEY_GROSS,
      itemStyle: { color: COLORS.brutto, borderColor: COLORS.brutto },
    },
    {
      name: SANKEY_NET,
      itemStyle: { color: COLORS.netto, borderColor: COLORS.netto },
    },
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

const Sankey: Component<{ result: CalculatorResult; gross: number }> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  let chart: ECharts | undefined;
  let disposed = false;

  const apply = (data: ReturnType<typeof buildSankeyData>) => {
    if (!chart) return;
    chart.setOption(
      {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: '#1c1c26',
          borderColor: '#3a3a48',
          borderWidth: 1,
          textStyle: { color: '#f5f5f7', fontFamily: 'Geist Variable, system-ui, sans-serif' },
          extraCssText: 'box-shadow: 0 12px 30px -10px rgba(0,0,0,0.6); border-radius: 10px;',
          formatter: (params: any) => sankeyTooltip(params, data.gross),
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
            data: data.nodes,
            links: data.links,
            animationDuration: 500,
            animationDurationUpdate: 350,
            animationEasing: 'cubicOut',
            animationEasingUpdate: 'cubicOut',
          },
        ],
      },
      { notMerge: false, lazyUpdate: true },
    );
  };

  const debouncedApply = debounce((data: ReturnType<typeof buildSankeyData>) => apply(data), 150);

  let ro: ResizeObserver | undefined;

  onMount(async () => {
    if (!containerRef) return;
    const [core, charts, components, renderers] = await Promise.all([
      import('echarts/core'),
      import('echarts/charts'),
      import('echarts/components'),
      import('echarts/renderers'),
    ]);
    if (disposed || !containerRef) return;
    core.use([charts.SankeyChart, components.TooltipComponent, renderers.CanvasRenderer]);
    chart = core.init(containerRef, null, { renderer: 'canvas' });
    apply(buildSankeyData(props.result, props.gross));
    ro = new ResizeObserver(() => chart?.resize());
    ro.observe(containerRef);
  });

  onCleanup(() => {
    disposed = true;
    ro?.disconnect();
    chart?.dispose();
    chart = undefined;
  });

  createEffect(() => {
    const data = buildSankeyData(props.result, props.gross);
    debouncedApply(data);
  });

  return (
    <div
      ref={containerRef}
      class="w-full h-viz"
      role="img"
      aria-label={t.calculator.viz.sankeyAria}
    />
  );
};

function tooltipChip(opts: {
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

/* ─────────────────────────────────────────────────────────────────────────────
   Donut (mobile): netto retention ring with deduction wedges
   ───────────────────────────────────────────────────────────────────────────── */

const DONUT_NETTO = '__netto';

function buildDonutData(result: CalculatorResult, gross: number) {
  const netto = Math.max(0, result.net ?? gross - result.total);
  const slices: { key: string; name: string; value: number; itemStyle: { color: string } }[] = [
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

const Donut: Component<{ result: CalculatorResult; gross: number }> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  let chart: ECharts | undefined;
  let disposed = false;
  let ro: ResizeObserver | undefined;

  const data = createMemo(() => buildDonutData(props.result, props.gross));

  const apply = (d: ReturnType<typeof buildDonutData>) => {
    if (!chart) return;
    chart.setOption(
      {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: '#1c1c26',
          borderColor: '#3a3a48',
          borderWidth: 1,
          textStyle: { color: '#f5f5f7', fontFamily: 'Geist Variable, system-ui, sans-serif' },
          extraCssText: 'box-shadow: 0 12px 30px -10px rgba(0,0,0,0.6); border-radius: 10px;',
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
      },
      { notMerge: false, lazyUpdate: true },
    );
  };

  const debouncedApply = debounce((d: ReturnType<typeof buildDonutData>) => apply(d), 150);

  onMount(async () => {
    if (!containerRef) return;
    const [core, charts, components, renderers] = await Promise.all([
      import('echarts/core'),
      import('echarts/charts'),
      import('echarts/components'),
      import('echarts/renderers'),
    ]);
    if (disposed || !containerRef) return;
    core.use([charts.PieChart, components.TooltipComponent, renderers.CanvasRenderer]);
    chart = core.init(containerRef, null, { renderer: 'canvas' });
    apply(data());
    ro = new ResizeObserver(() => chart?.resize());
    ro.observe(containerRef);
  });

  onCleanup(() => {
    disposed = true;
    ro?.disconnect();
    chart?.dispose();
    chart = undefined;
  });

  createEffect(() => {
    debouncedApply(data());
  });

  return (
    <div class="relative w-full h-viz">
      <div
        ref={containerRef}
        class="absolute inset-0"
        role="img"
        aria-label={t.calculator.viz.donutAria}
      />
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
        <span class="font-mono text-2xs uppercase tracking-widest text-fg-muted">
          {t.calculator.viz.nodeNet}
        </span>
        <span class="text-2xl font-medium text-fg tabular-nums">
          {formatCHF(data().netto)}
        </span>
        <span class="font-mono text-xs text-fg-muted tabular-nums">
          {formatPercent(data().netPct)}
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   DeductionList — the receipt
   ───────────────────────────────────────────────────────────────────────────── */

const DeductionList: Component<{ result: CalculatorResult; ghost: boolean; frequency: Frequency }> = (props) => {
  const rows = createMemo(() => {
    if (props.ghost) {
      return DEDUCTION_META.map((m) => ({ ...m, value: undefined as number | undefined }));
    }
    return DEDUCTION_META
      .map((m) => ({ ...m, value: props.result[m.key] as number | undefined }))
      .filter((r) => (r.value ?? 0) > 0);
  });

  return (
    <Motion.div class="card overflow-hidden" {...reveal(0.42)}>
      <header class="px-4 sm:px-5 py-3 border-b border-border flex items-baseline justify-between">
        <h3 class="font-mono text-xs uppercase tracking-wider text-fg-muted">
          {t.calculator.receipt.deductionsHeading(props.frequency)}
        </h3>
        <span class="font-mono text-xs text-fg-muted">
          {t.calculator.receipt.totalLabel} ·{' '}
          <span class="text-fg">{props.ghost ? DASH : formatCHF(props.result.total)}</span>
        </span>
      </header>
      <ul>
        <For each={rows()}>
          {(row) => (
            <li class="px-4 sm:px-5 py-3 flex items-center gap-4 border-b border-border last:border-b-0">
              <span
                class="size-2.5 rounded-full shrink-0"
                style={{
                  'background-color': row.color,
                  'box-shadow': `0 0 0 3px ${row.color}22`,
                }}
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm text-fg">{row.label}</p>
                <p class="text-xs text-fg-subtle truncate">{row.explanation}</p>
              </div>
              <span class="font-mono text-sm shrink-0 tabular-nums"
                classList={{ 'text-fg-subtle': props.ghost, 'text-fg': !props.ghost }}
              >
                {row.value === undefined ? DASH : `−${formatCHF(row.value)}`}
              </span>
            </li>
          )}
        </For>
      </ul>
    </Motion.div>
  );
};

export default Calculator;
