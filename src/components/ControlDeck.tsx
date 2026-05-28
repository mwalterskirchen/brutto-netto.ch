import { type Component, type JSX } from 'solid-js';
import { Motion } from 'solid-motionone';
import type { Frequency } from '../lib/calculator';
import { t } from '../lib/i18n';
import { reveal } from '../lib/calculator-ui';
import NumberField from './NumberField';
import ToggleRow from './ToggleRow';

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

      <NumberField
        id="grossSalary"
        label={salaryLabel()}
        unit={t.calculator.grossSalary.unit}
        placeholder={t.calculator.grossSalary.placeholder}
        value={props.gross}
        onChange={props.setGross}
        min={1}
        required
      />

      <NumberField
        id="age"
        label={t.calculator.age.label}
        unit={t.calculator.age.unit}
        placeholder={t.calculator.age.placeholder}
        value={props.age}
        onChange={props.setAge}
        min={18}
        max={70}
        required
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

export default ControlDeck;
