import axios from 'axios';
import { CaptchaRequest, CaptchaResult } from '../types';

const service = axios.create({
  timeout: 40000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

service.interceptors.response.use((response) => {
  const res = response.data;
  return res;
});

// 获取滑动验证码
export const sliderCaptchaGet = (data: any) => {
  return service.post<CaptchaRequest, CaptchaResult>('/captcha/get', data);
};

// 校验滑动验证码
export async function sliderCaptchaCheck(data: any) {
  return service.post<CaptchaRequest, CaptchaResult>('/captcha/check', data);
}
