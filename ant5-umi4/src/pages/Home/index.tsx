import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';
import styles from './index.less';

const HomePage: React.FC = () => {
  const access = useAccess();
  return (
    <PageContainer ghost>
      <div className={styles.container}>hello world</div>
    </PageContainer>
  );
};

export default HomePage;
