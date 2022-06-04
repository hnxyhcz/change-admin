declare namespace API {

  type Response = {
    /** 业务约定的状态码 */
    code: number;
    /** 业务上的数据 */
    data: any;
    /** 业务上的信息 */
    message?: string;
    /** 请求状态 */
    success?: boolean;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type PaginationResult<T> = {
    data: T[];
    total: number;
    current?: number;
    pageSize?: number;
  };

  type PaginationProps = {
    current: number;
    pageSize: number;
    total?: number;
  };

  type FetchResult<T> =
    | {
        message: string;
        code: 401 | 500 | 504;
        success: false;
        data?: T
      }
    | {
        code: 200;
        data: T;
        success: true;
      };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type SystemInfo = {
    id?: string;
    logo?: string;
    title?: string;
    description?: string;
    bacgImage?: string;
    version?: string;
  };

  type SliderCaptchaModel = {
    repCode: string;
    repMsg: string;
    repData: any;
  }

  type LoginRequest = {
    username?: string;
    password?: string;
    captcha?: string;
  };

  type RegisterRequest = {};

  type CurrentUser = {
    name?: string;
    userId: string;
    avatar?: string;
    email?: string;
    phone?: string;
    title?: string;
    group?: string;
    notifyCount?: number;
    unreadCount?: number;

    deptId?: string;
    deptName?: string;
    profile?: string;
    /** 用户的权限列表 */
    authorityList?: string[];
  };

  /** 系统设置 */
  type Role = {
    id: string;
    name: string;
    code: string;
    authorities: string[];
  };

  type RoleRequest = {
    ids?: string[];
    name?: string;
  } & Partial<PaginationProps>;

  type Permission = {
    /** 权限码 */
    code: string;
    /** 权限名称 */
    name: string;
  };

  type SystemUser = {
    id: string;
    password?: string;
    name: string;
    avatar?: string;
    username: string;
    phone?: string;
    email?: string;
    status: 0 | 1;
    roles?: Role[];
  };

  type SystemUserRequest = {
    name?: string;
  } & Partial<PaginationProps>;

  type Account = {
    id: string;
    loginName: string;
    password: string;
    userId: string;
    name: string;
    status: number;
    roleIds: string[];
    roleNames?: string[];
  };

  type Oplog = {
    
  };

  type OplogRequest = {} & Partial<PaginationProps>;
}
