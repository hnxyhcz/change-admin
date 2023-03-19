export type RoleVO = {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  type: number;
  createTime: string;
  dataScope: string;
  dataScopeDeptIds: string[];
};

export type RoleReqVO = {
  name: string;
  status: number;
} & PaginationProps;
