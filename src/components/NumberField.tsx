import { Show, type Component } from 'solid-js';

interface Props {
  id: string;
  label: string;
  unit: string;
  placeholder: string;
  value: number | undefined;
  onChange: (n: number | undefined) => void;
  min?: number;
  max?: number;
  required?: boolean;
}

function parseNumber(value: string): number | undefined {
  if (value === '') return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

const NumberField: Component<Props> = (props) => {
  return (
    <div class="flex flex-col gap-1.5">
      <div class="flex items-baseline justify-between">
        <label for={props.id} class="font-mono text-xs uppercase tracking-wider text-fg-muted">
          {props.label}
          <Show when={props.required}>
            <span class="text-accent ml-1" aria-hidden="true">*</span>
            <span class="sr-only"> (Pflichtfeld)</span>
          </Show>
        </label>
        <span class="font-mono text-xs text-fg-subtle">{props.unit}</span>
      </div>
      <input
        id={props.id}
        type="number"
        inputmode="decimal"
        class="control-input"
        placeholder={props.placeholder}
        value={props.value ?? ''}
        min={props.min}
        max={props.max}
        required={props.required}
        aria-required={props.required || undefined}
        onInput={(e) => props.onChange(parseNumber(e.currentTarget.value))}
      />
    </div>
  );
};

export default NumberField;
