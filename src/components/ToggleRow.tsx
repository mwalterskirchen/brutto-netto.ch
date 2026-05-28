import { Show, type Component } from 'solid-js';

interface Props {
  id: string;
  label: string;
  shortcut?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

const ToggleRow: Component<Props> = (props) => (
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

export default ToggleRow;
