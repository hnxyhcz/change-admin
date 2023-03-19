export type ErrorLogVO = {
  id: number;
  userId: string;
  userIp: string;
  userAgent: string;
  userType: string;
  applicationName: string;
  requestMethod: string;
  requestParams: string;
  requestUrl: string;
  exceptionTime: string;
  exceptionName: string;
  exceptionStackTrace: string;
  processUserId: string;
  processStatus: number;
  resultCode: number;
};

export type ErrorLogReqVO = {
  userId?: string;
  userType?: string;
  applicationName?: string;
  requestUrl?: string;
  exceptionTime?: string | string[];
  processStatus?: number;
};

export type ErrorLogPageVO = ErrorLogReqVO & PaginationProps;
