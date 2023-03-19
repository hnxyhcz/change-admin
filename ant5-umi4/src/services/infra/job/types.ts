export type JobVO = {
  id: number;
  name: string;
  status: number;
  handlerName: string;
  handlerParam: string;
  cronExpression: string;
  retryCount: number;
  retryInterval: number;
  monitorTimeout: number;
};

export type JobLogVO = {
  id: number;
  jobId: number;
  handlerName: string;
  handlerParam: string;
  cronExpression: string;
  executeIndex: string;
  beginTime: Date;
  endTime: Date;
  duration: string;
  status: number;
  createTime: string;
};

export type JobReqVO = {
  name?: string;
  status?: number;
  handlerName?: string;
};

export type JobLogReqVO = {
  jobId?: number;
  handlerName?: string;
  beginTime?: Date;
  endTime?: Date;
  duration?: string;
  status?: number;
  createTime?: string | string[];
};

export type JobPageVO = JobReqVO & PaginationProps;

export type JobLogPageVO = JobLogReqVO & PaginationProps;
