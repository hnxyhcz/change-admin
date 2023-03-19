export type OAuth2TokenVO = {
  id: number;
  accessToken: string;
  refreshToken: string;
  userId: number;
  userType: number;
  clientId: string;
  createTime: string;
  expiresTime: string;
};

export type OAuth2TokenReqVO = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  userType: number;
  clientId: string;
  createTime: string | string[];
};

export type OAuth2TokenPageVO = OAuth2TokenReqVO & PaginationProps;
