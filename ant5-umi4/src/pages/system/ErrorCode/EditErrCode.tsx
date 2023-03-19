import {
  DrawerForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { message } from 'antd';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import {
  createErrorCodeApi,
  updateErrorCodeApi,
} from '@/services/system/errorCode';
import type { ErrorCodeVO } from '@/services/system/errorCode/types';

type Props = {
  current?: ErrorCodeVO;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const EditErrCode: React.FC<Props> = observer((props) => {
  const { onOk, onClose, current } = props;
  const formRef = useRef<ProFormInstance<ErrorCodeVO>>();

  return (
    <DrawerForm<ErrorCodeVO>
      open
      width={800}
      formRef={formRef}
      initialValues={current}
      title={current?.id ? '修改错误码' : '新增错误码'}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose,
      }}
      grid
      rowProps={{ gutter: [16, 0] }}
      onFinish={async (values) => {
        let resp;
        if (current?.id) {
          resp = await updateErrorCodeApi({ ...current, ...values });
        } else {
          resp = await createErrorCodeApi(values);
        }
        if (resp) {
          message.success(current?.id ? '修改成功' : '新增成功');
          onOk();
        }
      }}
    >
      <ProFormText
        name="applicationName"
        label="应用名"
        placeholder="请输入应用名"
        rules={[{ required: true, message: '应用名不能为空' }]}
      />

      <ProFormDigit
        name="code"
        label="错误码编码"
        placeholder="请输入错误码编码"
        fieldProps={{ precision: 0 }}
        rules={[{ required: true, message: '错误码编码不能为空' }]}
      />

      <ProFormText
        name="message"
        label="错误码提示"
        placeholder="请输入错误码提示"
        rules={[{ required: true, message: '错误码提示不能为空' }]}
      />

      <ProFormTextArea name="memo" label="备注" placeholder="请输入备注" />
    </DrawerForm>
  );
});
