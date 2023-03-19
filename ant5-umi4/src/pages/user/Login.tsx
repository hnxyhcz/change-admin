import {
  LockOutlined,
  UserOutlined,
  WechatOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import {
  FormattedMessage,
  history,
  Link,
  SelectLang,
  useIntl,
  useModel,
} from '@umijs/max';
import { Alert } from 'antd';
import { useRef, useState } from 'react';

import { login } from '@/services/auth';
import { setToken } from '@/shared/auth';
import Footer from '@/components/Footer';
import SlideCaptcha from '@/components/SliderCaptcha';
import type { UserLoginVO } from '@/services/auth/types';
import { defaultSettings } from 'config/defaultSettings';

const ActionIcons = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    };
  });

  return (
    <>
      <WechatOutlined key="wechat" className={langClassName} />
      <WeiboCircleOutlined key="weibo" className={langClassName} />
    </>
  );
};

const Lang = () => {
  const langClassName = useEmotionCss(() => {
    return {
      width: '100%',
      height: '40px',
      lineHeight: '44px',
      textAlign: 'right',
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<string>();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const formRef = useRef<UserLoginVO>();
  const { initialState } = useModel('@@initialState');
  const systemInfo = initialState?.systemInfo || defaultSettings;

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: `url('${systemInfo?.backgroundImage}')`,
      backgroundSize: '100% 100%',
    };
  });

  const iconClassName = useEmotionCss(() => {
    return {
      color: 'rgba(0, 0, 0, 0.2)',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
    };
  });

  const intl = useIntl();

  const verifyCaptcha = async (
    isShow: boolean,
    captchaVerification?: string,
  ) => {
    setShowCaptcha(isShow);
    const { username, password } = { ...formRef.current };
    if (username && password && captchaVerification) {
      await handleSubmit({ username, password, captchaVerification });
    }
    setSubmitting(false);
  };

  const handleSubmit = async (values: UserLoginVO) => {
    try {
      // 登录
      const resp = await login(values);
      if (!resp) {
        return;
      }
      setToken(resp);
      await initialState?.loadUserProfile();
      history.push('/');
      return;
    } catch (error) {
      setUserLoginState('账号或者密码失败');
    }
    setSubmitting(false);
  };

  const submitter = (values: UserLoginVO) => {
    setSubmitting(true);
    formRef.current = values;
    setShowCaptcha(true);
  };

  return (
    <div className={containerClassName}>
      <Lang />
      <div style={{ flex: '1', padding: '32px 0' }}>
        <LoginForm<UserLoginVO>
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          title={systemInfo?.title}
          logo={<img alt="logo" src={systemInfo?.logo} />}
          subTitle={systemInfo?.description}
          // actions={[
          //   <FormattedMessage
          //     key="loginWith"
          //     id="pages.login.loginWith"
          //     defaultMessage="其他登录方式"
          //   />,
          //   <ActionIcons key="icons" />,
          // ]}
          submitter={{
            submitButtonProps: {
              loading: submitting,
            },
          }}
          onFinish={async (values) => submitter(values)}
        >
          {userLoginState === 'error' && (
            <Alert
              showIcon
              type="error"
              style={{ marginBottom: 24 }}
              message={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误',
              })}
            />
          )}
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={iconClassName} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '用户名',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={iconClassName} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '密码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入密码！"
                    />
                  ),
                },
              ]}
            />
          </>

          {systemInfo.registerInfo?.registerEnabled && (
            <div
              style={{
                marginBottom: 24,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Link to="/user/register">
                <FormattedMessage
                  id="pages.login.registerAccount"
                  defaultMessage="注册"
                />
              </Link>
            </div>
          )}
        </LoginForm>
        <SlideCaptcha isShow={showCaptcha} verifyCaptcha={verifyCaptcha} />
      </div>
      <Footer />
    </div>
  );
};

export default Login;
