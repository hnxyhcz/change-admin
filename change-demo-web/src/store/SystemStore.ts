import { deleteRole, deleteUser, loadOplogs, loadPermissions, loadRoles, loadUsers, saveRole, saveUser, updateRole, updateUser } from '@/services/system';
import { action, define, observable } from '@formily/reactive';


export default class SystemStore {
  loading: boolean = false;
  roles: API.Role[] = [];
  users: API.SystemUser[] = [];
  permissions: API.Permission[] = [];
  oplogs: API.Oplog[] = [];

  constructor() {
    this.makeObservable();
  }

  makeObservable() {
    define(this, {
      roles: observable.ref,
      users: observable.ref,
      permissions: observable.ref,
      loading: observable.ref,
      loadRoles: action,
      deleteRole: action,
      upsertRole: action,
      loadPermissions: action,
      loadUsers: action,
      deleteUser: action,
      upsertUser: action,
      loadOplogs: action,
    });
  }

  async loadRoles(query: API.RoleRequest) {
    this.loading = true;
    const result = await loadRoles(query);
    if (result) {
      this.roles = result.data || [];
    }
    this.loading = false;
    return result;
  }

  async deleteRole(id: string) {
    return deleteRole(id);
  }

  async upsertRole(role: API.Role) {
    if (role.id) {
      return updateRole(role);
    } else {
      return await saveRole(role);
    }
  }

  async loadPermissions() {
    const permissions = await loadPermissions();
    if (permissions) {
      this.permissions = permissions;
    }
  }

  async loadUsers(query?: API.SystemUserRequest) {
    this.loading = true;
    const result = await loadUsers(query);
    if (result) {
      this.users = result.data || [];
    }
    this.loading = false;
    return result;
  }

  async deleteUser(id: string) {
    return deleteUser(id);
  }

  async upsertUser(user: Partial<API.SystemUser>) {
    if (user.id) {
      return updateUser(user);
    } else {
      return await saveUser(user);
    }
  }

  async loadOplogs(query: API.OplogRequest) {
    this.loading = true;
    const result = await loadOplogs(query);
    if (result) {
      this.oplogs = result.data || [];
    }
    this.loading = false;
    return result;
  }
}