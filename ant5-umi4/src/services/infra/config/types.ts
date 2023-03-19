export type ConfigVO = {
  id: number;
  group: string;
  name: string;
  key: string;
  value: string;
  type: string;
  visible: boolean;
  remark: string;
  createTime: string;
};

export type ConfigReqVO = {
  group?: string;
  name?: string;
  key?: string;
  type?: string;
  visible?: boolean;
  createTime?: string | string[];
};

export type ConfigPageVO = ConfigReqVO & PaginationProps;
