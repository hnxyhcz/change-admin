import { useAxios } from '@/shared/useAxios';
import { OAuth2TokenPageVO, OAuth2TokenVO } from './token.types';

const request = useAxios();

// 查询 token列表
export const getAccessTokenPageApi = (params: OAuth2TokenPageVO) => {
  return request.getPage<OAuth2TokenVO, OAuth2TokenPageVO>({
    url: '/system/oauth2-token/page',
    params,
  });
};

// 删除 token
export const deleteAccessTokenApi = (accessToken: string) => {
  return request.post({
    url: '/system/oauth2-token/delete?accessToken=' + accessToken,
  });
};
