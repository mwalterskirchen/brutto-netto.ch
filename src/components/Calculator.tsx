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
import { debounce } from '@solid-primitives/scheduled';
import * as echarts from 'echarts/core';
import { SankeyChart, BarChart } from 'echarts/charts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { calculate, type CalculatorResult, type Frequency } from '../lib/calculator';
import { formatCHF, formatPercent } from '../lib/format';
import { t } from '../lib/i18n';
import {
  medianForFrequency,
  SWISS_MEDIAN_REFERENCE_YEAR,
  SWISS_MEDIAN_SOURCE_URL,
} from '../lib/comparison';
import { buildShareUrl, decodeInputs } from '../lib/share';

echarts.use([SankeyChart, BarChart, TooltipComponent, GridComponent, CanvasRenderer]);

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

const GHOST_GROSS = 100000; // CHF/year for empty-state ghost preview

const Calculator: Component = () => {
  const [grossInput, setGrossInput] = createSignal<number | undefined>(undefined);
  const [age, setAge] = createSignal<number | undefined>(undefined);
  const [ktgEnabled, setKtgEnabled] = createSignal(false);
  const [thirteenthEnabled, setThirteenthEnabled] = createSignal(false);
  const [frequency, setFrequency] = createSignal<Frequency>('monthly');

  // Hydrate from URL hash on first render — pure client-side, no network.
  onMount(() => {
    if (!window.location.hash) return;
    const hydrated = decodeInputs(window.location.hash);
    if (!hydrated) return;
    if (hydrated.gross !== undefined) setGrossInput(hydrated.gross);
    if (hydrated.age !== undefined) setAge(hydrated.age);
    if (hydrated.frequency) setFrequency(hydrated.frequency);
    if (hydrated.thirteenth) setThirteenthEnabled(true);
    if (hydrated.ktg) setKtgEnabled(true);
  });

  const isGhost = createMemo(() => grossInput() === undefined);

  // For ghost mode we feed the calc a sensible default so the viz is populated.
  const effectiveGross = createMemo(() => {
    if (grossInput() !== undefined) return grossInput()!;
    return frequency() === 'monthly' ? GHOST_GROSS / 12 : GHOST_GROSS;
  });

  const result = createMemo<CalculatorResult>(() =>
    calculate({
      grossSalary: effectiveGross(),
      age: age() ?? 35,
      ktgEnabled: ktgEnabled(),
      thirteenthSalaryEnabled: thirteenthEnabled(),
      frequency: frequency(),
    }),
  );

  const displayGross = createMemo(() => effectiveGross());

  return (
    <section
      class="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-12 lg:items-start"
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
        gross={displayGross()}
        frequency={frequency()}
        shareInputs={{
          gross: grossInput(),
          age: age(),
          frequency: frequency(),
          thirteenth: thirteenthEnabled(),
          ktg: ktgEnabled(),
        }}
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
    <div class="flex flex-col gap-5 lg:sticky lg:top-6">
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
        <label for="freq-monthly" role="tab" aria-selected={isMonthly()}>
          {t.calculator.frequency.monthly}
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
        <label for="freq-annual" role="tab" aria-selected={!isMonthly()}>
          {t.calculator.frequency.annual}
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
          checked={props.thirteenth}
          onChange={props.setThirteenth}
        />
        <div class="border-t border-border" />
        <ToggleRow
          id="ktg"
          label={t.calculator.toggles.ktg}
          checked={props.ktg}
          onChange={props.setKtg}
        />
      </div>
    </div>
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
      <div class="control-field">
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
        <span class="local-tag" aria-hidden="true">{t.privacy.localTag}</span>
      </div>
    </div>
  );
};

const ShareButton: Component<{ inputs: import('../lib/share').ShareableInputs }> = (props) => {
  const [copied, setCopied] = createSignal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => timer && clearTimeout(timer));

  const onClick = async () => {
    const url = buildShareUrl(props.inputs);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard refused (e.g. insecure context) — still reflect URL in the hash for manual copy.
    }
    if (typeof history !== 'undefined') {
      history.replaceState(null, '', url);
    }
    setCopied(true);
    timer = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t.share.aria}
      class="inline-flex items-center gap-1.5 px-3 h-7 rounded-pill border border-border bg-surface-elevated hover:border-border-strong text-fg-muted hover:text-fg font-mono text-xs transition-colors"
    >
      <Show
        when={copied()}
        fallback={
          <>
            <ShareIcon />
            <span>{t.share.cta}</span>
          </>
        }
      >
        <CheckIcon />
        <span>{t.share.copied}</span>
      </Show>
    </button>
  );
};

