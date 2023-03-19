import React from 'react';
import * as echarts from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
// 引入 Canvas 渲染器，或者 SVGRenderer
import { CanvasRenderer } from 'echarts/renderers';
import {
  // 组件
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { LabelLayout } from 'echarts/features';

// 系列类型，后缀都为SeriesOption
import type { GaugeSeriesOption } from 'echarts/charts';
// 组件类型，后缀都为ComponentOption
import type {
  TitleComponentOption,
  TooltipComponentOption,
  ToolboxComponentOption,
  LegendComponentOption,
  GridComponentOption,
} from 'echarts/components';
import type { ChartProps } from './types';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type GaugeOption = echarts.ComposeOption<
  | GaugeSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | ToolboxComponentOption
  | LegendComponentOption
  | GridComponentOption
>;

// 注册必须的组件
echarts.use([
  GaugeChart,
  LabelLayout,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
]);

export default (props: ChartProps<GaugeOption>) => {
  const { option, theme, initOpts, setOption } = props;
  const chartRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chartRef.current) {
      // 基于准备好的dom，初始化echarts实例
      const chartInstance = echarts.init(chartRef.current, theme, initOpts);
      chartInstance.setOption(option, setOption);
      window.onresize = () => {
        chartInstance.resize();
      };
    }
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: initOpts?.width || undefined,
        height: initOpts?.height || undefined,
      }}
    />
  );
};
