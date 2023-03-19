import { Suspense, useMemo } from 'react';
import Footer from '@/components/Footer';
import { history, useIntl, Link, SelectLang } from '@umijs/max';
import type { RunTimeLayoutConfig } from '@umijs/max';
import {
  MenuDataItem,
  SettingDrawer,
} from '@ant-design/pro-components';

import Loading from '@/components/Loading';
import { IconFont } from '@/components/Icon';
import { DictProWrapper } from '@/components/DictWrapper';
import AppStore, { AppContext, InitialStateProps, InitialStore } from '@/store';
import { getRoutesApi } from '@/services/auth';
import RightContent, { SettingDropdown } from './components/RightContent';
import classNames from 'classnames';
import { defaultSettings } from 'config/defaultSettings';

const loginPath = '/user/login';
// 匿名可访问的路由
const anonRouters = [loginPath, '/user/forgot', '/user/register'];

const loopMenuItem = (menus: any[]): MenuDataItem[] => {
  return menus.map(({ icon, children, ...item }) => ({
    ...item,
    icon: <IconFont type={icon} style={{ fontSize: 16 }} />,
    children: children && loopMenuItem(children),
  }));
};

const customMenu = ({ icon, name, path }: MenuDataItem, menuProps: any) => {
  const { hashId, baseClassName, collapsed, menu } = menuProps;
  return (
    <div
      key={path}
      className={classNames(`${baseClassName}-item-title`, hashId, {
        [`${baseClassName}-item-title-collapsed`]: collapsed,
        [`${baseClassName}-item-collapsed-show-title`]:
          menu.collapsedShowTitle && collapsed,
      })}
    >
      {!!icon && (
        <span className={`anticon ${baseClassName}-item-icon ${hashId}`}>
          {icon}
        </span>
      )}
      <span
        className={classNames(`${baseClassName}-item-text`, hashId, {
          [`${baseClassName}-item-text-has-icon`]: !!icon,
        })}
      >
        {name}
      </span>
    </div>
  );
};

const hex2RGB = (color: string, opacity?: number) => {
  if (!color) {
    return;
  }
  if (color && !color.startsWith('#')) {
    return color;
  }
  let str: any = '0x' + color.substring(1, color.length);
  var r = str & 0x0000ff;
  var g = (str & 0x00ff00) >> 8;
  var b = (str & 0xff0000) >> 16;
  return `rgba(${b}, ${g}, ${r}, ${opacity || 1})`;
};

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<InitialStateProps> {
  const initialState: InitialStateProps = new InitialStore();
  // 非免登录页面加载当前用户信息
  if (!anonRouters.includes(history.location.pathname)) {
    await initialState.loadUserProfile();
  }
  return initialState;
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  const { formatMessage } = useIntl();
  const { systemInfo = defaultSettings, currentUser } = { ...initialState };
  const appStore = useMemo(() => new AppStore(), []);


  return {
    formatMessage,
    disableContentMargin: false,
    logout: initialState?.logout,
    token: {
      sider: {
        colorTextMenuSelected: systemInfo?.colorPrimary,
        colorBgMenuItemSelected: hex2RGB(systemInfo?.colorPrimary!, 0.08),
      },
    },
    menu: {
      locale: false,
      request: async () => {
        const data = (await getRoutesApi()) || [];
        return loopMenuItem(data);
      },
    },
    menuItemRender: (itemProps, defaultDom, menuProps) => {
      const { path, isUrl } = itemProps;
      if (isUrl || !path) {
        return defaultDom;
      }
      // 菜单显示icon
      return <Link to={path}>{customMenu(itemProps, menuProps)}</Link>;
    },
    subMenuItemRender: (itemProps, defaultDom, menuProps) => {
      const { path, isUrl } = itemProps;
      if (isUrl || !path) {
        return defaultDom;
      }
      // 目录显示icon
      return customMenu(itemProps, menuProps);
    },
    // breadcrumbRender: (routers = []) => [
    //   {
    //     path: '/',
    //     breadcrumbName: intl.formatMessage({ id: 'menu.home' }),
    //   },
    //   ...routers,
    // ],
    avatarProps: {
      size: 'small',
      src: currentUser?.avatar,
      title: currentUser?.nickname,
    },
    actionsRender: () => [<SettingDropdown />, <SelectLang />],
    rightContentRender: () => {
      if (!systemInfo?.layout || systemInfo?.layout === 'side') {
        return <></>;
      }
      return <RightContent />;
    },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      if (!currentUser && !anonRouters.includes(window.location.pathname)) {
        // 如果没有登录，重定向到登录页
        history.push(loginPath);
      }
    },
    childrenRender: (children) => {
      return (
        <Suspense fallback={<Loading />}>
          <AppContext.Provider value={appStore}>
            <DictProWrapper>{children}</DictProWrapper>
          </AppContext.Provider>
          {/*  */}
          {!anonRouters.includes(window.location.pathname) && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={systemInfo}
              onSettingChange={(systemInfo) => {
                setInitialState((preState) => {
                  const newState = { ...preState, systemInfo };
                  return newState as InitialStateProps;
                });
              }}
            />
          )}
        </Suspense>
      );
    },
    ...systemInfo,
  };
};
