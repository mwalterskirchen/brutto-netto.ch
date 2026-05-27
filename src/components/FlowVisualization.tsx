import { createSignal, onCleanup, onMount, For, Show, type Component } from 'solid-js';
import { Motion } from 'solid-motionone';
import type { CalculatorResult, Frequency } from '../lib/calculator';
import { reveal } from '../lib/calculator-ui';
import Sankey from './Sankey';
import Donut from './Donut';

interface Props {
  result: CalculatorResult;
  gross: number;
  ghost: boolean;
  frequency: Frequency;
}

const FlowVisualization: Component<Props> = (props) => {
  const [isWide, setIsWide] = createSignal(false);

  onMount(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    setIsWide(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mql.addEventListener('change', handler);
    onCleanup(() => mql.removeEventListener('change', handler));
  });

  return (
    <Motion.div class="card p-4 sm:p-6" {...reveal(0.3)}>
      <Show when={!props.ghost} fallback={<SkeletonViz />}>
        <Show when={isWide()} fallback={<Donut result={props.result} gross={props.gross} />}>
          <Sankey result={props.result} gross={props.gross} />
        </Show>
      </Show>
    </Motion.div>
  );
};

const SkeletonViz: Component = () => {
  const widths = ['100%', '70%', '45%', '30%'];
  return (
    <div class="w-full h-viz flex flex-col justify-center gap-4" aria-hidden="true">
      <For each={widths}>
        {(w) => <div class="h-3 rounded-full bg-surface-elevated" style={{ width: w }} />}
      </For>
    </div>
  );
};

export default FlowVisualization;
