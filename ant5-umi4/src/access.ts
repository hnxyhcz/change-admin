import { InitialStateProps } from './store';

const ROLE = {
  SUPER_ADMIN: 'super_admin',
};

export default (initialState: InitialStateProps) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://next.umijs.org/docs/max/access

  /**
   * 是否拥有某个角色
   * @param roleCode 角色编码
   * @returns boolean
   */
  const hasRole = (roleCode: string) => {
    if (initialState && initialState.userInfo?.roles) {
      return !!initialState.userInfo.roles.includes(roleCode);
    }

    return false;
  };

  /**
   * 是否拥有权限
   * @param permissions 权限列表
   * @returns boolean
   */
  const hasAnyPermit = (permissions?: string | string[]) => {
    if (!permissions) {
      return true;
    }

    // 超级管理员拥有所有权限
    if (hasRole(ROLE.SUPER_ADMIN)) {
      return true;
    }

    if (initialState && initialState.userInfo?.permissions) {
      if (Array.isArray(permissions)) {
        // 拥有任意一个权限码，则拥有权限
        return initialState.userInfo?.permissions.some((key) => {
          return permissions.includes(key);
        });
      }

      return initialState.userInfo?.permissions.includes(permissions);
    }

    return false;
  };

  return {
    hasRole,
    hasAnyPermit,
    isSuperAdmin: hasRole(ROLE.SUPER_ADMIN),
  };
};
