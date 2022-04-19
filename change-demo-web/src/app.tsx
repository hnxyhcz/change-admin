import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser, loadUserMenus } from '@/services/rms/login';
import arrToTree from 'array-to-tree';
import { BookOutlined, DashboardOutlined, FileSearchOutlined, LinkOutlined, SettingOutlined } from '@ant-design/icons';
import { message, notification } from 'antd';
import defaultSettings from '../config/defaultSettings';

const isDev = process.env.NODE_ENV === 'development';

const loginPath = '/user/login';
const sysHomePath = '/welcome';
// 匿名可访问的路由
const anonRouters = [
  sysHomePath, loginPath, '/user/forgot', '/user/register'
]

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

const IconMap = {
  dashboard: <DashboardOutlined />,
  setting: <SettingOutlined />,
  fileSearch: <FileSearchOutlined />
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
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(sysHomePath);
    }
    return undefined;
  };
  // 如果不是可以免登录访问的页面，则不执行
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
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
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
      params: {
        id: initialState?.currentUser?.userId,
        access: initialState?.currentUser?.access,
      },
      request: async (params) => {
        // 只有登录成功
        if (params.id) {
          const menus = await loadUserMenus({ params });
          if (menus?.data?.length === 0) {
            message.error('您没有系统访问权限');
            localStorage.removeItem('Authorization');
            history.push(loginPath);
          } else {
            return arrToTree(
              menus?.data!.map((x: { icon: string; }) => ({
                ...x,
                icon: IconMap[x.icon as string],
              })),
              {
                customID: 'id',
                parentProperty: 'parentId',
              },
            );
          }
        }
        return [];
      },
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
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


const errCodeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限，请重新登录。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 * @param error 错误信息
 */
const errorHandler = (error: any) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = errCodeMessage[response.status] || response.statusText;
    const { status } = response;

    notification.error({
      key: `${status}`,
      message: `请求错误 ${status}`,
      description: errorText,
    });

    if (response.status === 401) {
      history.push(loginPath);
    }
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

function getCookie(cname: string) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return '';
}

/**
 * 
 * @param url Request拦截器
 * @param options 
 * @returns 
 */
const requestInterceptors = (url: string, options: any) => {
  const authorization = localStorage.getItem('Authorization');
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
    Expires: '-1',
    Pragma: 'no-cache',
    Authorization: `Bearer ${authorization}`,
  };
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers },
  };
};

/**
 * Response拦截器
 * @param response 
 * @param options 
 * @returns 
 */
const responseInterceptors = (response: Response, _options: any) => {
  const authorization = response.headers.get('Authorization');
  if (authorization) {
    localStorage.setItem("Authorization", authorization);
  }
  return response;
};

export const request: RequestConfig = {
  // 错误处理器
  errorHandler,
  // Request拦截器
  requestInterceptors: [requestInterceptors],
  // Response拦截器
  responseInterceptors: [responseInterceptors],
};