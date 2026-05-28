import { type Component } from 'solid-js';
import { Motion } from 'solid-motionone';
import type { CalculatorResult, Frequency } from '../lib/calculator';
import { formatCHF, formatPercent } from '../lib/format';
import { t } from '../lib/i18n';
import { DASH, reveal } from '../lib/calculator-ui';
import FlowVisualization from './FlowVisualization';
import DeductionList from './DeductionList';
import Stat from './Stat';

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
      </Motion.header>

      {!props.ghost && (
        <FlowVisualization
          result={props.result}
          gross={props.gross}
          frequency={props.frequency}
        />
      )}

      <DeductionList result={props.result} ghost={props.ghost} frequency={props.frequency} />
    </div>
  );
};

export default FlowAndReceipt;
