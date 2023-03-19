import { useAxios } from '@/shared/useAxios';
import type { ErrorLogPageVO, ErrorLogReqVO, ErrorLogVO } from './types';

const request = useAxios();

// 查询列表API 访问日志
export const getApiErrorLogPageApi = (params: ErrorLogPageVO) => {
  return request.getPage<ErrorLogVO, ErrorLogPageVO>({
    url: '/infra/api-error-log/page',
    params,
  });
};

// 更新 API 错误日志的处理状态
export const updateApiErrorLogPageApi = (id: number, processStatus: number) => {
  return request.put({
    url:
      '/infra/api-error-log/update-status?id=' +
      id +
      '&processStatus=' +
      processStatus,
  });
};

// 导出API 访问日志
export const exportApiErrorLogApi = (params: ErrorLogReqVO) => {
  return request.downloadBlob({
    url: '/infra/api-error-log/export-excel',
    params,
  });
};
