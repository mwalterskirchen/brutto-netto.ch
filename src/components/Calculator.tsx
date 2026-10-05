import { useComputed, useSignal } from '@preact/signals';
import type { TargetedEvent } from 'preact';
import { calculateNetSalary, formatCurrency, formatPercent, type Frequency } from '../lib/calculator';

const TABS: { frequency: Frequency; label: string }[] = [
  { frequency: 'monthly', label: 'Monatlich' },
  { frequency: 'annual', label: 'Jährlich' },
];

const toNumber = (event: TargetedEvent<HTMLInputElement>) => {
  const value = event.currentTarget.valueAsNumber;
  return Number.isNaN(value) ? undefined : value;
};

const formatDeduction = (value: number) => (value === 0 ? '-' : formatCurrency(value));

export default function Calculator() {
  const frequency = useSignal<Frequency>('monthly');
  const grossSalary = useSignal<number | undefined>(undefined);
  const age = useSignal<number | undefined>(undefined);
  const thirteenthSalary = useSignal(false);
  const ktg = useSignal(false);

  const result = useComputed(() =>
    calculateNetSalary({
      frequency: frequency.value,
      grossSalary: grossSalary.value,
      age: age.value,
      thirteenthSalary: thirteenthSalary.value,
      ktg: ktg.value,
    }),
  );

  const isMonthly = frequency.value === 'monthly';
  const { net, total, totalPercentage } = result.value;
  const deductions: [string, number][] = [
    ['AHV/IV/EO', result.value.ahvIvEo],
    ['BVG', result.value.bvg],
    ['ALV', result.value.alv],
    ['NBU', result.value.nbu],
    ['KTG', result.value.ktg],
  ];

  return (
    <section class="max-w-md mx-auto mb-8" aria-label="Lohnrechner">
      <div class="max-w-md mx-auto">
        <div role="tablist" class="tabs tabs-box mb-4">
          {TABS.map((tab) => (
            <button
              type="button"
              role="tab"
              aria-selected={frequency.value === tab.frequency}
              class={`tab flex-1 ${frequency.value === tab.frequency ? 'tab-active' : ''}`}
              onClick={() => (frequency.value = tab.frequency)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <fieldset class="fieldset">
          <label for="grossSalary">
            {isMonthly ? 'Monatlicher Bruttolohn in CHF' : 'Jährlicher Bruttolohn in CHF'}
          </label>
          <input
            type="number"
            id="grossSalary"
            class="input input-bordered w-full"
            min="1"
            placeholder={isMonthly ? 'Monatlicher Bruttolohn' : 'Jährlicher Bruttolohn'}
            onInput={(e) => (grossSalary.value = toNumber(e))}
          />
        </fieldset>
        <fieldset class="fieldset">
          <label for="age">Alter</label>
          <input
            type="number"
            id="age"
            placeholder="Alter in Jahren"
            min="18"
            max="65"
            class="input input-bordered w-full"
            onInput={(e) => (age.value = toNumber(e))}
          />
        </fieldset>
        <div class="form-control mt-4">
          <label class="label cursor-pointer flex items-center gap-2 w-full justify-between">
            <span class="label-text">13. Monatslohn</span>
            <input
              type="checkbox"
              class="toggle"
              checked={thirteenthSalary}
              onChange={(e) => (thirteenthSalary.value = e.currentTarget.checked)}
            />
          </label>
        </div>
        <div class="form-control mt-4">
          <label class="label cursor-pointer flex items-center gap-2 w-full justify-between">
            <span class="label-text">Krankentaggeldversicherung</span>
            <input
              type="checkbox"
              class="toggle"
              checked={ktg}
              onChange={(e) => (ktg.value = e.currentTarget.checked)}
            />
          </label>
        </div>
      </div>
      <div class="mt-4 p-4 bg-base-200 rounded-lg">
        <p class="net-salary text-2xl font-bold text-center">
          Nettolohn: {net === undefined ? '' : formatCurrency(net)}
        </p>
      </div>
      <div class="mt-4 p-4 bg-base-200 rounded-lg">
        <h3 class="text-base font-semibold mb-2">
          {isMonthly ? 'Monatliche Abzüge:' : 'Jährliche Abzüge:'}
          {total > 0 && ` ${formatCurrency(total)} (${formatPercent(totalPercentage)})`}
        </h3>
        <table class="table table-zebra text-sm">
          <tbody>
            {deductions.map(([name, value]) => (
              <tr>
                <th class="flex items-center gap-1">{name}</th>
                <td>{formatDeduction(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
