import { useAxios } from '@/shared/useAxios';
import type { ErrorCodeReqVO, ErrorCodePageVO, ErrorCodeVO } from './types';

const request = useAxios();

// 查询错误码列表
export const getErrorCodePageApi = (params: ErrorCodePageVO) => {
  return request.getPage<ErrorCodeVO, ErrorCodePageVO>({
    url: '/system/error-code/page',
    params,
  });
};

// 查询错误码详情
export const getErrorCodeApi = (id: number) => {
  return request.get({ url: '/system/error-code/get?id=' + id });
};

// 新增错误码
export const createErrorCodeApi = (data: ErrorCodeVO) => {
  return request.post({ url: '/system/error-code/create', data });
};

// 修改错误码
export const updateErrorCodeApi = (data: ErrorCodeVO) => {
  return request.post({ url: '/system/error-code/update', data });
};

// 删除错误码
export const deleteErrorCodeApi = (id: number) => {
  return request.post({ url: '/system/error-code/delete?id=' + id });
};

// 导出错误码
export const exportErrorCodeApi = (params: ErrorCodeReqVO) => {
  return request.downloadBlob({
    url: '/system/error-code/export-excel',
    params,
  });
};
