export type SmsLogVO = {
  id: number;
  idchannelId: number;
  templateId: number;
  templateType: number;
  mobile: string;
  sendStatus: number;
  sendTime: string;
  receiveStatus: number;
  createTime: string;
};

export type SmsLogReqVO = {
  idchannelId?: number;
  templateId?: number;
  mobile?: string;
  sendStatus?: number;
  receiveStatus?: number;
  createTime?: string[];
};

export type SmsLogPageVO = SmsLogReqVO & PaginationProps;
