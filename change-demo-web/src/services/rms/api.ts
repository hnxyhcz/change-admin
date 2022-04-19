export default {
  // 登录
  Login: '/api/public/login',
  // 图形验证码
  GetRandomCode: '/api/public/randomCode',
  // 短信验证码
  MobileCaptcha: '/api/public/captcha',
  // 短信验证码
  Register: '/api/public/register',
  // 当前用户信息
  CurrentUser: '/api/currentUser',
  // 当前用户拥有的菜单权限
  UserMenus: '/api/sys/userMenus',
  // 通知
  Notices: '/api/notices',
  // 用户
  SysUser: '/api/sys/users',
  // 评估
  Estimate: {
    // 最近一次的风险评估
    Recent: '/api/estimate/recent',
    // 历史风险评估记录
    History: '/api/estimate/history',
  },
  QuesNaire: {
    Basic: '/api/question/basic',
    Carotid: '/api/question/carotid'
  },
}