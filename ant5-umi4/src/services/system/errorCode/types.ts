export type ErrorCodeVO = {
  id: number;
  type: number;
  applicationName: string;
  code: number;
  message: string;
  memo: string;
  createTime: string;
};

export type ErrorCodeReqVO = {
  type?: number;
  applicationName?: string;
  code?: number;
  message?: string;
  createTime?: string | string[];
};

export type ErrorCodePageVO = ErrorCodeReqVO & PaginationProps;
