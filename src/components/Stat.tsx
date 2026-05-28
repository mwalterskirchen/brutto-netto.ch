import { type Component } from 'solid-js';

interface Props {
  label: string;
  value: string;
}

const Stat: Component<Props> = (props) => (
  <div class="flex flex-col gap-0.5 min-w-0">
    <p class="font-mono text-2xs uppercase tracking-wider text-fg-subtle truncate">{props.label}</p>
    <p class="font-mono text-sm sm:text-base text-fg tabular-nums">{props.value}</p>
  </div>
);

export default Stat;
