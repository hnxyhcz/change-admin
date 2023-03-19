import { useAxios } from '@/shared/useAxios';
import { ProfileVO } from './types';

const request = useAxios();

// 查询用户个人信息
export const getUserProfileApi = () => {
  return request.get<ProfileVO>({ url: '/system/user/profile/get' });
};

// 修改用户个人信息
export const updateUserProfileApi = (data: ProfileVO) => {
  return request.post2({ url: '/system/user/profile/update', data });
};

// 用户密码重置
export const updateUserPwdApi = (oldPassword: string, newPassword: string) => {
  return request.post2({
    url: '/system/user/profile/update-password',
    data: {
      oldPassword: oldPassword,
      newPassword: newPassword,
    },
  });
};

// 用户头像上传
export const uploadAvatarApi = (data: AxiosConfig) => {
  return request.upload({ url: '/system/user/profile/update-avatar', ...data });
};
