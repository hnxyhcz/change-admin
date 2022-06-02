import api, { Current } from './api';

/** 获取当前的用户 GET /api/current/userInfo */
export async function getCurrentUser() {
  return api.get<API.CurrentUser>(Current.User);
}

/** 通知 GET /api/current/notices */
export async function getNotices() {
  return api.get(Current.Notices);
}
