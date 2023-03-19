import {
  DrawerForm,
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { message } from 'antd';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { ProFormDict } from '@/components/DictWrapper';
import { DICT_TYPE } from '@/store/DictStore';
import { createPostApi, updatePostApi } from '@/services/system/post';
import type { PostVO } from '@/services/system/post/types';

type Props = {
  position?: PostVO;
  onClose: () => void;
  onOk: () => void;
};
export const EditPost: React.FC<Props> = observer((props) => {
  const { onOk, onClose, position } = props;

  const formRef = useRef<ProFormInstance<PostVO>>();

  return (
    <DrawerForm<PostVO>
      title={position?.id ? '修改岗位' : '新增岗位'}
      formRef={formRef}
      open
      initialValues={{ status: 0, ...position }}
      drawerProps={{
        onClose,
        forceRender: true,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        let resp;
        if (position?.id) {
          resp = await updatePostApi({ ...position, ...values });
        } else {
          resp = await createPostApi({ ...position, ...values });
        }
        if (resp) {
          message.success(position?.id ? '修改成功' : '新增成功');
          onOk();
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          width="md"
          label="岗位名称"
          placeholder="请输入岗位名称"
          required
          rules={[{ required: true, message: '岗位名称不能为空' }]}
        />
        <ProFormText
          width="md"
          name="code"
          label="岗位编码"
          placeholder="请输入岗位编码"
          rules={[{ required: true, message: '岗位编码不能为空' }]}
          required
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormDigit
          width="md"
          name="sort"
          label="显示顺序"
          min={0}
          placeholder="请输入数值"
          fieldProps={{ precision: 0 }}
          rules={[{ required: true, message: '显示顺序不能为空' }]}
        />
        <ProFormDict
          width="md"
          name="status"
          label="状态"
          placeholder="请选择状态"
          dictCode={DICT_TYPE.COMMON_STATUS}
          type="number"
          rules={[{ required: true, message: '请选择状态' }]}
        />
      </ProForm.Group>
      <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />
    </DrawerForm>
  );
});
