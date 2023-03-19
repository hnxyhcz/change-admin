import {
  DrawerForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { observer } from '@formily/reactive-react';
import { message } from 'antd';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import { DICT_TYPE } from '@/store/DictStore';
import { listSimplePostsApi } from '@/services/system/post';
import { createUserApi, updateUserApi } from '@/services/system/user';
import type { UserVO } from '@/services/system/user/types';
import { useDictStore } from '@/shared/useStore';
import { ProFormDict } from '@/components/DictWrapper';

type Props = {
  user?: UserVO;
  onClose: () => void;
  onOk: () => void;
};

export const EditUser: React.FC<Props> = observer((props) => {
  const { user, onClose, onOk } = props;
  const { getCascadeDict } = useDictStore();

  const formRef = useRef<ProFormInstance<UserVO>>();

  return (
    <DrawerForm<UserVO>
      title={user?.id ? '修改用户' : '新建用户'}
      formRef={formRef}
      open
      initialValues={user}
      drawerProps={{
        onClose,
        forceRender: true,
        destroyOnClose: true,
      }}
      grid
      rowProps={{ gutter: [16, 0] }}
      onFinish={async (values) => {
        let res;
        if (user?.id) {
          res = await updateUserApi({ ...user, ...values });
        } else {
          res = await createUserApi(values);
        }
        if (res) {
          message.success(user?.id ? '修改成功' : '新增成功');
          onOk();
        }
      }}
    >
      <ProFormText
        name="nickname"
        colProps={{ span: 12 }}
        label="姓名不能为空"
        placeholder="请输入姓名"
        rules={[{ required: true, message: '姓名不能为空' }]}
      />
      <ProFormText
        name="username"
        label="登录名"
        colProps={{ span: 12 }}
        placeholder="请输入登录账户名称"
      />

      {!user?.id && (
        <>
          <ProFormText.Password
            name="password"
            label="输入密码"
            colProps={{ span: 12 }}
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
          />
          <ProFormText.Password
            name="rePassword"
            label="确认密码"
            colProps={{ span: 12 }}
            placeholder="再次输入密码"
            rules={[
              {
                required: true,
                message: '确认密码不能为空!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入密码不一致!'));
                },
              }),
            ]}
          />
        </>
      )}

      <ProFormText
        name="mobile"
        label="手机"
        colProps={{ span: 12 }}
        placeholder="请输入手机号"
      />
      <ProFormText
        name="email"
        label="邮箱"
        colProps={{ span: 12 }}
        placeholder="请输入邮箱"
        rules={[
          {
            type: 'email',
            message: '请输入邮箱!',
          },
        ]}
      />

      <ProFormDict
        name="sex"
        label="性别"
        colProps={{ span: 12 }}
        placeholder="请选择性别"
        dictCode={DICT_TYPE.SYSTEM_USER_SEX}
        type="number"
      />

      <ProFormSelect
        name="postIds"
        label="岗位"
        mode="multiple"
        colProps={{ span: 12 }}
        request={listSimplePostsApi}
        fieldProps={{
          fieldNames: {
            value: 'id',
            label: 'name',
          },
        }}
      />

      <ProFormTreeSelect
        name="deptId"
        label="归属部门"
        colProps={{ span: 24 }}
        placeholder="请选择归属部门"
        request={async () => await getCascadeDict(DICT_TYPE.DEPT)}
      />

      <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />
    </DrawerForm>
  );
});
