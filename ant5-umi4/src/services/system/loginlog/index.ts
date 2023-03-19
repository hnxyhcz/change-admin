import { useAxios } from '@/shared/useAxios';
import { LoginLogVO, LoginLogReqVO, LoginLogPageReqVO } from './types';

const request = useAxios();

// 查询登录日志列表
export const getLoginLogPageApi = (params: LoginLogPageReqVO) => {
  return request.getPage<LoginLogVO, LoginLogPageReqVO>({
    url: '/system/login-log/page',
    params,
  });
};

// 导出登录日志
export const exportLoginLogApi = (params: LoginLogReqVO) => {
  return request.downloadBlob({ url: '/system/login-log/export', params });
};
