import { createMemo, createSignal, type Component, type JSX } from 'solid-js';
import { calculate, type Frequency } from '../lib/calculator';
import { formatCHF, formatPercent } from '../lib/format';

function parseNumber(value: string): number | undefined {
  if (value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

const Toggle: Component<{
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = (props) => (
  <label class="flex items-center justify-between gap-2 cursor-pointer mt-4" for={props.id}>
    <span>{props.label}</span>
    <span class="relative inline-block">
      <input
        id={props.id}
        type="checkbox"
        class="peer sr-only"
        checked={props.checked}
        onChange={(e) => props.onChange(e.currentTarget.checked)}
      />
      <span
        aria-hidden="true"
        class="block w-11 h-6 rounded-full bg-surface-elevated border border-border peer-checked:bg-primary transition-colors"
      />
      <span
        aria-hidden="true"
        class="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-bg shadow transition-transform peer-checked:translate-x-5"
      />
    </span>
  </label>
);

const ResultRow: Component<{ label: string; value: number }> = (props) => (
  <tr class="border-b border-border last:border-b-0">
    <th class="text-left py-1.5 pr-2 font-medium">{props.label}</th>
    <td class="py-1.5 text-right tabular-nums">{props.value === 0 ? '-' : formatCHF(props.value)}</td>
  </tr>
);

const Calculator: Component = () => {
  const [grossSalary, setGrossSalary] = createSignal<number | undefined>(undefined);
  const [age, setAge] = createSignal<number | undefined>(undefined);
  const [ktgEnabled, setKtgEnabled] = createSignal(false);
  const [thirteenthEnabled, setThirteenthEnabled] = createSignal(false);
  const [frequency, setFrequency] = createSignal<Frequency>('monthly');

  const result = createMemo(() =>
    calculate({
      grossSalary: grossSalary(),
      age: age(),
      ktgEnabled: ktgEnabled(),
      thirteenthSalaryEnabled: thirteenthEnabled(),
      frequency: frequency(),
    }),
  );

  const isMonthly = () => frequency() === 'monthly';
  const salaryLabel = () => (isMonthly() ? 'Monatlicher Bruttolohn in CHF' : 'Jährlicher Bruttolohn in CHF');
  const deductionsTitle = () => (isMonthly() ? 'Monatliche Abzüge:' : 'Jährliche Abzüge:');

  const onFreqChange: JSX.EventHandler<HTMLInputElement, Event> = (e) => {
    setFrequency(e.currentTarget.value as Frequency);
  };

  return (
    <section class="max-w-md mx-auto mb-8" aria-label="Lohnrechner">
      <div role="tablist" aria-label="Lohnfrequenz" class="grid grid-cols-2 rounded-lg bg-surface-elevated p-1 mb-4">
        <input
          type="radio"
          id="freq-monthly"
          name="frequency"
          value="monthly"
          class="peer/m sr-only"
          checked={isMonthly()}
          onChange={onFreqChange}
        />
        <label
          for="freq-monthly"
          role="tab"
          aria-selected={isMonthly()}
          class="text-center py-2 rounded-md cursor-pointer transition-colors peer-checked/m:bg-primary peer-checked/m:text-primary-fg peer-focus-visible/m:outline peer-focus-visible/m:outline-2 peer-focus-visible/m:outline-primary"
        >
          Monatlich
        </label>
        <input
          type="radio"
          id="freq-annual"
          name="frequency"
          value="annual"
          class="peer/a sr-only"
          checked={!isMonthly()}
          onChange={onFreqChange}
        />
        <label
          for="freq-annual"
          role="tab"
          aria-selected={!isMonthly()}
          class="text-center py-2 rounded-md cursor-pointer transition-colors peer-checked/a:bg-primary peer-checked/a:text-primary-fg peer-focus-visible/a:outline peer-focus-visible/a:outline-2 peer-focus-visible/a:outline-primary"
        >
          Jährlich
        </label>
      </div>

      <fieldset class="mb-3">
        <label for="grossSalary" class="block mb-1 font-medium">{salaryLabel()}</label>
        <input
          id="grossSalary"
          type="number"
          min="1"
          inputmode="decimal"
          placeholder={isMonthly() ? 'Monatlicher Bruttolohn' : 'Jährlicher Bruttolohn'}
          value={grossSalary() ?? ''}
          onInput={(e) => setGrossSalary(parseNumber(e.currentTarget.value))}
        />
      </fieldset>

      <fieldset class="mb-2">
        <label for="age" class="block mb-1 font-medium">Alter</label>
        <input
          id="age"
          type="number"
          min="18"
          max="65"
          inputmode="numeric"
          placeholder="Alter in Jahren"
          value={age() ?? ''}
          onInput={(e) => setAge(parseNumber(e.currentTarget.value))}
        />
      </fieldset>

      <Toggle
        id="thirteenth"
        label="13. Monatslohn"
        checked={thirteenthEnabled()}
        onChange={setThirteenthEnabled}
      />
      <Toggle
        id="ktg"
        label="Krankentaggeldversicherung"
        checked={ktgEnabled()}
        onChange={setKtgEnabled}
      />

      <div class="mt-4 p-4 bg-surface rounded-lg border border-border">
        <p class="text-2xl font-bold text-center">
          Nettolohn: {formatCHF(result().net)}
        </p>
      </div>

      <div class="mt-4 p-4 bg-surface rounded-lg border border-border">
        <h3 class="text-base font-semibold mb-2">
          {deductionsTitle()}
          {result().total > 0 && (
            <>
              {' '}
              {formatCHF(result().total)} ({formatPercent(result().totalPct)})
            </>
          )}
        </h3>
        <table class="w-full text-sm">
          <tbody>
            <ResultRow label="AHV/IV/EO" value={result().ahvIvEo} />
            <ResultRow label="BVG" value={result().bvg} />
            <ResultRow label="ALV" value={result().alv} />
            <ResultRow label="NBU" value={result().nbu} />
            <ResultRow label="KTG" value={result().ktg} />
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Calculator;
