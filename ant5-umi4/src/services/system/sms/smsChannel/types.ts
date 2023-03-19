export type SmsChannelVO = {
  id: number;
  status: number;
  signature: string;
  code: string;
  remark: string;
  apiKey: string;
  apiSecret: string;
  callbackUrl: string;
  createTime: string;
};

export type SmsChannelReqVO = {
  status?: number;
  signature?: string;
  createTime?: string[];
};

export type SmsChannelPageVO = SmsChannelReqVO & PaginationProps;
