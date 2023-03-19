import {
  DrawerForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { message } from 'antd';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { ProFormDict } from '@/components/DictWrapper';
import { DICT_TYPE } from '@/store/DictStore';
import {
  createSmsChannelApi,
  updateSmsChannelApi,
} from '@/services/system/sms/smsChannel';
import type { SmsChannelVO } from '@/services/system/sms/smsChannel/types';

type Props = {
  current?: SmsChannelVO;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const EditChannel: React.FC<Props> = observer((props) => {
  const { onOk, onClose, current } = props;
  const formRef = useRef<ProFormInstance<SmsChannelVO>>();

  return (
    <DrawerForm<SmsChannelVO>
      open
      width={800}
      formRef={formRef}
      initialValues={{ status: 0, ...current }}
      title={current?.id ? '修改短信渠道' : '新增短信渠道'}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose,
      }}
      grid
      rowProps={{ gutter: [16, 0] }}
      onFinish={async (values: SmsChannelVO) => {
        let resp;
        if (current?.id) {
          resp = await updateSmsChannelApi({ ...current, ...values });
        } else {
          resp = await createSmsChannelApi(values);
        }
        if (resp) {
          message.success(current?.id ? '修改成功' : '新增成功');
          onOk();
        }
      }}
    >
      <ProFormText
        name="signature"
        label="短信签名"
        placeholder="请输入短信签名"
        rules={[{ required: true, message: '短信签名不能为空' }]}
      />

      <ProFormDict
        name="code"
        label="渠道编码"
        placeholder="请选择渠道编码"
        dictCode={DICT_TYPE.SYSTEM_SMS_CHANNEL_CODE}
        rules={[{ required: true, message: '请选择菜单状态' }]}
      />

      <ProFormDict
        name="status"
        label="状态"
        placeholder="请选择状态"
        dictCode={DICT_TYPE.COMMON_STATUS}
        type="number"
        rules={[{ required: true, message: '状态不能为空' }]}
      />

      <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />

      <ProFormText
        name="apiKey"
        label="短信 API 的账号"
        placeholder="请输入短信 API 的账号"
        rules={[{ required: true, message: '短信 API 的账号不能为空' }]}
      />

      <ProFormText
        name="apiSecret"
        label="短信 API 的秘钥"
        placeholder="请输入短信 API 的秘钥"
      />

      <ProFormText
        name="callbackUrl"
        label="短信发送回调 URL"
        placeholder="请输入短信发送回调 URL"
      />
    </DrawerForm>
  );
});