const ShareIcon: Component = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M10 4 6 4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8M14 2H8m6 0v6m0-6L8 8"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const CheckIcon: Component = () => (
  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 8.5 6.5 12 13 4"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

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
  checked: boolean;
  onChange: (v: boolean) => void;
}> = (props) => (
  <label class="flex items-center justify-between gap-3 cursor-pointer text-sm" for={props.id}>
    <span class="text-fg">{props.label}</span>
    <span class="relative inline-block shrink-0">
      <input
        id={props.id}
        type="checkbox"
        class="peer sr-only"
        checked={props.checked}
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
  shareInputs: import('../lib/share').ShareableInputs;
}> = (props) => {
  const periodSuffix = () => (props.frequency === 'monthly' ? '/Monat' : '/Jahr');
  const totalPct = () => props.result.totalPct;

  return (
    <div class="flex flex-col gap-6">
      <header
        class="card p-6 sm:p-8 transition-opacity"
        classList={{ 'opacity-60': props.ghost }}
      >
        <Show when={props.ghost}>
          <p class="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-3">
            {t.calculator.receipt.ghostHint}
          </p>
        </Show>
        <div class="flex flex-col gap-1.5">
          <p class="font-mono text-xs uppercase tracking-widest text-fg-muted">
            {t.calculator.receipt.netHeading}
            <span class="text-fg-subtle"> {periodSuffix()}</span>
          </p>
          <p class="font-mono text-4xl sm:text-5xl lg:text-6xl text-fg leading-none tracking-tight">
            {formatCHF(props.result.net ?? 0)}
          </p>
        </div>
        <div class="mt-5 pt-5 border-t border-border grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label={`${t.calculator.receipt.grossHeading} ${periodSuffix()}`} value={formatCHF(props.gross)} />
          <Stat label={t.calculator.receipt.totalLabel} value={`−${formatCHF(props.result.total)}`} />
          <Stat label={t.calculator.receipt.ofGross} value={formatPercent(totalPct())} />
        </div>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <ComparisonLine frequency={props.frequency} />
          <Show when={!props.ghost}>
            <ShareButton inputs={props.shareInputs} />
          </Show>
        </div>
      </header>

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
   FlowVisualization — Sankey (desktop) / Waterfall (mobile)
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
    <div
      class="card p-4 sm:p-6 transition-opacity"
      classList={{ 'opacity-50': props.ghost }}
    >
      <Show when={isWide()} fallback={<Waterfall result={props.result} gross={props.gross} />}>
        <Sankey result={props.result} gross={props.gross} />
      </Show>
    </div>
  );
};

/* Build sankey nodes + links from result */
function buildSankeyData(result: CalculatorResult, gross: number) {
  const netto = Math.max(0, result.net ?? gross - result.total);
  const nodes: { name: string; itemStyle: { color: string; borderColor: string }; label?: any }[] = [
    {
      name: t.calculator.viz.nodeGross,
      itemStyle: { color: COLORS.brutto, borderColor: COLORS.brutto },
    },
    {
      name: t.calculator.viz.nodeNet,
      itemStyle: { color: COLORS.netto, borderColor: COLORS.netto },
    },
  ];
  const links: any[] = [
    {
      source: t.calculator.viz.nodeGross,
      target: t.calculator.viz.nodeNet,
      value: netto,
      lineStyle: { color: COLORS.netto, opacity: 0.5 },
    },
  ];
  for (const meta of DEDUCTION_META) {
    const v = result[meta.key];
    if (v <= 0) continue;
    nodes.push({
      name: meta.label,
      itemStyle: { color: meta.color, borderColor: meta.color },
    });
    links.push({
      source: t.calculator.viz.nodeGross,
      target: meta.label,
      value: v,
      lineStyle: { color: meta.color, opacity: 0.45 },
    });
  }
  return { nodes, links, gross };
}

