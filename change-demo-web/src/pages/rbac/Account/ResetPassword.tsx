import { LockOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';

type Props = {
  onOk: (password: string) => void;
  onCancel: () => void;
};

export const ResetPassword = (props: Props) => {
  return (
    <ModalForm
      title="重置密码"
      visible

      width={400}
      onFinish={async (values: { password: string }) => {
        props.onOk(values.password);
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
      }}
    >
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />,
        }}
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
      />
    </ModalForm>
  );
};
