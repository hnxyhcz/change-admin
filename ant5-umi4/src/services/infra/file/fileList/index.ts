import { useAxios } from '@/shared/useAxios';
import { FileQuery, FileReqVO, FileVO } from './types';

const request = useAxios();

// 查询文件列表
export const getFilePageApi = (params: FileQuery) => {
  return request.getPage<FileVO, FileQuery>({
    url: '/infra/file/page',
    params,
  });
};

// 删除文件
export const deleteFileApi = (id: number) => {
  return request.post({ url: '/infra/file/delete?id=' + id });
};

export const uploadFileApi = (data: FileReqVO) => {
  return request.upload<{
    code: number;
  }>({
    url: `/infra/file/upload`,
    data,
  });
};
