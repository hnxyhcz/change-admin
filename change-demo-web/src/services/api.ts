import axios from 'axios';
import { history } from 'umi';
import { notification } from 'antd';
import queryString from 'query-string';

import type { AxiosRequestConfig, AxiosResponseHeaders } from 'axios';

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
  504: '您的网络发生异常，无法连接服务器。',
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

    return {
      code: status,
      success: false,
      message: errorText,
    };
  }

  if (!response) {
    notification.error({
      key: '504',
      message: '网络异常',
      description: '您的网络发生异常，无法连接服务器',
    });
    return {
      code: 504,
      success: false,
      message: '您的网络发生异常，无法连接服务器',
    };
  }

  throw error;
};

/** request拦截器 */
axios.interceptors.request.use(config => {
  const authorization = localStorage.getItem('Authorization');

  config.headers = {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
    Authorization: authorization ? `Bearer ${authorization}` : '',
    Expires: '-1',
    Pragma: 'no-cache',
  };
  config.withCredentials = true

  return config
})

/**
 * Response转换器器
 * @param response
 * @param headers
 * @returns
 */
const transformResponse = (response: any, headers?: AxiosResponseHeaders) => {
  const { authorization } = headers || {};
  if (authorization) {
    localStorage.setItem('Authorization', authorization);
  }

  const resp = JSON.parse(response);
  resp.success = resp.code === 200;
  if (resp.code === 401) {
    history.push(`/user/login`);
  }
  if (resp.code === 500) {
    // message.error('操作失败')
  }
  return resp;
};

async function fetchJson<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<API.FetchResult<T>> {
  return axios({
    url,
    method,
    data,
    params: method === 'GET' ? data : undefined,
    paramsSerializer: (params) => {
      return queryString.stringify(params, { skipNull: true, skipEmptyString: true });
    },
    transformResponse: [transformResponse],
    ...config,
  })
  .then((resp) => resp.data).catch(errorHandler);
}

export default {
  async put<T>(url: any, body: any) {
    return await fetchJson<T>('PUT', url, body);
  },

  async delete<T>(url: any) {
    return await fetchJson<T>('DELETE', url);
  },

  async post<T>(url: any, body?: any, config?: AxiosRequestConfig) {
    return await fetchJson<T>('POST', url, body, config);
  },

  async patch<T = undefined>(url: any, body?: any) {
    return await fetchJson<T>('PATCH', url, body);
  },

  async get<T>(url: any, params?: any): Promise<T | undefined> {
    return await fetchJson<T>('GET', url, params).then((res) => {
      if (res.code === 200) {
        return res.data;
      }
      return;
    });
  },

  async upload<T>(
    url: string,
    body: any,
    onProgress?: (e: any) => void,
  ): Promise<API.FetchResult<T>> {
    const data = new FormData();
    Object.keys(body).forEach((name) => {
      if (body[name]) {
        data.append(name, body[name]);
      }
    });

    return fetchJson('POST', url, data, {
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          onProgress(progressEvent);
        }
      },
    });
  },

  async download(
    request: string | AxiosRequestConfig,
    onProgress?: (status: number | 'done' | 'fail') => void,
  ) {
    const newRequest = typeof request === 'string' ? { url: request } : request;
    axios({
      method: 'GET',
      responseType: 'blob', // important
      onDownloadProgress: (progressEvent) => {
        if (onProgress) {
          onProgress(progressEvent.loaded);
        }
      },
      ...newRequest,
    }).then((response) => {
      const contentDisposition = response.headers['content-disposition'];
      if (!contentDisposition) {
        if (onProgress) {
          onProgress('fail');
        }
        return;
      }
      const fileName = decodeURI(contentDisposition.substring(contentDisposition.indexOf('=') + 1));

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName); //or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onProgress) {
        onProgress('done');
      }
    });
  },

  async getWithPagination<T, P extends Partial<API.PaginationProps>>(url: any, pagination?: P) {
    const { current = 1, pageSize = 50 } = pagination || {};
    return this.get<API.PaginationResult<T>>(url, pagination).then((res) => {
      return {
        current,
        pageSize,
        data: [],
        total: 0,
        ...(res || {}),
      };
    });
  },
};

/** API接口 */
// 登录
export const Login = '/api/public/login';
// 登出
export const Logout = '/api/public/logout';
// 图形验证码
export const GetRandomCode = '/api/public/randomCode';
// 短信验证码
export const MobileCaptcha = '/api/public/captcha';
// 用户名是否存在
export const CheckUsernameExist = '/api/public/checkUsername';
// 滑块验证码
export const SliderCaptcha = {
  get: '/api/captcha/get',
  check: '/api/captcha/check'
};
// 注册用户
export const Register = '/api/public/register';
// 当前用户
export const Current = {
  // 用户信息
  User: '/api/current/user',
  // 通知
  Notices: '/api/current/notices',
};
// 系统设置
export const System = {
  // 用户列表
  User: '/api/system/user',
  Role: '/api/system/role',
  Permission: '/api/system/permission',
  Oplog: '/api/system/oplogs',
  Setting: '/api/system/setting'
};