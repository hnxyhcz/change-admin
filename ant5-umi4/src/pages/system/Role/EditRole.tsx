import {
  DrawerForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { createRoleApi, updateRoleApi } from '@/services/system/role';
import type { RoleVO } from '@/services/system/role/types';

type Props = {
  role?: RoleVO;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const EditRole: React.FC<Props> = observer((props) => {
  const { onOk, onClose, role } = props;
  const formRef = useRef<ProFormInstance<RoleVO>>();

  return (
    <DrawerForm<RoleVO>
      open
      title={role?.id ? '修改角色' : '新增角色'}
      formRef={formRef}
      initialValues={role}
      drawerProps={{
        onClose,
        forceRender: true,
        destroyOnClose: true,
      }}
      grid
      rowProps={{ gutter: [16, 0] }}
      onFinish={async (values) => {
        if (role?.id) {
          const res = await updateRoleApi({
            ...role,
            ...values,
          });
          res && onOk();
          return;
        }
        const res = await createRoleApi(values);
        res && onOk();
      }}
    >
      <ProFormText
        name="name"
        label="角色名称"
        placeholder="请输入角色名称"
        required
        rules={[{ required: true, message: '角色名不能为空' }]}
      />
      <ProFormText
        name="code"
        label="角色编码"
        placeholder="请输入角色编码"
        rules={[{ required: true, message: '角色编码不能为空' }]}
        required
      />
      <ProFormTextArea
        name="remark"
        label="描述"
        placeholder="请输入角色描述信息"
      />
    </DrawerForm>
  );
});
