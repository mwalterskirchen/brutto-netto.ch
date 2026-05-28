import { createEffect, onCleanup, onMount, type Component } from 'solid-js';
import { debounce } from '@solid-primitives/scheduled';
import type { ECharts } from 'echarts/core';

export type ChartKind = 'sankey' | 'pie';

interface Props {
  modules: ChartKind[];
  option: Record<string, any>;
  class?: string;
  ariaLabel?: string;
  debounceMs?: number;
}

const EChart: Component<Props> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  let chart: ECharts | undefined;
  let ro: ResizeObserver | undefined;
  let disposed = false;

  const apply = (option: Record<string, any>) => {
    chart?.setOption(option, { notMerge: false, lazyUpdate: true });
  };

  const debouncedApply = debounce(
    (option: Record<string, any>) => apply(option),
    props.debounceMs ?? 150,
  );

  onMount(async () => {
    if (!containerRef) return;
    const [core, charts, components, renderers] = await Promise.all([
      import('echarts/core'),
      import('echarts/charts'),
      import('echarts/components'),
      import('echarts/renderers'),
    ]);
    if (disposed || !containerRef) return;

    const moduleMap: Record<ChartKind, any> = {
      sankey: charts.SankeyChart,
      pie: charts.PieChart,
    };
    core.use([
      ...props.modules.map((m) => moduleMap[m]),
      components.TooltipComponent,
      renderers.CanvasRenderer,
    ]);

    chart = core.init(containerRef, null, { renderer: 'canvas' });
    apply(props.option);
    ro = new ResizeObserver(() => chart?.resize());
    ro.observe(containerRef);
  });

  createEffect(() => {
    if (!chart) return;
    debouncedApply(props.option);
  });

  onCleanup(() => {
    disposed = true;
    ro?.disconnect();
    chart?.dispose();
    chart = undefined;
  });

  return (
    <div ref={containerRef} class={props.class} role="img" aria-label={props.ariaLabel} />
  );
};

export default EChart;
