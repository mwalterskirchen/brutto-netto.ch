import { Show, type Component, type JSX } from 'solid-js';
import { Motion } from 'solid-motionone';
import type { Frequency } from '../lib/calculator';
import { t } from '../lib/i18n';
import { reveal } from '../lib/calculator-ui';

interface Props {
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

const ControlDeck: Component<Props> = (props) => {
  const isMonthly = () => props.frequency === 'monthly';
  const salaryLabel = () =>
    isMonthly() ? t.calculator.grossSalary.labelMonthly : t.calculator.grossSalary.labelAnnual;

  const onFreqChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
    props.setFrequency(e.currentTarget.value as Frequency);
  };

  return (
    <Motion.div class="flex flex-col gap-5 lg:sticky lg:top-6" {...reveal(0.12)}>
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

function parseNumber(value: string): number | undefined {
  if (value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

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

export default ControlDeck;
