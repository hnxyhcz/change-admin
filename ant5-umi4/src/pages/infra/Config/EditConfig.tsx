import {
  DrawerForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { createConfigApi, updateConfigApi } from '@/services/infra/config';
import type { ConfigVO } from '@/services/infra/config/types';
import { message } from 'antd';

type Props = {
  current?: Partial<ConfigVO>;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const EditConfig: React.FC<Props> = observer((props) => {
  const { onOk, onClose, current, readonly = false } = props;

  const formRef = useRef<ProFormInstance<ConfigVO>>();
  const isEdit = !!current?.id;

  return (
    <DrawerForm<ConfigVO>
      title={isEdit ? '修改任务' : '添加任务'}
      formRef={formRef}
      visible
      initialValues={{
        status: 0,
        ...current,
      }}
      drawerProps={{
        onClose,
        forceRender: true,
        destroyOnClose: true,
      }}
      grid
      rowProps={{ gutter: [16, 0] }}
      onFinish={async (values) => {
        let resp;
        if (current?.id) {
          resp = await updateConfigApi({
            ...current,
            ...values,
          });
        } else {
          resp = await createConfigApi({
            ...current,
            ...values,
          });
        }
        if (resp.code === 0) {
          onOk();
        } else {
          message.error(resp.msg);
        }
      }}
    >
      <ProFormText
        name="category"
        label="配置类别"
        readonly={readonly}
        placeholder="请输入配置类别"
        rules={[{ required: true, message: '配置类别不能为空' }]}
      />
      <ProFormText
        name="name"
        label="配置名称"
        readonly={readonly}
        placeholder="请输入配置名称"
        rules={[{ required: true, message: '配置名称不能为空' }]}
      />
      <ProFormText
        name="key"
        label="配置键名"
        readonly={readonly}
        placeholder="请输入配置键名"
        rules={[{ required: true, message: '配置键名不能为空' }]}
      />
      <ProFormText
        name="value"
        label="配置键值"
        readonly={readonly}
        placeholder="请输入配置键值"
        rules={[{ required: true, message: '配置键值不能为空' }]}
      />
      <ProFormRadio.Group
        name="visible"
        label="是否敏感"
        options={[
          {
            label: '是',
            value: true,
          },
          {
            label: '否',
            value: false,
          },
        ]}
      />
      <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />
    </DrawerForm>
  );
});
