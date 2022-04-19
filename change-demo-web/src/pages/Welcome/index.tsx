import React from 'react';
import { Row, Col } from 'antd';
import { useModel } from 'umi';
import { LoginForm } from '@ant-design/pro-form';
import LoginLayout from '@/layouts/LoginLayout';

import styles from './index.less';

const Welcome: React.FC = () => {
  const { initialState: { settings } } = useModel<any>('@@initialState');
  const { logo, title, subject, description, bacgImage } = settings;

  return (
    <LoginLayout showLogin showRegister bacgImage={bacgImage}>
      <LoginForm
        logo={logo && <img alt="logo" src={logo} />}
        title={subject || title}
        subTitle={<Row><Col span={12} offset={6} className={styles.subTitle}>{description}</Col></Row>}
        submitter={{
          render: () => (
            <a href="#" className={styles.writeBtn}>开始评估</a>
          ),
        }}
      />
    </LoginLayout>
  );
};

export default Welcome;