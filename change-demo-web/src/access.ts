import { MenuDataItem } from "@ant-design/pro-layout/lib/typings";

const hasRoute = (route: MenuDataItem, authorityList: string[] = []) => {
  return authorityList.includes(route.authority);
};

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    isAdmin: currentUser?.authorityList?.includes('ROLE_ADMIN'),
    routeFilter: (route: MenuDataItem) => hasRoute(route, currentUser?.authorityList),
  };
}
