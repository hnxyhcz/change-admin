import { UploadFile } from 'antd';

export type FileVO = {
  id: number;
  path: string;
  url: string;
  size: string;
  type: string;
  createTime: string;
};

export type FileReqVO = {
  path?: string;
  file: UploadFile;
};

export type FileQuery = {} & PaginationProps;
