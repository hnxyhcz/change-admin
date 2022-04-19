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
  description: '有人住高楼，有人在深沟，有人光万丈，有人一身绣，世人万千种，浮云莫去求，斯人若彩虹，遇上方知有。你是无力抗拒不停追逐的磁场，你是傍晚落日余晖的方向。你是我不能拥抱的短暂理想。你是旅途，你是故乡。',
  bacgImage: 'https://image.wjx.com/images/newimg/register-login/bacg.jpg',
};

export default Settings;