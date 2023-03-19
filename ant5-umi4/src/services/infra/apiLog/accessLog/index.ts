import { useAxios } from '@/shared/useAxios';
import type { AccessLogPageVO, AccessLogReqVO, AccessLogVO } from './types';

const request = useAxios();

// 查询列表API 访问日志
export const getApiAccessLogPageApi = (params: AccessLogPageVO) => {
  return request.getPage<AccessLogVO, AccessLogPageVO>({
    url: '/infra/api-access-log/page',
    params,
  });
};

// 导出API 访问日志
export const exportApiAccessLogApi = (params: AccessLogReqVO) => {
  return request.downloadBlob({
    url: '/infra/api-access-log/export-excel',
    params,
  });
};
