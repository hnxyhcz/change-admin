
export interface TreeNodeItem {
  value: string;
  title?: string;
  label?: string;
  key?: string;
  parentId?: string | undefined;
}

export interface MenuItem {
  createTime?: string;
  createUser?: string;
  helpCode?: string;
  hideInBreadcrumb?: number;
  hideInMenu?: number;
  icon?: string;
  id?: string;
  isRemove?: number;
  menuLevel?: number;
  name?: string;
  parentId?: string;
  path?: string;
  permissionId?: string;
  sequence?: number;
  updateTime?: string;
  updateUser?: string;
  children?: MenuItem[];
}

export interface PermissionItem {
  code?: string;
  createTime?: string;
  createUser?: string;
  helpCode?: string;
  id?: string;
  isDelete?: number;
  isMenu?: number;
  name?: string;
  parentId?: string;
  permissionLevel?: number;
  remark?: string;
  sequence?: number;
  updateTime?: string;
  updateUser?: string;
  children?: PermissionItem[];
}