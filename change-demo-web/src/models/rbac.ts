import { queryMenus, queryPermissions, queryRoles, queryUsers } from '@/services/rms/rbac';
import { useRequest } from 'umi';

export default () => {

  const { loading: menuLoading, data: menus, run: loadMenus } = useRequest(() => queryMenus(), {
    manual: true,
    // formatResult: resp => resp,
  });

  const { loading: perissionLoading, data: permissions, run: loadPermissions } = useRequest(() => queryPermissions(), {
    manual: true
  });

  const { loading: roleLoading, data: roles, run: loadRoles } = useRequest(() => queryRoles(), {
    manual: true
  });

  const { loading: userLoading, data: users, run: loadUsers } = useRequest((params?: API.RequestOptions) => queryUsers(params), {
    manual: true
  });

  return {
    menus,
    roles,
    users,
    permissions,

    loadMenus,
    loadRoles,
    loadUsers,
    loadPermissions,
    loading: menuLoading || perissionLoading || roleLoading || userLoading,
  }
}