// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Method = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE'

  type CurrentUser = {
    name?: string;
    avatar?: string;
    userId: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RequestOptions = {
    [key: string]: any
  }

  type Response = {
    /** 业务约定的状态码 */
    code: number;
    /** 业务上的数据 */
    data: any;
    /** 业务上的信息 */
    message: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    captcha?: string;
  };

  type RegisterParams = {
    name?: string;
    username?: string;
    password?: string;
    idCard?: string;
    mobile?: string;
    captcha?: string;
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

  type Setting = {
    logo?: string;
    subject?: string;
    description?: string;
    bacgImage?: string;
  }

  type TreeNode = {
    id: string;
    name: string;
    parentId: string;
  }

  type SortPrams = {
    dragKey: string;
    dropKey: string;
    dropPosition: number;
  };

  type Permission = {
    id?: string;
    parentId?: string;
    code?: string;
    /** 权限名称 */
    name?: string;
    permissionType?: number;
    sequence?: number;
    permissionLevel?: number;
  };

  type Menu = {
    helpCode?: string;
    hideInBreadcrumb?: number;
    hideInMenu?: number;
    icon?: string;
    id?: string;
    deleted?: number;
    menuLevel?: number;
    name?: string;
    parentId?: string;
    path?: string;
    permissionId?: string;
    sequence?: number;
    children?: MenuItem[];
  };

  type SortPrams = {
    dragKey: string;
    dropKey: string;
    dropPosition: number;
  };

  type Role = {
    id?: string;
    name?: string;
    permissionIds?: string[];
  };

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

  type User = {
    id: string;
    name?: string;
    username?: string;
    email?: string;
    remark?: string;
    mobile?: string;
    idCard?: string;
    gender?: number;
    roleIds?: string[];
    status: number;
  };

  type OperationLog = {};

}
