import chalk from 'chalk';
import { action, define, observable } from '@formily/reactive';

import { getPermissionApi, logout } from '@/services/auth';
import { getUserProfileApi } from '@/services/system/user/profile';
import type { ProfileVO } from '@/services/system/user/profile/types';

import { UserInfoVO } from '@/services/auth/types';
import { removeToken } from '@/shared/auth';
import { useCache } from '@/shared/useCache';
import { defaultSettings } from 'config/defaultSettings';
import type { SystemSettings } from 'typings';

export type InitialStateProps = InitialStore;

export class InitialStore {
  // 系统配置
  systemInfo?: SystemSettings = defaultSettings;
  // 当前用户信息
  currentUser?: ProfileVO;
  // 用户信息（包含权限和角色）
  userInfo?: UserInfoVO;

  constructor() {
    define(this, {
      systemInfo: observable.ref,
      currentUser: observable.ref,
      userInfo: observable.ref,
      loadSystemInfo: action,
      saveSystemInfo: action,
      loadUserProfile: action,
      logout: action,
    });
    // 初始化系统配置
    this.loadSystemInfo();
  }

  async loadSystemInfo() {
    console.log(
      chalk.green(
        `系统初始化完成，当前版本号 ${chalk.blue.underline.bold('v1.2.2')}`,
      ),
    );
    // TODO 数据库查询配置
    return this.systemInfo;
  }

  async saveSystemInfo(settings: SystemSettings) {
    const systemInfo = { ...this.systemInfo, ...settings };
    // TODO 保存到数据库
    this.systemInfo = systemInfo;
    return this.systemInfo;
  }

  async loadUserProfile() {
    const profile = await getUserProfileApi();
    const userInfo = await getPermissionApi();
    profile!.avatar =
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    this.currentUser = profile;
    this.userInfo = userInfo;
    return this.currentUser;
  }

  async logout() {
    await logout();
    removeToken();
    const { wsCache } = useCache();
    wsCache.clear();
    window.location.href = '/user/login';
  }
}
