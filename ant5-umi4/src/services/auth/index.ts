import { useAxios } from '@/shared/useAxios';
import type { MenuDataItem } from '@ant-design/pro-components';
import type { UserLoginVO, SmsCodeVO, SmsLoginVO } from './types';

const request = useAxios();

// 登录
export const login = (data: UserLoginVO) => {
  return request.post({ url: '/system/auth/login', data });
};

// 登出
export const logout = () => {
  return request.post({ url: '/system/auth/logout' });
};

// 获取用户权限信息
export const getPermissionApi = () => {
  return request.get({ url: '/system/auth/get-permission-info' });
};

// 路由
export const getRoutesApi = async () => {
  return request.get<MenuDataItem[]>(`/system/auth/list-menus`);
};

//获取登录验证码
export const sendSmsCodeApi = (data: SmsCodeVO) => {
  return request.post({ url: '/system/auth/send-sms-code', data });
};

// 短信验证码登录
export const smsLoginApi = (data: SmsLoginVO) => {
  return request.post({ url: '/system/auth/sms-login', data });
};

// 社交授权的跳转
export const socialAuthRedirectApi = (type: string, redirectUri: string) => {
  return request.get({
    url:
      '/system/auth/social-auth-redirect?type=' +
      type +
      '&redirectUri=' +
      redirectUri,
  });
};
