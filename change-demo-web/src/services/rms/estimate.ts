import { request } from 'umi';
import api from './api';

/** 历史风险评估 GET /api/estimate/history */
export async function historyEstimate(options?: API.RequestOptions) {
  return request<API.Response>(api.Estimate.History, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 最近风险评估 GET /api/estimate/recent */
export async function recentEstimate(options?: API.RequestOptions) {
  return request<API.Response>(api.Estimate.Recent, {
    method: 'GET',
    ...(options || {}),
  });
}
