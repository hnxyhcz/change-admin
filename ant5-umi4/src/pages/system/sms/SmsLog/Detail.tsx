import {
  DrawerForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { Tag } from 'antd';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import { useDictStore } from '@/shared/useStore';
import { SmsChannelVO } from '@/services/system/sms/smsChannel/types';
import { getSimpleSmsChannels } from '@/services/system/sms/smsChannel';
import { getSmsTemplateApi } from '@/services/system/sms/smsTemplate';
import type { SmsLogVO } from '@/services/system/sms/smsLog/types';

type Props = {
  current: SmsLogVO;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const Detail: React.FC<Props> = observer((props) => {
  const { onClose, current } = props;
  const { getDictItem } = useDictStore();
  const formRef = useRef<ProFormInstance<SmsLogVO>>();

  return (
    <DrawerForm<SmsLogVO>
      open
      width={800}
      formRef={formRef}
      request={async () => {
        const template = await getSmsTemplateApi(current.templateId);
        const tempType = getDictItem(
          DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE,
          current.templateType,
        );
        const sendStatus = getDictItem(
          DICT_TYPE.SYSTEM_SMS_SEND_STATUS,
          current.sendStatus,
        );
        const receiveStatus = getDictItem(
          DICT_TYPE.SYSTEM_SMS_RECEIVE_STATUS,
          current.receiveStatus,
        );
        return {
          ...current,
          templateDesc: (
            <>
              <span>
                {template.id} | {template.code}
              </span>
              {tempType && (
                <Tag
                  color={tempType.colorType}
                  key={tempType.value}
                  style={{ marginLeft: 4 }}
                >
                  {tempType.label}
                </Tag>
              )}
            </>
          ),
          sendStatusTag: sendStatus && (
            <Tag color={sendStatus.colorType} key={sendStatus.value}>
              {sendStatus.label}
            </Tag>
          ),
          receiveStatusTag: receiveStatus && (
            <Tag color={receiveStatus.colorType} key={receiveStatus.value}>
              {receiveStatus.label}
            </Tag>
          ),
        };
      }}
      title={'详情'}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose,
      }}
      layout={'inline'}
      grid
      rowProps={{ gutter: [16, 0] }}
    >
      <ProFormText name="id" label="日志主键" readonly />

      <ProFormSelect
        name="channelId"
        label="短信渠道"
        request={async () => {
          const data = (await getSimpleSmsChannels()) || [];
          return data.map(({ id, code, signature }: SmsChannelVO) => {
            const channel = getDictItem(
              DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE,
              code,
            );
            return { label: `${signature}【${channel.label}】`, value: id };
          });
        }}
        readonly
      />
      <ProFormText name="templateDesc" label="短信模板" readonly />
      <ProFormText name="apiTemplateId" label="API 的模板编码" readonly />
      <ProFormText name="userId" label="用户信息" readonly />
      <ProFormText name="templateContent" label="短信内容" readonly />
      <ProFormDateTimePicker name="createTime" label="创建时间" readonly />
      <ProFormText name="sendStatusTag" label="发送状态" readonly />
      <ProFormDateTimePicker name="sendTime" label="发送时间" readonly />
      <ProFormText name="sendMsg" label="发送结果" readonly />
      <ProFormText name="apiSendMsg" label="API 发送结果" readonly />

      <ProFormText name="apiSerialNo" label="API 短信编号" readonly />
      <ProFormText name="apiRequestId" label="API 请求编号" readonly />
      <ProFormText name="receiveStatusTag" label="接收状态" readonly />
      <ProFormDateTimePicker name="receiveTime" label="接收时间" readonly />
      <ProFormText name="apiReceiveMsg" label="API 接收结果" readonly />
    </DrawerForm>
  );
});
