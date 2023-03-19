declare module 'qs';

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

declare type Nullable<T> = T | null;

declare interface Fn<T = any> {
  (...arg: T[]): T;
}

declare namespace Axios {
  type RequestTransformer = import('axios').AxiosRequestTransformer;

  type Headers =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data';

  type Method =
    | 'get'
    | 'post'
    | 'delete'
    | 'put'
    | 'GET'
    | 'POST'
    | 'DELETE'
    | 'PUT';

  type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';
}

declare interface AxiosConfig {
  params?: any;
  data?: any;
  url?: string;
  method?: Axios.Method;
  headersType?: string;
  responseType?: Axios.ResponseType;
  onProgress?: (e: any) => void;
  onDownloadProgress?: (e: any) => void;
  transformRequest?: Axios.RequestTransformer | Axios.RequestTransformer[];
}

declare interface AxiosDownloadConfig extends AxiosConfig {
  fileName?: string;
}

declare interface PaginationProps {
  current: number;
  pageSize: number;
}

declare interface PaginationResult<T> {
  data: T[];
  total: number;
  success: boolean;
  current?: number;
  pageSize?: number;
}

declare interface Tree {
  id: number;
  name: string;
  children?: Tree[] | any[];
}

declare interface ModalProps<T> {
  current?: T;
  visible: boolean;
  readonly?: boolean;
}
