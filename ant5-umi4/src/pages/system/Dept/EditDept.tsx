import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { message } from 'antd';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { handleTree } from '@/shared/tree';
import { DICT_TYPE } from '@/store/DictStore';
import { ProFormDict } from '@/components/DictWrapper';
import { getListSimpleUsersApi } from '@/services/system/user';
import {
  createDeptApi,
  listSimpleDeptApi,
  updateDeptApi,
} from '@/services/system/dept';
import type { DeptVO } from '@/services/system/dept/types';

type Props = {
  dept?: DeptVO;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const EditDept: React.FC<Props> = observer((props) => {
  const { onOk, onClose, dept } = props;

  const formRef = useRef<ProFormInstance<DeptVO>>();

  return (
    <DrawerForm<DeptVO>
      open
      width={800}
      formRef={formRef}
      initialValues={{
        ...dept,
        parentId: dept?.parentId || undefined,
      }}
      title={dept?.id ? '修改部门' : '新增部门'}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose,
      }}
      grid
      rowProps={{ gutter: [16, 0] }}
      onFinish={async (values) => {
        let resp;
        if (dept?.id) {
          resp = await updateDeptApi({ ...dept, ...values });
        } else {
          resp = await createDeptApi({ ...dept, ...values });
        }
        if (resp) {
          message.success(dept?.id ? '修改成功' : '新增成功');
          onOk();
        }
      }}
    >
      <ProFormTreeSelect
        name="parentId"
        label="上级部门"
        colProps={{ span: 24 }}
        request={async () => {
          const depts = await listSimpleDeptApi();
          return handleTree(depts);
        }}
        fieldProps={{
          fieldNames: {
            value: 'id',
            label: 'name',
          },
        }}
      />
      <ProFormText
        name="name"
        colProps={{ span: 12 }}
        label="部门名称"
        placeholder="请输入菜单名称"
        rules={[{ required: true, message: '菜单名不能为空' }]}
      />

      <ProFormDigit
        name="sort"
        colProps={{ span: 12 }}
        label="显示顺序"
        min={0}
        placeholder="请输入数值"
        fieldProps={{ precision: 0 }}
        rules={[{ required: true, message: '显示顺序不能为空' }]}
      />

      <ProFormSelect
        name="leaderUserId"
        colProps={{ span: 12 }}
        request={async () => getListSimpleUsersApi()}
        fieldProps={{
          fieldNames: {
            label: 'nickname',
            value: 'id',
          },
        }}
        label="负责人"
        placeholder="请输入负责人"
      />

      <ProFormText
        name="phone"
        colProps={{ span: 12 }}
        label="联系电话"
        placeholder="请输入联系电话"
        rules={[{ pattern: /\d{11}/, message: '电话格式不正确' }]}
      />
      <ProFormText
        name="email"
        colProps={{ span: 12 }}
        label="邮箱"
        placeholder="请输入邮箱"
        rules={[{ message: '邮箱不能为空', type: 'email' }]}
      />
      <ProFormDict
        name="status"
        label="部门状态"
        placeholder="请选择部门状态"
        colProps={{ span: 12 }}
        dictCode={DICT_TYPE.COMMON_STATUS}
        type="number"
        rules={[{ required: true, message: '请选择部门状态' }]}
      />
    </DrawerForm>
  );
});
