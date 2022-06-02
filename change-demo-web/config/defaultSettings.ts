import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & API.Setting & {
  pwa?: boolean;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '前端基础脚手架',
  pwa: false,
  logo: '/logo.png',
  iconfontUrl: '',
  // 自定义属性
  subject: '前端基础脚手架',
  description: 'Hello World',
  bacgImage: 'https://image.wjx.com/images/newimg/register-login/bacg.jpg',
};

export default Settings;