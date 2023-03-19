export type AccessLogVO = {
  id: number;
  traceId: string;
  userId: string;
  userType: string;
  userIp: string;
  userAgent: string;
  applicationName: string;
  requestMethod: string;
  requestParams: string;
  requestUrl: string;
  beginTime: string;
  endTime: string;
  duration: string;
  resultCode: number;
};

export type AccessLogReqVO = {
  userId?: string;
  userType?: string;
  applicationName?: string;
  requestUrl?: string;
  beginTime?: string | string[];
  resultCode?: number;
};

export type AccessLogPageVO = AccessLogReqVO & PaginationProps;
