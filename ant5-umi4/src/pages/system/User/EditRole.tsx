import {
  ModalForm,
  ProFormTreeSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { listSimpleRolesApi } from '@/services/system/role';
import {
  aassignUserRoleApi,
  listUserRolesApi,
} from '@/services/system/permission';
import type { UserVO } from '@/services/system/user/types';

type Props = {
  user: UserVO;
  onClose: () => void;
  onOk: () => void;
};

export const EditRole: React.FC<Props> = observer((props) => {
  const { onOk, onClose, user } = props;

  const formRef = useRef<ProFormInstance>();

  return (
    <ModalForm
      open
      title="分配角色"
      formRef={formRef}
      request={async () => {
        const roleIds = await listUserRolesApi(user.id);
        return { roleIds };
      }}
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        onCancel: onClose,
      }}
      onFinish={async (values) => {
        const res = await aassignUserRoleApi({ ...values, userId: user.id });
        res && onOk();
      }}
    >
      <ProFormText
        name="username"
        label="用户名称"
        disabled
        initialValue={user.username}
      />
      <ProFormText
        name="nickname"
        label="用户姓名"
        disabled
        initialValue={user.nickname}
      />
      <ProFormTreeSelect
        name="roleIds"
        label="角色"
        request={async () => await listSimpleRolesApi()}
        placeholder="请选择"
        fieldProps={{
          treeCheckable: true,
          fieldNames: {
            value: 'id',
            label: 'name',
          },
        }}
      />
    </ModalForm>
  );
});
