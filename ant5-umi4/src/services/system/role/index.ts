import { useAxios } from '@/shared/useAxios';
import type { RoleVO, RoleReqVO } from './types';

const request = useAxios();

// 查询角色列表
export const getRolePageApi = async (params?: RoleReqVO) => {
  return await request.getPage<RoleVO, RoleReqVO>({
    url: '/system/role/page',
    params,
  });
};

// 查询角色（精简)列表
export const listSimpleRolesApi = async () => {
  return await request.get({ url: '/system/role/list-all-simple' });
};

// 查询角色详情
export const getRoleApi = async (id: number) => {
  return await request.get({ url: '/system/role/get?id=' + id });
};

// 新增角色
export const createRoleApi = async (data: RoleVO) => {
  return await request.post({ url: '/system/role/create', data });
};

// 修改角色
export const updateRoleApi = async (data: RoleVO) => {
  return await request.post({ url: '/system/role/update', data });
};

// 修改角色状态
export const updateRoleStatusApi = async (data: RoleVO) => {
  return await request.post({ url: '/system/role/update-status', data });
};

// 删除角色
export const deleteRoleApi = async (id: number) => {
  return await request.post({ url: '/system/role/delete?id=' + id });
};
