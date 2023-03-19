export type SmsTemplateVO = {
  id: number;
  type: number;
  status: number;
  code: string;
  name: string;
  content: string;
  remark: string;
  apiTemplateId: string;
  channelId: number;
  channelCode: string;
  createTime: string;
};

export type SmsSendVO = {
  mobile: string;
  templateCode: string;
  templateParams: string;
};

export type SmsTemplateReqVO = {
  type?: number;
  status?: number;
  code?: string;
  apiTemplateId?: string;
  channelId?: number;
  createTime?: string[];
};

export type SmsTemplatePageVO = SmsTemplateVO & PaginationProps;
