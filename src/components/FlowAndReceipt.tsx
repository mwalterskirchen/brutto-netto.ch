import { Show, type Component } from 'solid-js';
import { Motion } from 'solid-motionone';
import type { CalculatorResult, Frequency } from '../lib/calculator';
import { formatCHF, formatPercent } from '../lib/format';
import { t } from '../lib/i18n';
import {
  medianForFrequency,
  SWISS_MEDIAN_REFERENCE_YEAR,
  SWISS_MEDIAN_SOURCE_URL,
} from '../lib/comparison';
import { DASH, reveal } from '../lib/calculator-ui';
import FlowVisualization from './FlowVisualization';
import DeductionList from './DeductionList';

interface Props {
  result: CalculatorResult;
  ghost: boolean;
  gross: number;
  frequency: Frequency;
}

const FlowAndReceipt: Component<Props> = (props) => {
  const periodSuffix = () => (props.frequency === 'monthly' ? '/Monat' : '/Jahr');

  return (
    <div class="flex flex-col gap-6">
      <Motion.header class="card p-5 sm:p-6 md:p-8 [container-type:inline-size]" {...reveal(0.2)}>
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
            value={props.ghost ? DASH : formatPercent(props.result.totalPct)}
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

const Stat: Component<{ label: string; value: string }> = (props) => (
  <div class="flex flex-col gap-0.5 min-w-0">
    <p class="font-mono text-2xs uppercase tracking-wider text-fg-subtle truncate">{props.label}</p>
    <p class="font-mono text-sm sm:text-base text-fg tabular-nums">{props.value}</p>
  </div>
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

export default FlowAndReceipt;
