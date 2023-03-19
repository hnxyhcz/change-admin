import { useAxios } from '@/shared/useAxios';
import type { JobLogPageVO, JobLogReqVO, JobLogVO } from './types';

const request = useAxios();

// 任务日志列表
export const getJobLogPageApi = (params: JobLogPageVO) => {
  return request.getPage<JobLogVO, JobLogPageVO>({
    url: '/infra/job-log/page',
    params,
  });
};

// 任务日志详情
export const getJobLogApi = (id: number) => {
  return request.get({ url: '/infra/job-log/get?id=' + id });
};

// 导出定时任务日志
export const exportJobLogApi = (params: JobLogReqVO) => {
  return request.downloadBlob({
    url: '/infra/job-log/export-excel',
    params,
  });
};
