import {
  DrawerForm,
  ProFormSelect,
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
  createSensitiveWordApi,
  updateSensitiveWordApi,
} from '@/services/system/sensitiveWord';
import type { SensitiveWordVO } from '@/services/system/sensitiveWord/types';

type Props = {
  current?: SensitiveWordVO;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const EditSensitiveWrod: React.FC<Props> = observer((props) => {
  const { onOk, onClose, current } = props;
  const formRef = useRef<ProFormInstance<SensitiveWordVO>>();

  return (
    <DrawerForm<SensitiveWordVO>
      open
      width={800}
      formRef={formRef}
      initialValues={{ status: 0, ...current }}
      title={current?.id ? '修改敏感词' : '新增敏感词'}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose,
      }}
      grid
      rowProps={{ gutter: [16, 0] }}
      onFinish={async (values: SensitiveWordVO) => {
        let resp;
        if (current?.id) {
          resp = await updateSensitiveWordApi({ ...current, ...values });
        } else {
          resp = await createSensitiveWordApi(values);
        }
        if (resp) {
          message.success(current?.id ? '修改成功' : '新增成功');
          onOk();
        }
      }}
    >
      <ProFormText
        name="name"
        label="敏感词"
        placeholder="请输入敏感词"
        rules={[{ required: true, message: '敏感词不能为空' }]}
      />

      <ProFormSelect
        mode="tags"
        name="tags"
        label="标签"
        placeholder="请输入标签"
        rules={[{ required: true, message: '标签不能为空' }]}
      />

      <ProFormDict
        name="status"
        label="状态"
        placeholder="请选择状态"
        dictCode={DICT_TYPE.COMMON_STATUS}
        type="number"
        rules={[{ required: true, message: '状态不能为空' }]}
      />

      <ProFormTextArea
        name="description"
        label="描述"
        placeholder="请输入描述"
      />
    </DrawerForm>
  );
});
