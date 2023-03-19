export type PostVO = {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  remark: string;
  createTime: string;
};

export type PostReqVO = {
  code: string;
  name: string;
  status: number;
};

export type PostPageReqVO = PostReqVO & PaginationProps;
