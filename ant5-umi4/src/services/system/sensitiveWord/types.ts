export type SensitiveWordVO = {
  id: number;
  name: string;
  status: number;
  description: string;
  tags: string[];
  type: number;
  createTime: string;
};

export type SensitiveWordReqVO = {
  type?: number;
  applicationName?: string;
  code?: number;
  message?: string;
  createTime?: string | string[];
};

export type SensitiveWordPageVO = SensitiveWordReqVO & PaginationProps;
