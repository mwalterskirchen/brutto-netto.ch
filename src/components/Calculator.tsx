import { createMemo, createSignal, onCleanup, onMount, type Component } from 'solid-js';
import { calculate, type CalculatorResult, type Frequency } from '../lib/calculator';
import ControlDeck from './ControlDeck';
import FlowAndReceipt from './FlowAndReceipt';

const Calculator: Component = () => {
  const [grossInput, setGrossInput] = createSignal<number | undefined>(undefined);
  const [age, setAge] = createSignal<number | undefined>(undefined);
  const [ktgEnabled, setKtgEnabled] = createSignal(false);
  const [thirteenthEnabled, setThirteenthEnabled] = createSignal(false);
  const [frequency, setFrequency] = createSignal<Frequency>('monthly');

  onMount(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const isTextInput =
        target &&
        ((target.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'number') ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (isTextInput) return;
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

  const isGhost = createMemo(() => grossInput() === undefined || age() === undefined);

  const result = createMemo<CalculatorResult>(() =>
    calculate({
      grossSalary: grossInput(),
      age: age(),
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

export default Calculator;
