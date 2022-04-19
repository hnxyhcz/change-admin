import { request } from 'umi';
import api from './api';

/** 登录接口 POST /api/public/login */
export async function login(body: API.LoginParams, options?: API.RequestOptions) {
  return request<API.Response>(api.Login, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 注册接口 POST /api/public/register */
export async function register(body: API.RegisterParams, options?: API.RequestOptions) {
  return request<API.Response>(api.Register, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 短信验证码 POST /api/public/captcha */
export async function mobileCaptcha(
  params: {
    mobile?: string;
  },
  options?: { [key: string]: any },
) {
  return request(api.MobileCaptcha, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

/** 检查验证码服务 POST /api/captcha/check */
export async function checkCaptcha(params: any) {
  return request('/api/captcha/check',{
    method: 'POST',
    data: params,
  });
}

/** 获取滑动验证码 POST /api/captcha/get */
export async function pictureCaptcha(params: any) {
  return request('/api/captcha/get',{
    method: 'POST',
    data: params,
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: API.RequestOptions) {
  return request<{ data: API.CurrentUser }>(api.CurrentUser, {
    method: 'GET',
    ...(options || {}),
  });
}

/** TODO 通知 GET /api/notices */
export async function getNotices(options?: API.RequestOptions) {
  return request<API.NoticeIconList>(api.Notices, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 用户菜单列表 GET /api/sys/userMenus */
export async function loadUserMenus(options?: API.RequestOptions) {
  return request<API.Response>(api.UserMenus, {
    method: 'GET',
    ...(options || {}),
  });
}