import { request } from 'umi';
import api from './api';
import { BasicAnswer, CarotidAnswer } from '@/pages/quesnaire/data';

/** 保存常规问卷接口 POST /api/public/question/basic */
export async function saveBasicUqs(body: BasicAnswer, options?: API.RequestOptions) {
  return request<API.Response>(api.QuesNaire.Basic, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 保存颈动脉超声问卷接口 POST /api/public/question/carotid */
export async function saveCarotidUqs(body: CarotidAnswer, options?: API.RequestOptions) {
  return request<API.Response>(api.QuesNaire.Carotid, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 根据id获取常规问卷 GET /api/public/question/basic/{basicId} */
export async function basicUqsById(basicId: string, options?: API.RequestOptions) {
  return request<API.Response>(`${api.QuesNaire.Basic}/${basicId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 根据id获取颈动脉超声问卷 GET /api/public/question/carotid/{basicId} */
export async function carotidUqsById(carotidId: string, options?: API.RequestOptions) {
  return request<API.Response>(`${api.QuesNaire.Carotid}/${carotidId}`, {
    method: 'GET',
    ...(options || {}),
  });
}