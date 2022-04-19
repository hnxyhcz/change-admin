import { request } from 'umi';
import api from './api';

/** 菜单列表 GET /api/sys/menus */
export async function queryMenus(body?: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/menus', {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
}

export async function saveMenu(method: API.Method, body?: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/menus', {
    method,
    data: body,
    ...(options || {}),
  });
}

export async function deleteMenu(body: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/menus', {
    method: 'DELETE',
    params: body,
    ...(options || {}),
  });
}

export async function sortMenus(body: API.SortPrams, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/menus/sortMenu', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function queryPermissions(body?: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/permissions', {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
}

export async function savePermission(method: API.Method, body: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/permissions', {
    method,
    data: body,
    ...(options || {}),
  });
}

export async function deletePermission(body: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/permissions', {
    method: 'DELETE',
    params: body,
    ...(options || {}),
  });
}

export async function sortPermission(body: API.SortPrams, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/permissions/sortPermission', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function queryRoles(body?: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/roles', {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
}

export async function saveRole(method: API.Method, body: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/roles', {
    method,
    data: body,
    ...(options || {}),
  });
}

export async function deleteRole(body: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/roles', {
    method: 'DELETE',
    params: body,
    ...(options || {}),
  });
}

export async function queryAccounts(body: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/accounts', {
    method: 'GET',
    params: body,
    ...(options || {}),
  });
}

export async function saveAccount(method: API.Method, body: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/accounts', {
    method,
    data: body,
    ...(options || {}),
  });
}

export async function deleteAccount(body: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/accounts', {
    method: 'DELETE',
    params: body,
    ...(options || {}),
  });
}

export async function queryOperationLogs(params?: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/operationLogs', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function queryUsersById(userId: string, options?: API.RequestOptions) {
  return request<API.Response>(`${api.SysUser}/${userId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryUsers(params?: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>(api.SysUser, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function saveUser(method: API.Method, data: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>(api.SysUser, {
    method,
    data,
    ...(options || {}),
  });
}

export async function deleteUser(body: API.RequestOptions, options?: API.RequestOptions) {
  return request<API.Response>(api.SysUser, {
    method: 'DELETE',
    params: body,
    ...(options || {}),
  });
}

export async function checkUsername(body: { username: string }, options?: API.RequestOptions) {
  return request<API.Response>('/api/sys/checkUsername', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

