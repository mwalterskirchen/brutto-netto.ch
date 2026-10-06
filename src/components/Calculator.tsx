import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  calculateNetSalary,
  formatCurrency,
  formatPercent,
  type Frequency,
} from '@/lib/calculator';

const TABS: { frequency: Frequency; label: string }[] = [
  { frequency: 'monthly', label: 'Monatlich' },
  { frequency: 'annual', label: 'Jährlich' },
];

const toNumber = (event: ChangeEvent<HTMLInputElement>) => {
  const value = event.currentTarget.valueAsNumber;
  return Number.isNaN(value) ? undefined : value;
};

export default function Calculator() {
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [grossSalary, setGrossSalary] = useState<number | undefined>();
  const [age, setAge] = useState<number | undefined>();
  const [thirteenthSalary, setThirteenthSalary] = useState(false);
  const [ktg, setKtg] = useState(false);

  const result = calculateNetSalary({ frequency, grossSalary, age, thirteenthSalary, ktg });
  const isMonthly = frequency === 'monthly';
  const gross = grossSalary ?? 0;
  const { net, total, totalPercentage } = result;

  // Colours follow the Swiss banknote series; the pay strip and the legend share them.
  const deductions = [
    {
      name: 'AHV/IV/EO',
      description: 'Alters-, Invaliden- und Erwerbsersatz',
      value: result.ahvIvEo,
      color: 'bg-note-100',
    },
    {
      name: 'BVG',
      description: 'Pensionskasse, 2. Säule',
      value: result.bvg,
      color: 'bg-note-1000',
    },
    {
      name: 'ALV',
      description: 'Arbeitslosenversicherung',
      value: result.alv,
      color: 'bg-note-10',
    },
    { name: 'NBU', description: 'Nichtberufsunfall', value: result.nbu, color: 'bg-note-50' },
    { name: 'KTG', description: 'Krankentaggeld', value: result.ktg, color: 'bg-note-200' },
  ];
  const share = (value: number) => (gross ? value / gross : 0);
  const period = isMonthly ? 'pro Monat' : 'pro Jahr';

  return (
    <section
      aria-label="Lohnrechner"
      className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8"
    >
      <form
        className="flex flex-col gap-6 rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow sm:p-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <Tabs value={frequency} onValueChange={(value) => setFrequency(value as Frequency)}>
          <TabsList className="grid h-auto w-full grid-cols-2">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.frequency} value={tab.frequency} className="py-2 text-base">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-2">
          <Label htmlFor="grossSalary" className="text-base">
            {isMonthly ? 'Monatlicher Bruttolohn' : 'Jährlicher Bruttolohn'}
          </Label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r-2 border-border px-3 font-wide font-bold"
            >
              CHF
            </span>
            <Input
              type="number"
              id="grossSalary"
              min="1"
              inputMode="decimal"
              placeholder={isMonthly ? 'z. B. 6500' : 'z. B. 84500'}
              className="h-14 pl-20 font-wide text-2xl font-bold tabular-nums placeholder:font-normal"
              onChange={(e) => setGrossSalary(toNumber(e))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="age" className="text-base">
            Alter
          </Label>
          <Input
            type="number"
            id="age"
            min="18"
            max="65"
            inputMode="numeric"
            placeholder="Alter in Jahren"
            className="h-12 text-base"
            aria-describedby="age-hint"
            onChange={(e) => setAge(toNumber(e))}
          />
          <p id="age-hint" className="text-sm text-foreground/70">
            Ihr Alter bestimmt den Beitragssatz der Pensionskasse.
          </p>
        </div>

        <div className="flex flex-col divide-y-2 divide-border rounded-base border-2 border-border">
          <label className="flex cursor-pointer items-center justify-between gap-4 p-4">
            <span className="font-heading">13. Monatslohn</span>
            <Switch checked={thirteenthSalary} onCheckedChange={setThirteenthSalary} />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 p-4">
            <span className="font-heading">Krankentaggeldversicherung</span>
            <Switch checked={ktg} onCheckedChange={setKtg} />
          </label>
        </div>
      </form>

      <div className="flex flex-col rounded-base border-2 border-border bg-secondary-background shadow-lg">
        <div className="@container border-b-2 border-border bg-main p-5 text-main-foreground sm:p-6">
          <h2 className="text-lg">Nettolohn {period}</h2>
          {/* Only the net amount is announced; the whole card would be read out on every keystroke. */}
          <p
            aria-live="polite"
            aria-atomic="true"
            className="net-salary mt-2 font-wide text-[clamp(1.75rem,9.5cqi,3.75rem)] leading-none font-extrabold whitespace-nowrap tabular-nums"
          >
            {net === undefined ? 'CHF –' : formatCurrency(net)}
          </p>
        </div>

        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <PayStrip gross={gross} net={net} deductions={deductions} />

          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-2 border-border pb-3">
            <h3 className="text-lg">Abzüge {period}</h3>
            <p className="font-wide font-bold tabular-nums">
              {total > 0 ? `${formatCurrency(total)} (${formatPercent(totalPercentage)})` : '–'}
            </p>
          </div>

          <table className="w-full text-left">
            <thead className="sr-only">
              <tr>
                <th scope="col">Abzug</th>
                <th scope="col" className="hidden sm:table-cell">
                  Anteil am Bruttolohn
                </th>
                <th scope="col">Betrag</th>
              </tr>
            </thead>
            <tbody>
              {deductions.map(({ name, description, value, color }) => (
                <tr key={name} className="border-b border-border/20 last:border-0">
                  <th scope="row" className="py-2.5 pr-3 font-normal">
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'size-4 shrink-0 rounded-[3px] border-2 border-border',
                          color,
                        )}
                      />
                      <span>
                        <span className="block font-heading">{name}</span>
                        <span className="block text-sm text-foreground/70">{description}</span>
                      </span>
                    </span>
                  </th>
                  <td className="hidden py-2.5 pr-3 text-right text-sm text-foreground/70 tabular-nums sm:table-cell">
                    {value ? formatPercent(share(value)) : ''}
                  </td>
                  <td className="py-2.5 text-right font-heading whitespace-nowrap tabular-nums">
                    {value ? formatCurrency(value) : '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

interface PayStripProps {
  gross: number;
  net: number | undefined;
  deductions: { name: string; value: number; color: string }[];
}

/** The gross salary as one strip, cut into the net salary and each deduction. */
function PayStrip({ gross, net, deductions }: PayStripProps) {
  if (net === undefined || gross <= 0) {
    return (
      <div className="flex h-16 items-center justify-center rounded-base border-2 border-dashed border-border px-4 text-center text-sm text-foreground/70">
        Geben Sie Ihren Bruttolohn ein, um die Aufteilung zu sehen.
      </div>
    );
  }

  const segments = [
    { name: 'Nettolohn', value: net, color: 'bg-note-20' },
    ...deductions.filter((d) => d.value > 0),
  ];

  return (
    <figure className="flex flex-col gap-2">
      <div
        className="flex h-16 overflow-hidden rounded-base border-2 border-border"
        role="img"
        aria-label={`Bruttolohn ${formatCurrency(gross)}, davon ${formatPercent(net / gross)} Nettolohn`}
      >
        {segments.map(({ name, value, color }, index) => (
          <div
            key={name}
            title={`${name}: ${formatCurrency(value)}`}
            className={cn(
              'flex h-full min-w-1.5 basis-0 items-end border-l-2 border-border transition-[flex-grow] duration-300 ease-out first:border-l-0 motion-reduce:transition-none',
              color,
            )}
            style={{ flexGrow: value }}
          >
            {index === 0 && (
              <span className="truncate p-2 font-wide text-sm font-bold text-white">
                Netto {formatPercent(net / gross)}
              </span>
            )}
          </div>
        ))}
      </div>
      <figcaption className="text-right text-sm text-foreground/70">
        Bruttolohn {formatCurrency(gross)} = 100%
      </figcaption>
    </figure>
  );
}
