import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { DrawerForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { observer } from '@formily/reactive-react';
import { useSystemStore } from '@/hooks/useSystemStore';
import { loadRoles } from '@/services/system';
import { checkUsernameExist } from '@/services/login';

type Props = {
  user?: API.SystemUser;
  readonly?: boolean;
  onClose: () => void;
  onOk: () => void;
};

export const EditUser: React.FC<Props> = observer((props) => {
  const { user, readonly, onClose, onOk } = props;
  const systemStore = useSystemStore();

  const formRef = useRef<ProFormInstance<API.SystemUser>>();
  const roles = user?.roles?.map((x) => x.id);
  const isEdit = !!user?.id;

  return (
    <DrawerForm<API.SystemUser>
      title={readonly ? '系统用户详情' : isEdit ? '修改用户' : '新建用户'}
      formRef={formRef}
      visible
      initialValues={{
        ...user,
        roles,
        status: user && (user.status ? 1 : 0) || undefined
      }}
      submitter={{
        submitButtonProps: {
          style: {
            display: readonly ? 'none' : 'block',
          },
        },
      }}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: () => {
          onClose();
        },
      }}
      onFinish={async (values) => {
        // 不返回不会关闭弹框
        const resp = await systemStore.upsertUser({
          ...user,
          ...values,
        });
        
        if (resp.success) {
          onOk();
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          width="md"
          label="用户名"
          tooltip="最长为 24 位"
          id="form-name"
          placeholder="请输入名称"
          readonly={readonly}
          required
          rules={[{ required: true, message: '用户名不能为空' }]}
        />
        <ProFormText
          width="md"
          readonly={readonly}
          name="username"
          label="登录名"
          placeholder="请输入登录账户名称"
          rules={[
            { required: true, message: '登录名不能为空' },
            {
              validator: async (_, value) => {
                if (value === user?.username) {
                  return Promise.resolve();
                }
                const exist = await checkUsernameExist(value);
                if (exist) {
                  return Promise.reject(new Error('登录名已存在'));
                }
                return Promise.resolve();
              },
            },
          ]}
          required
        />
      </ProForm.Group>

      {!isEdit && (
        <ProForm.Group>
          <ProFormText.Password
            width="md"
            readonly={readonly}
            name="password"
            label="输入密码"
            placeholder="请输入密码"
            rules={[
              {
                required: !isEdit,
                message: '请输入密码!',
              },
            ]}
            required={!isEdit}
          />
          <ProFormText.Password
            width="md"
            readonly={readonly}
            name="rePassword"
            label="确认密码"
            placeholder="再次输入密码"
            rules={[
              {
                required: !isEdit,
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
            required={!isEdit}
          />
        </ProForm.Group>
      )}
      <ProForm.Group>
        <ProFormSelect
          readonly={readonly}
          options={[
            {
              value: 'M',
              label: '男',
            },
            {
              value: 'F',
              label: '女',
            },
          ]}
          width="md"
          name="gender"
          label="性别"
        />
        <ProFormSelect
          readonly={readonly}
          required
          options={[
            {
              value: 1,
              label: '激活',
            },
            {
              value: 0,
              label: '失活',
            },
          ]}
          width="md"
          name="status"
          label="状态"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          name="phone"
          readonly={readonly}
          width="md"
          label="手机"
          placeholder="请输入手机号"
        />
        <ProFormText
          width="md"
          name="email"
          readonly={readonly}
          label="邮箱"
          placeholder="请输入邮箱"
          rules={[
            {
              type: 'email',
              message: '请输入邮箱!',
            },
          ]}
        />
        <ProFormSelect
          mode="tags"
          readonly={readonly}
          request={async () =>
            loadRoles({ current: 1, pageSize: 1024 }).then((res) =>
              res.data.map((x) => ({
                label: x.name,
                value: x.id,
              })),
            )
          }
          width="md"
          name="roles"
          label="角色列表"
        />
      </ProForm.Group>
    </DrawerForm>
  );
});
