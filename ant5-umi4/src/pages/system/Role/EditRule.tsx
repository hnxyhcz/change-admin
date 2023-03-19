import {
  ModalForm,
  ProFormTreeSelect,
  ProFormText,
  ProFormItem,
  ProFormCheckbox,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { TreeSelect } from 'antd';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { handleTree } from '@/shared/tree';
import { DICT_TYPE } from '@/store/DictStore';
import { useDictStore } from '@/shared/useStore';
import { listSimpleMenus } from '@/services/system/menu';
import {
  assignRoleDataScopeApi,
  assignRoleMenuApi,
  listRoleMenusApi,
} from '@/services/system/permission';
import type { RoleVO } from '@/services/system/role/types';
import { ProFormDict } from '@/components/DictWrapper';

type Props = {
  type: '数据权限' | '菜单权限';
  role: RoleVO;
  onClose: () => void;
  onOk: () => void;
};

export const EditRule: React.FC<Props> = observer((props) => {
  const { type, onOk, onClose, role } = props;

  const formRef = useRef<ProFormInstance>();
  const { getCascadeDict } = useDictStore();

  return (
    <ModalForm
      open
      title={`分配${type}`}
      formRef={formRef}
      request={async () => {
        if (type === '数据权限') {
          return {
            id: role.id,
            dataScope: role.dataScope,
            dataScopeDeptIds: role.dataScopeDeptIds || undefined,
          };
        }
        if (type === '菜单权限') {
          const menuIds = await listRoleMenusApi(role.id);
          return {
            menuIds,
            roleId: role.id,
          };
        }
      }}
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        onCancel: onClose,
      }}
      onFinish={async (values) => {
        if (type === '菜单权限') {
          const res = await assignRoleMenuApi({ ...values, roleId: role.id });
          res && onOk();
        }
        if (type === '数据权限') {
          const res = await assignRoleDataScopeApi({
            ...values,
            roleId: role.id,
          });
          res && onOk();
        }
      }}
    >
      <ProFormText
        name="name"
        label="角色名称"
        disabled
        initialValue={role.name}
      />
      <ProFormText
        name="code"
        label="角色编码"
        disabled
        initialValue={role.code}
      />
      {type === '菜单权限' && (
        <>
          <ProFormTreeSelect
            name="menuIds"
            label="菜单权限"
            request={async () => {
              const menus = await listSimpleMenus();
              if (menus) {
                return handleTree(menus);
              }
              return [];
            }}
            fieldProps={{
              multiple: true,
              treeCheckable: true,
              treeCheckStrictly: true,
              showCheckedStrategy: TreeSelect.SHOW_ALL,
              fieldNames: {
                value: 'id',
                label: 'name',
              },
            }}
          />
        </>
      )}
      {type === '数据权限' && (
        <>
          <ProFormDict
            name="dataScope"
            label="权限范围"
            placeholder="请选择权限范围"
            dictCode={DICT_TYPE.SYSTEM_DATA_SCOPE}
            type="number"
          />
          <ProFormItem noStyle shouldUpdate>
            {(form) =>
              form.getFieldValue('dataScope') === 2 && (
                <>
                  <ProFormItem style={{ marginBottom: '0' }} label="数据权限">
                    <ProFormCheckbox noStyle name="linked">
                      父子联动（选中父节点，自动选择子节点）
                    </ProFormCheckbox>
                  </ProFormItem>
                  <ProFormTreeSelect
                    name="dataScopeDeptIds"
                    request={async () => {
                      return await getCascadeDict(DICT_TYPE.DEPT);
                    }}
                    placeholder="请选择"
                    fieldProps={{
                      treeCheckable: true,
                      treeCheckStrictly: !form.getFieldValue('linked'),
                    }}
                  />
                </>
              )
            }
          </ProFormItem>
        </>
      )}
    </ModalForm>
  );
});
