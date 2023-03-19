import { DrawerForm, ProFormText } from '@ant-design/pro-components';
import { ProFormTextArea } from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { ProFormDict } from '@/components/DictWrapper';
import { DICT_TYPE } from '@/store/DictStore';
import {
  createDictTypeApi,
  updateDictTypeApi,
} from '@/services/system/dict/dictType';
import type { DictTypeVO } from '@/services/system/dict/types';

type Props = {
  dict?: Partial<DictTypeVO>;
  onClose: () => void;
  onOk: () => void;
};

export const EditDict: React.FC<Props> = observer((props) => {
  const { onOk, onClose, dict } = props;

  const formRef = useRef<ProFormInstance<DictTypeVO>>();
  const isEdit = !!dict?.id;

  return (
    <DrawerForm<DictTypeVO>
      open
      title={isEdit ? '修改字典类型' : '新增字典类型'}
      formRef={formRef}
      initialValues={{
        status: 0,
        ...dict,
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
        if (dict?.id) {
          resp = await updateDictTypeApi({
            ...dict,
            ...values,
          });
        } else {
          resp = await createDictTypeApi({
            ...dict,
            ...values,
          });
        }
        if (resp) {
          onOk();
        }
      }}
    >
      <ProFormText
        name="name"
        label="字典名称"
        placeholder="请输入字典名称"
        rules={[{ required: true, message: '字典名称不能为空' }]}
      />

      <ProFormText
        name="type"
        label="字典类型"
        placeholder="请输入字典类型"
        rules={[{ required: true, message: '字典类型不能为空' }]}
      />

      <ProFormDict
        name="status"
        label="状态"
        placeholder="请选择状态"
        dictCode={DICT_TYPE.COMMON_STATUS}
        type="number"
        rules={[{ required: true, message: '请选择状态' }]}
      />

      <ProFormTextArea
        name="remark"
        label="描述"
        placeholder="请输入字典描述信息"
      />
    </DrawerForm>
  );
});
