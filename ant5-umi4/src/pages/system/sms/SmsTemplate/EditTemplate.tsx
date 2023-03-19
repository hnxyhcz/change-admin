import { observer } from '@formily/reactive-react';
import {
  DrawerForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import { useDictStore } from '@/shared/useStore';
import { ProFormDict } from '@/components/DictWrapper';
import { getSimpleSmsChannels } from '@/services/system/sms/smsChannel';
import {
  createSmsTemplateApi,
  updateSmsTemplateApi,
} from '@/services/system/sms/smsTemplate';
import type { SmsTemplateVO } from '@/services/system/sms/smsTemplate/types';
import type { SmsChannelVO } from '@/services/system/sms/smsChannel/types';

type Props = {
  current?: SmsTemplateVO;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const EditTemplate: React.FC<Props> = observer((props) => {
  const { onOk, onClose, current } = props;
  const { getDictItem } = useDictStore();
  const formRef = useRef<ProFormInstance<SmsTemplateVO>>();

  return (
    <DrawerForm<SmsTemplateVO>
      open
      width={800}
      formRef={formRef}
      initialValues={{ status: 0, ...current }}
      title={current?.id ? '修改短信模板' : '新增短信模板'}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose,
      }}
      grid
      rowProps={{ gutter: [16, 0] }}
      onFinish={async (values: SmsTemplateVO) => {
        let resp;
        if (current?.id) {
          resp = await updateSmsTemplateApi({ ...current, ...values });
        } else {
          resp = await createSmsTemplateApi(values);
        }
        if (resp) {
          message.success(current?.id ? '修改成功' : '新增成功');
          onOk();
        }
      }}
    >
      <ProFormSelect
        name="channelId"
        label="短信渠道"
        placeholder="请选择短信渠道"
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
        rules={[{ required: true, message: '短信渠道不能为空' }]}
      />

      <ProFormDict
        name="type"
        label="短信类型"
        placeholder="请选择短信类型"
        dictCode={DICT_TYPE.SYSTEM_SMS_TEMPLATE_TYPE}
        type="number"
        rules={[{ required: true, message: '短信类型不能为空' }]}
      />

      <ProFormText
        name="code"
        label="模板编码"
        placeholder="请输入模板编码"
        rules={[{ required: true, message: '模板编码不能为空' }]}
      />

      <ProFormText
        name="name"
        label="模板名称"
        placeholder="请输入模板名称"
        rules={[{ required: true, message: '模板名称不能为空' }]}
      />

      <ProFormTextArea
        name="content"
        label="模板内容"
        placeholder="请输入模板内容"
        rules={[{ required: true, message: '模板内容不能为空' }]}
      />

      <ProFormDict
        name="status"
        label="状态"
        placeholder="请选择状态"
        dictCode={DICT_TYPE.COMMON_STATUS}
        type="number"
        rules={[{ required: true, message: '状态不能为空' }]}
      />

      <ProFormText
        name="apiTemplateId"
        label="短信 API 的模板编号"
        placeholder="请输入短信 API 的模板编号"
        rules={[{ required: true, message: '短信 API 的模板编号不能为空' }]}
      />

      <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />
    </DrawerForm>
  );
});
