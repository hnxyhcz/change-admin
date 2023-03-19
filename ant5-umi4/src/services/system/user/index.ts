import { useAxios } from '@/shared/useAxios';
import type { UserVO, UserReqVO, UserPageReqVO, UserInfo } from './types';

const request = useAxios();

// 查询用户管理列表
export const getUserPageApi = (params: UserPageReqVO) => {
  return request.getPage<UserVO, UserPageReqVO>({
    url: '/system/user/page',
    params,
  });
};

// 查询用户详情
export const getUserApi = (id: number) => {
  return request.get({ url: `/system/user/get?id=${id}` });
};

// 新增用户
export const createUserApi = (data: UserVO) => {
  return request.post({ url: '/system/user/create', data });
};

// 修改用户
export const updateUserApi = (data: UserVO) => {
  return request.post({ url: '/system/user/update', data });
};

// 删除用户
export const deleteUserApi = (id: number) => {
  return request.post({ url: `/system/user/delete?id=${id}` });
};

// 导出用户
export const exportUserApi = (params: UserReqVO) => {
  return request.downloadBlob({ url: '/system/user/export', params });
};

// 下载用户导入模板
export const importUserTemplateApi = () => {
  return request.downloadBlob({ url: '/system/user/get-import-template' });
};

export const uploadUserTemplateApi = (params: any) => {
  return request.upload({ url: '/system/user/import', data: params });
};

// 用户密码重置
export const resetPasswordApi = (id: number, password: string) => {
  const data = { id, password };
  return request.post({ url: '/system/user/update-password', data });
};

// 用户状态修改
export const updateUserStatusApi = (id: number, status: number) => {
  const data = { id, status };
  return request.post({ url: '/system/user/update-status', data });
};

// 获取用户精简信息列表
export const getListSimpleUsersApi = () => {
  return request.get({ url: '/system/user/list-all-simple' });
};

// 获取部门用户信息列表
export const getListUsersByDeptIdApi = (deptId: number) => {
  return request.get<UserInfo[]>(
    `/system/user/list-dept-member?deptId=${deptId}`,
  );
};

// 获取部门用户信息列表
export const getListUsersByIdsApi = (ids: number[]) => {
  return request.get<UserInfo[]>(
    `/system/user/list-member?ids=${ids.join(',')}`,
  );
};
