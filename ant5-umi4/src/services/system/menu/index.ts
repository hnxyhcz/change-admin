import { useAxios } from '@/shared/useAxios';
import { MenuView } from './types';

const request = useAxios();

// 查询菜单（精简)列表
export const listSimpleMenus = () => {
  return request.get<Tree[]>(`/system/menu/list-all-simple`);
};

// 查询菜单列表
export const getMenuList = async (params?: MenuView) => {
  return request.get<MenuView[]>(`/system/menu/list`, params);
};

// 获取菜单详情
export const getMenuDetail = async (id: number) => {
  return request.get(`/system/menu/get?id=${id}`);
};

// 新增菜单
export const createMenu = (data: MenuView) => {
  return request.post('/system/menu/create', data);
};

// 修改菜单
export const updateMenu = (data: MenuView) => {
  return request.post('/system/menu/update', data);
};

// 删除菜单
export const deleteMenu = (id: number) => {
  return request.post(`/system/menu/delete?id=${id}`);
};
