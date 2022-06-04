import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & API.SystemInfo & { pwa?: boolean } = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  pwa: false,
  iconfontUrl: '',
  logo: '/logo.png',
  title: 'Hello World',
  description: '想你所想，不止于功能',
  bacgImage: 'https://image.wjx.com/images/newimg/register-login/bacg.jpg',
};

export default Settings;