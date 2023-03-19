/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/admin-api/': {
      target: 'http://localhost:48080/',
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },
    '/api': {
      target: 'http://localhost:48080/admin-api',
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },
    '/captcha/': {
      target: 'http://localhost:48080',
      changeOrigin: true,
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
} as Record<string, any>;

export const BASE_URL = {
  dev: 'http://localhost:48080',
  test: 'http://localhost:48080',
  pre: 'http://localhost:48080',
  prod: 'http://localhost:48080',
};
