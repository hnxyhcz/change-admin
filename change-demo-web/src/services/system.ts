import api, { System } from './api';

/** 系统设置 GET /api/system/setting */
export async function getSystemInfo() {
  return api.get<API.SystemInfo>(System.Setting);
}

/** 角色列表 GET /api/system/role */
export async function loadRoles(query: API.RoleRequest) {
  return api.getWithPagination<API.Role, API.RoleRequest>(System.Role, query);
}

/** 删除角色 DELETE /api/system/role */
export async function deleteRole(roleId: string) {
  return api.delete(`${System.Role}/${roleId}`);
}

/** 新增角色 POST /api/system/role */
export async function saveRole(role: API.Role) {
  return api.post(System.Role, role);
}

/** 修改角色 PATCH /api/system/role */
export async function updateRole(role: API.Role) {
  return api.patch(`${System.Role}/${role.id}`, role);
}

/** 权限列表 GET /api/system/permission */
export async function loadPermissions() {
  return api.get<API.Permission[]>(System.Permission);
}

/** 用户列表 GET /api/system/user */
export async function loadUsers(query?: API.SystemUserRequest) {
  return api.getWithPagination<API.SystemUser, API.SystemUserRequest>(System.User, query);
}

/** 删除用户 DELETE /api/system/user */
export async function deleteUser(userId: string) {
  return api.delete(`${System.User}/${userId}`);
}

/** 新增用户 POST /api/system/user */
export async function saveUser(user: Partial<API.SystemUser>) {
  return api.post(System.User, user);
}

/** 修改用户 PATCH /api/system/user */
export async function updateUser(user: Partial<API.SystemUser>) {
  return api.patch(`${System.User}/${user.id}`, user);
}

/** 查询操作日志 GET /api/system/oplogs */
export async function loadOplogs(query: API.OplogRequest) {
  return api.getWithPagination<API.Oplog, API.OplogRequest>(System.Oplog, query);
}