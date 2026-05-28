import { createMemo, For, type Component } from 'solid-js';
import { Motion } from 'solid-motionone';
import type { CalculatorResult, Frequency } from '../lib/calculator';
import { formatCHF } from '../lib/format';
import { t } from '../lib/i18n';
import { DASH, DEDUCTION_META, reveal } from '../lib/calculator-ui';

interface Props {
  result: CalculatorResult;
  ghost: boolean;
  frequency: Frequency;
}

const DeductionList: Component<Props> = (props) => {
  const rows = createMemo(() => {
    if (props.ghost) {
      return DEDUCTION_META.map((m) => ({ ...m, value: undefined as number | undefined }));
    }
    return DEDUCTION_META.map((m) => ({ ...m, value: props.result[m.key] as number | undefined }))
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
              <span
                class="font-mono text-sm shrink-0 tabular-nums"
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

export default DeductionList;
