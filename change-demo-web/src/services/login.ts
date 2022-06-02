import api, { Login, Logout, Register, MobileCaptcha, SliderCaptcha, CheckUsernameExist } from './api';

/** 登录接口 POST /api/public/login */
export async function login(data: API.LoginRequest) {
  return api.post<API.CurrentUser>(Login, data);
}

/** 退出登录接口 POST /api/public/logout */
export async function logout() {
  return api.post(Logout)
}

/** 注册接口 POST /api/public/register */
export async function register(data: API.RegisterRequest) {
  return api.post(Register, data);
}

/** 短信验证码 GET /api/public/captcha */
export async function mobileCaptcha(data: { mobile: string }) {
  return api.get(MobileCaptcha, data);
}

/** 获取滑动验证码 POST /api/captcha/get */
export async function sliderCaptcha<T>(data: any) {
  return api.post<API.SliderCaptchaModel>(SliderCaptcha.get, data);
}

/** 检查验证码服务 POST /api/captcha/check */
export async function checkSliderCaptcha(data: any) {
  return api.post<API.SliderCaptchaModel>(SliderCaptcha.check, data);
}

/** 校验用户名是否存在 GET /api/public/checkUsername */
export async function checkUsernameExist(username: string) {
  return api.get(CheckUsernameExist, { username });
}