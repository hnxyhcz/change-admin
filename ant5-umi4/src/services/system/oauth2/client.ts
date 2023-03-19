import { useAxios } from '@/shared/useAxios';
import { OAuth2ClientPageVO, OAuth2ClientVO } from './client.types';

const request = useAxios();

// 查询 OAuth2列表
export const getOAuth2ClientPageApi = (params: OAuth2ClientPageVO) => {
  return request.getPage<OAuth2ClientVO, OAuth2ClientPageVO>({
    url: '/system/oauth2-client/page',
    params,
  });
};

// 查询 OAuth2详情
export const getOAuth2ClientApi = (id: number) => {
  return request.get({ url: '/system/oauth2-client/get?id=' + id });
};

// 新增 OAuth2
export const createOAuth2ClientApi = (data: OAuth2ClientVO) => {
  return request.post({ url: '/system/oauth2-client/create', data });
};

// 修改 OAuth2
export const updateOAuth2ClientApi = (data: OAuth2ClientVO) => {
  return request.post({ url: '/system/oauth2-client/update', data });
};

// 删除 OAuth2
export const deleteOAuth2ClientApi = (id: number) => {
  return request.post({ url: '/system/oauth2-client/delete?id=' + id });
};
