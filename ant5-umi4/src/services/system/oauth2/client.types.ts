export type OAuth2ClientVO = {
  id: number;
  clientId: string;
  secret: string;
  name: string;
  logo: string;
  description: string;
  status: number;
  accessTokenValiditySeconds: number;
  refreshTokenValiditySeconds: number;
  redirectUris: string[];
  autoApprove: boolean;
  authorizedGrantTypes: string[];
  scopes: string[];
  authorities: string[];
  resourceIds: string[];
  additionalInformation: string;
  isAdditionalInformationJson: boolean;
  createTime: string;
};

export type OAuth2ClientReqVO = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  userType: number;
  clientId: string;
  createTime: string | string[];
};

export type OAuth2ClientPageVO = OAuth2ClientReqVO & PaginationProps;
