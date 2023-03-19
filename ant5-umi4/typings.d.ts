import '@umijs/max/typings';

import type { ProLayoutProps, Settings } from '@ant-design/pro-components';

declare type SystemSettings = Settings & {
  id?: string;
  title?: string | false;
  logo?: string;
  shortTitle?: string;
  description?: string;
  locale?: ProLayoutProps['locale'];
  backgroundImage?: string;
  registerInfo?: {
    registerEnabled: boolean;
  };
};
