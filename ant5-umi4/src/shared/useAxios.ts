import { service, config } from './axios';

const { default_headers } = config;

const request = (option: AxiosConfig) => {
  const {
    url,
    method,
    params,
    data,
    headersType,
    responseType,
    onProgress,
    transformRequest,
    onDownloadProgress,
  } = option;
  return service({
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      'Content-Type': headersType || default_headers,
    },
    // FIX: ios钉钉上传文件失败
    // transformRequest: (data) => {
    //   data.toString = () => '[object FormData]';
    //   return data;
    // },
    onUploadProgress(progressEvent) {
      if (onProgress) {
        onProgress(progressEvent);
      }
    },
    transformRequest,
    onDownloadProgress,
  });
};

async function getFn<T = any>(
  option: AxiosConfig | string,
  params?: any,
): Promise<T | undefined> {
  if (typeof option === 'string') {
    option = {
      url: option,
      params,
    };
  }
  const res = await new Promise<{
    data: T | undefined;
  }>((resolve) => {
    request({ method: 'GET', ...(option as AxiosConfig) })
      .then((res) => resolve(res))
      .catch((e) => {
        resolve({
          data: undefined,
        });
      });
  });
  return res?.data;
}

async function postFn<T = any>(
  option: AxiosConfig | string,
  data?: any,
): Promise<T | undefined> {
  if (typeof option === 'string') {
    option = {
      url: option,
      data,
    };
  }

  const res = await new Promise<{
    data: T | undefined;
  }>((resolve) => {
    request({ method: 'POST', ...(option as AxiosConfig) })
      .then((res) => resolve(res))
      .catch((e) => {
        resolve({
          data: undefined,
        });
      });
  });

  return res?.data;
}

export type FetchResult<T> =
  | {
      message: string;
      success: false;
    }
  | {
      data: T;
      success: true;
    };

// 为了兼容我之前的代码
async function postFn2<T = any>(
  option: AxiosConfig | string,
  data?: any,
): Promise<FetchResult<T>> {
  if (typeof option === 'string') {
    option = {
      url: option,
      data,
    };
  }

  const res = await new Promise<FetchResult<T>>((resolve) => {
    request({ method: 'POST', ...(option as AxiosConfig) })
      .then((res) =>
        resolve({
          success: true,
          data: res.data,
        }),
      )
      .catch((e) => {
        resolve({
          success: false,
          message: e,
        });
      });
  });

  return res;
}

async function deleteFn<T = any>(option: AxiosConfig): Promise<T> {
  const res = await request({ method: 'DELETE', ...option });
  return res?.data;
}

async function putFn<T = any>(option: AxiosConfig): Promise<T> {
  const res = await request({ method: 'PUT', ...option });
  return res?.data;
}

async function downloadFn(option: AxiosDownloadConfig) {
  const { onProgress } = option;
  const response = await request({
    method: 'GET',
    responseType: 'blob',
    ...option,
  });
  const contentDisposition = response.headers['content-disposition'] || '';
  const fileName =
    typeof request !== 'string' && option.fileName
      ? option.fileName
      : decodeURI(
          contentDisposition.substring(contentDisposition.indexOf('=') + 1),
        );

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
}

async function downloadBlob<T = any>(option: AxiosConfig): Promise<T> {
  const res = await request({ method: 'GET', responseType: 'blob', ...option });
  return res.data as unknown as Promise<T>;
}

async function uploadFn<T = any>(option: AxiosConfig): Promise<FetchResult<T>> {
  option.headersType = 'multipart/form-data';
  const res = await new Promise<FetchResult<T>>((resolve) => {
    request({
      method: 'POST',
      ...(option as AxiosConfig),
      // transformRequest: (data) => {
      //   data.toString = () => '[object FormData]';
      //   return data;
      // },
    })
      .then((res) =>
        resolve({
          success: true,
          data: res.data,
        }),
      )
      .catch((e) => {
        resolve({
          success: false,
          message: e,
        });
      });
  });

  return res;
}

async function getWithPagination<T, P extends Partial<PaginationProps>>(
  option: AxiosConfig | string,
  params?: P,
): Promise<PaginationResult<T>> {
  if (typeof option === 'string') {
    option = {
      url: option,
      params,
    };
  }
  const { current = 1, pageSize = 15 } = option.params;
  option.params.pageNo = current;
  return getFn(option)?.then((res) => {
    return {
      current,
      pageSize,
      data: res?.list || [],
      total: res?.total || 0,
      success: true,
    };
  });
}

export const useAxios = () => {
  return {
    get: getFn,
    post: postFn,
    post2: postFn2,
    delete: deleteFn,
    put: putFn,
    downloadBlob,
    download: downloadFn,
    upload: uploadFn,
    getPage: getWithPagination,
  };
};
