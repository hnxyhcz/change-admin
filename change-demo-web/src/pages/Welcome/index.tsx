import React from 'react';
import { Row, Col } from 'antd';
import { useModel } from 'umi';
import { LoginForm } from '@ant-design/pro-form';

import styles from './index.less';

const Welcome: React.FC = () => {
  const { initialState: { systemInfo } } = useModel<any>('@@initialState');
  const { logo, title, description } = systemInfo;

  return (
    <div className={styles.content}>
      <LoginForm
        logo={logo && <img alt="logo" src={logo} />}
        title={title}
        subTitle={
          <Row>
            <Col span={12} offset={6} className={styles.subTitle}>
              {description}
            </Col>
          </Row>
        }
        submitter={{
          render: () => (
            <a href="#" className={styles.writeBtn}>
              开始评估
            </a>
          ),
        }}
      />
    </div>
  );
};

export default Welcome;