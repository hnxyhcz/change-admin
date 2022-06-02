import type { MenuDataItem, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {
  BookOutlined,
  DashboardOutlined,
  FileSearchOutlined,
  LinkOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import { getCurrentUser } from './services/user';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/es/date-picker/style/index';
moment.locale('zh-cn');

const isDev = process.env.NODE_ENV === 'development';

const loginPath = '/user/login';
const sysHomePath = '/welcome';

// 匿名可访问的路由
const anonRouters = [sysHomePath, loginPath, '/user/forgot', '/user/register'];

// 菜单栏底部的文档菜单
const docsLink = [
  <Link to="/umi/plugin/openapi" target="_blank">
    <LinkOutlined />
    <span>OpenAPI 文档</span>
  </Link>,
  <Link to="/~docs">
    <BookOutlined />
    <span>业务组件文档</span>
  </Link>,
];

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/** 按需加载图标 */
const IconMap = {
  dashboard: <DashboardOutlined />,
  setting: <SettingOutlined />,
  fileSearch: <FileSearchOutlined />,
};

/** 设置拥有权限的菜单 */
const getOwnMenuData = (menuData: MenuDataItem[], authorityList: string[]): MenuDataItem[] => {
  debugger
  const ownMenuData = menuData.filter((item) =>
    authorityList?.find((x) => x.startsWith(item.authority)),
  );
  return ownMenuData.map((item) => ({
    ...item,
    icon: IconMap[item.icon as string],
    children: item.children ? getOwnMenuData(item.children, authorityList) : undefined,
  }));
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings & API.Setting>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await getCurrentUser();
    } catch (error) {
      history.push(sysHomePath);
    }
    return undefined;
  };
  // 非免登录访问的页面
  if (!anonRouters.includes(history.location.pathname)) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && !anonRouters.includes(location.pathname)) {
        history.push(sysHomePath);
      }
    },
    menu: {
      locale: false,
      // 只要 params 改变就会执行 request 获取数据
      // params: {
      //   userId: initialState?.currentUser?.userId,
      //   authorityList: initialState?.currentUser?.authorityList,
      // },
      // request: async (params, defaultMenuData) => {
      //   const authorityList = params.authorityList || [];
      //   return getOwnMenuData(defaultMenuData, authorityList);
      // },
    },
    links: isDev ? docsLink : [],
    menuHeaderRender: undefined,
    childrenRender: (children, props) => {
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
    logo: initialState?.settings?.logo || false,
  };
};
