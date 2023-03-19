import { useAxios } from '@/shared/useAxios';
import { SmsLogVO, SmsLogReqVO, SmsLogPageVO } from './types';

const request = useAxios();

// 查询短信日志列表
export const getSmsLogPageApi = (params: SmsLogPageVO) => {
  return request.getPage<SmsLogVO, SmsLogPageVO>({
    url: '/system/sms-log/page',
    params,
  });
};

// 导出短信日志
export const exportSmsLogApi = (params: SmsLogReqVO) => {
  return request.downloadBlob({ url: '/system/sms-log/export', params });
};
