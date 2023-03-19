export type LoginLogVO = {
  id: number;
  logType: number;
  traceId: number;
  userType: number;
  username: string;
  status: number;
  userIp: string;
  userAgent: string;
  createTime: string;
  result?: number;
};

export type LoginLogReqVO = {
  username?: string;
  status?: number;
  userIp?: string;
  createTime?: string | string[];
};

export type LoginLogPageReqVO = LoginLogReqVO & PaginationProps;
