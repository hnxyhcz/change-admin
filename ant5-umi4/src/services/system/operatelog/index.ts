import { useAxios } from '@/shared/useAxios';
import { OperateLogVO, OperateLogReqVO, OperateLogPageReqVO } from './types';

const request = useAxios();

// 查询操作日志列表
export const getOperateLogPageApi = (params: OperateLogPageReqVO) => {
  return request.getPage<OperateLogVO, OperateLogPageReqVO>({
    url: '/system/operate-log/page',
    params,
  });
};

// 导出操作日志
export const exportOperateLogApi = (params: OperateLogReqVO) => {
  return request.downloadBlob({ url: '/system/operate-log/export', params });
};