const Sankey: Component<{ result: CalculatorResult; gross: number }> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  let chart: echarts.ECharts | undefined;

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
              formatter: (p: any) => p.name,
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

  onMount(() => {
    if (!containerRef) return;
    chart = echarts.init(containerRef, null, { renderer: 'canvas' });
    apply(buildSankeyData(props.result, props.gross));
    const ro = new ResizeObserver(() => chart?.resize());
    ro.observe(containerRef);
    onCleanup(() => {
      ro.disconnect();
      chart?.dispose();
      chart = undefined;
    });
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

function sankeyTooltip(params: any, gross: number): string {
  // Node hover (data has .name and no .source/target distinction we care about)
  if (params.dataType === 'node') {
    const meta = DEDUCTION_META.find((d) => d.label === params.name);
    if (meta) {
      return `
        <div style="display:flex;flex-direction:column;gap:6px;min-width:220px;font-family:Geist Variable,system-ui;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:8px;height:8px;border-radius:99px;background:${meta.color};box-shadow:0 0 0 3px ${meta.color}22"></span>
            <strong style="font-weight:600">${meta.label}</strong>
          </div>
          <div style="color:#8a8a94;font-size:12px;line-height:1.4;">${meta.explanation}</div>
        </div>`;
    }
    return `<strong>${params.name}</strong>`;
  }
  // Edge hover
  if (params.dataType === 'edge') {
    const value = params.value as number;
    const pct = gross > 0 ? value / gross : 0;
    const meta = DEDUCTION_META.find((d) => d.label === params.data.target);
    const color = meta?.color ?? COLORS.netto;
    const title = meta?.label ?? params.data.target;
    const expl = meta?.explanation ?? '';
    return `
      <div style="display:flex;flex-direction:column;gap:6px;min-width:220px;font-family:Geist Variable,system-ui;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="width:8px;height:8px;border-radius:99px;background:${color};box-shadow:0 0 0 3px ${color}22"></span>
          <strong style="font-weight:600">${title}</strong>
        </div>
        <div style="font-family:Geist Mono Variable,ui-monospace;font-size:13px;color:#f5f5f7;">
          ${formatCHF(value)} · ${formatPercent(pct)}
        </div>
        ${expl ? `<div style="color:#8a8a94;font-size:12px;line-height:1.4;">${expl}</div>` : ''}
      </div>`;
  }
  return '';
}

/* Waterfall (mobile): pure CSS bars — simpler, robust, no ECharts trick needed. */
const Waterfall: Component<{ result: CalculatorResult; gross: number }> = (props) => {
  const segments = createMemo(() => {
    const items = DEDUCTION_META.map((m) => ({
      key: m.key,
      color: m.color,
      label: m.label,
      value: props.result[m.key],
      explanation: m.explanation,
    })).filter((s) => s.value > 0);
    const netto = Math.max(0, props.result.net ?? props.gross - props.result.total);
    return { items, netto };
  });

  return (
    <div
      class="flex flex-col gap-3"
      role="img"
      aria-label={t.calculator.viz.waterfallAria}
    >
      {/* Brutto baseline */}
      <div class="flex items-center justify-between font-mono text-xs uppercase tracking-wider">
        <span class="text-fg-muted">{t.calculator.viz.nodeGross}</span>
        <span class="text-fg">{formatCHF(props.gross)}</span>
      </div>
      <div class="h-2 rounded-full bg-fg" />
      <For each={segments().items}>
        {(s) => (
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between font-mono text-xs">
              <span class="flex items-center gap-2 text-fg-muted">
                <span class="size-1.5 rounded-full" style={{ 'background-color': s.color }} />
                {s.label}
              </span>
              <span class="text-fg">−{formatCHF(s.value)}</span>
            </div>
            <div class="h-2 rounded-full bg-surface-elevated overflow-hidden">
              <div
                class="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${Math.min(100, props.gross > 0 ? (s.value / props.gross) * 100 : 0)}%`,
                  'background-color': s.color,
                }}
              />
            </div>
          </div>
        )}
      </For>
      {/* Netto outcome */}
      <div class="mt-2 flex items-center justify-between font-mono text-xs uppercase tracking-wider">
        <span class="text-fg">{t.calculator.viz.nodeNet}</span>
        <span class="text-fg">{formatCHF(segments().netto)}</span>
      </div>
      <div
        class="h-3 rounded-full bg-fg transition-[width] duration-300"
        style={{
          width: `${Math.min(100, props.gross > 0 ? (segments().netto / props.gross) * 100 : 0)}%`,
        }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   DeductionList — the receipt
   ───────────────────────────────────────────────────────────────────────────── */

const DeductionList: Component<{ result: CalculatorResult; ghost: boolean; frequency: Frequency }> = (props) => {
  const rows = createMemo(() =>
    DEDUCTION_META.map((m) => ({
      ...m,
      value: props.result[m.key],
      pct: props.result.total > 0 ? props.result[m.key] / (props.result.total + (props.result.net ?? 0)) : 0,
    })).filter((r) => r.value > 0),
  );

  return (
    <div class="card overflow-hidden">
      <header class="px-5 py-3 border-b border-border flex items-baseline justify-between">
        <h3 class="font-mono text-xs uppercase tracking-wider text-fg-muted">
          {t.calculator.receipt.deductionsHeading(props.frequency)}
        </h3>
        <span class="font-mono text-xs text-fg-muted">
          {t.calculator.receipt.totalLabel} ·{' '}
          <span class="text-fg">{formatCHF(props.result.total)}</span>
        </span>
      </header>
      <ul>
        <For
          each={rows()}
          fallback={
            <li class="px-5 py-4 text-sm text-fg-subtle font-mono">
              {t.calculator.receipt.ghostHint}
            </li>
          }
        >
          {(row) => (
            <li class="px-5 py-3 flex items-center gap-4 border-b border-border last:border-b-0">
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
              <span class="font-mono text-sm text-fg shrink-0 tabular-nums">
                −{formatCHF(row.value)}
              </span>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default Calculator;
