import type { SetOptionOpts } from 'echarts';

/** 类型：echarts/types/dist/shared */
type EChartsInitOpts = {
  locale?: string | LocaleOption;
  renderer?: RendererType;
  devicePixelRatio?: number;
  useDirtyRect?: boolean;
  ssr?: boolean;
  width?: number;
  height?: number;
};

export type ChartProps<T> = {
  option: T;
  theme?: Object | string;
  initOpts?: EChartsInitOpts;
  setOption?: SetOptionOpts;
};
