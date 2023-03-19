export type UserVO = {
  id: number;
  username: string;
  nickname: string;
  deptId: number;
  postIds: string[];
  email: string;
  mobile: string;
  sex: number;
  avatar: string;
  loginIp: string;
  status: number;
  remark: string;
  loginDate: string;
  createTime: string;
  dept: {
    id: number;
    name: string;
  };
};

export type UserReqVO = {
  username: string;
  deptId?: number;
  mobile: string;
  status: number;
};

/**
 * 用户信息，常用于下拉等
 */
export type UserInfo = {
  id: number;
  nickname: string;
  deptId: number;
  postIds: string[];
  email: string;
  mobile: string;
  avatar: string;
  status: number;
};

export type UserPageReqVO = UserReqVO & PaginationProps;
