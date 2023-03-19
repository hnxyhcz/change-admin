import { defineConfig } from '@umijs/max';
import proxy, { BASE_URL } from './proxy';
import routes from './routes';

const { REACT_APP_ENV = 'dev' } = process.env;

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '卷王',
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  proxy: proxy[REACT_APP_ENV],
  define: {
    'process.env.COPYRIGHT': process.env.COPYRIGHT,
    'process.env.BASE_URL': BASE_URL[REACT_APP_ENV],
  },
  routes,
  npmClient: 'pnpm',
});
