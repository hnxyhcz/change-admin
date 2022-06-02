import React from 'react';
import { message } from 'antd';
import { history, useModel } from 'umi';
import { ProFormText, LoginForm, ProFormCaptcha } from '@ant-design/pro-form';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';

import { MOBILE_REGEXP } from '@/utils/dict';
import LoginLayout from '@/layouts/LoginLayout';

import styles from '../index.less';
import { checkUsernameExist, mobileCaptcha, register } from '@/services/login';

const Login: React.FC = () => {
  const { initialState } = useModel<any>('@@initialState');
  const { settings: { logo, title, subject, bacgImage } } = initialState;

  const validateLoginName = async (_: any, value: string) => {
    const exist = await checkUsernameExist(value);
    if (exist) {
      return Promise.reject(new Error('登录名已存在'));
    }
    return Promise.resolve();
  }

  const handleSubmit = async (values: API.RegisterRequest) => {
    const resp = await register(values);
    if (resp.code === 200) {
      message.success('注册成功！');
      history.push('/user/login');
    } else {
      message.error(resp.message || '注册失败！');
    }
  };

  return (
    <LoginLayout showHome showLogin bacgImage={bacgImage}>
      <div className={styles.loginModal}>
        <LoginForm
          style={{ marginTop: '32px' }}
          title={subject || title}
          logo={logo && <img alt="logo" src={logo} />}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterRequest);
          }}
          submitter={{
            searchConfig: {
              submitText: '注册'
            },
            render: function render(_, dom) {
              return dom.pop();
            },
            submitButtonProps: {
              size: 'large',
              style: {
                width: '100%'
              }
            }
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder={'登录名'}
            rules={[
              {
                required: true,
                message: '登录名是必填项！',
              },
              () => ({
                validateTrigger: 'onBlur',
                validator: validateLoginName,
              }),
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
          <ProFormText
            fieldProps={{
              size: 'large',
              prefix: <MobileOutlined className={styles.prefixIcon} />,
            }}
            name="mobile"
            placeholder='手机号'
            rules={[
              {
                required: true,
                message: '手机号是必填项！',
              },
              {
                pattern: MOBILE_REGEXP,
                message: '手机号格式错误！',
              },
            ]}
          />
          <ProFormCaptcha
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            captchaProps={{
              size: 'large',
            }}
            placeholder='请输入验证码'
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${'秒后重新获取'}`;
              }
              return '获取验证码';
            }}
            name="captcha"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
            phoneName={'mobile'}
            onGetCaptcha={async (mobile) => {
              await mobileCaptcha({ mobile });
            }}
          />
        </LoginForm>
      </div>
    </LoginLayout>
  );
};

export default Login;
