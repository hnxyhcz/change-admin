import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useRef, useState } from 'react';
import { ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import { login } from '@/services/rms/login';
import styles from '../index.less';
import SlideCaptcha from '@/components/SlideCaptcha';
import LoginLayout from '@/layouts/LoginLayout';

const LoginMessage: React.FC<{ content: string }> = ({ content }) => (
  <Alert
    showIcon
    type="error"
    message={content}
    style={{ marginBottom: 24 }}
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.Response>();
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { settings: { logo, title, subject, bacgImage } } = initialState;

  const formRef = useRef<API.LoginParams>()
  const [submitting, setSubmitting] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s: any) => ({ ...s, currentUser: userInfo }));
    }
  };
  
  const verifyCaptcha = (isShow: boolean, captcha: string | undefined) => {
    setShowCaptcha(isShow)
    if (!!captcha) {
      handleSubmit({ ...formRef.current, captcha });
    } else {
      message.error('验证码校验失败！');
    }
  }

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login({ ...values });

      if (msg.code === 200) {
        message.success('登录成功！');
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        history.push(redirect || '/');
        return;
      }

      setUserLoginState(msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };

  const submitter = (values: API.LoginParams) => {
    setSubmitting(true);
    setShowCaptcha(true)
    formRef.current = values
  }

  const { code, message: errorMessage } = userLoginState || {};
  return (
    <LoginLayout showHome showRegister bacgImage={bacgImage}>
      <div className={styles.loginModal}>
        <LoginForm
          style={{ marginTop: '32px' }}
          title={subject || title}
          initialValues={{ autoLogin: true }}
          logo={logo && <img alt="logo" src={logo} />}
          submitter={{
            searchConfig: {
              submitText: '登录',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              loading: submitting,
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }}
          onFinish={async (values) => {
            submitter(values as API.LoginParams);
          }}
        >
          {code !== 200 && errorMessage && (
            <LoginMessage content={errorMessage || '用户名和密码错误'} />
          )}
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
                message: '用户名是必填项！',
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
                message: '密码是必填项！',
              },
            ]}
          />
          <div className={styles.sliderPopup} style={{ marginBottom: 24 }}>
            <SlideCaptcha
              isShow={showCaptcha}
              verifyCaptcha={verifyCaptcha}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a style={{ float: 'right' }}>
              忘记密码?
            </a>
          </div>
        </LoginForm>
      </div>
    </LoginLayout>
  );
};

export default Login;
