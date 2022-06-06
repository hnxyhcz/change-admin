import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useRef, useState } from 'react';
import { ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel } from 'umi';

import { login } from '@/services/login';
import SlideCaptcha from '@/components/SliderCaptcha';
import styles from '../index.less';

type LoginStateType = {
  success: boolean
  message: string | undefined
}

const LoginMessage: React.FC<{ content: string }> = ({ content }) => (
  <Alert
    showIcon
    type="error"
    message={content}
    style={{ marginBottom: 24 }}
  />
);

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { systemInfo: { logo, title } } = initialState;
  const formRef = useRef<API.LoginRequest>()
  const [submitting, setSubmitting] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loginState, setLoginState] = useState<LoginStateType>();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s: any) => ({ ...s, currentUser: userInfo }));
    }
  };
  
  const verifyCaptcha = async (isShow: boolean, captcha: string | undefined) => {
    setShowCaptcha(isShow)
    if (captcha) {
      await handleSubmit({ ...formRef.current, captcha });
    }
    setSubmitting(false);
  }

  const handleSubmit = async (values: API.LoginRequest) => {
    try {
      // 登录
      const resp = await login(values);
      if (resp.code === 200) {
        message.success('登录成功！');
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
      setLoginState({
        success: false,
        message: resp.message
      });
    } catch (error) {
      message.error('登录失败，请重试！');
    }
  };

  const submitter = (values: API.LoginRequest) => {
    setSubmitting(true);
    formRef.current = values
    setShowCaptcha(true)
  }

  const { success = true } = loginState || {};
  return (
    <div className={styles.loginModal}>
      <LoginForm
        style={{ marginTop: '32px' }}
        title={title}
        initialValues={{ autoLogin: true }}
        logo={logo && <img alt="logo" src={logo} />}
        submitter={{
          searchConfig: {
            submitText: '登录',
          },
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={async (values) => {
          submitter(values as API.LoginRequest);
        }}
      >
        {!success && <LoginMessage content={loginState?.message || '用户名和密码错误'} />}
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={styles.prefixIcon} />,
          }}
          placeholder={'用户名'}
          rules={[
            {
              required: true,
              message: '请输入用户名！',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={styles.prefixIcon} />,
          }}
          placeholder={'密码'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <div style={{ marginBottom: 24 }}>
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a style={{ float: 'right' }}>忘记密码?</a>
        </div>
      </LoginForm>
      <SlideCaptcha isShow={showCaptcha} verifyCaptcha={verifyCaptcha} />
    </div>
  );
};

export default Login;
