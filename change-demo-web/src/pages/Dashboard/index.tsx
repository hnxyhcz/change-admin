import React from 'react';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Card, Result, Skeleton, Statistic, Typography } from 'antd';

import styles from './styles.less';
import moment from 'moment';

/**
 * 获取问候语
 * @param userName 用户名
 * @returns 
 */
const greetContent = (userName: string | undefined) => {
  const hour = new Date().getHours()
  let content = "";
  if (hour < 5) {
    content = `夜已深，${userName}注意休息哦！`
  } else if (hour < 9) {
    content = `亲爱的${userName}，早安呀！`
  } else if (hour < 12) {
    content = `亲爱的${userName}，祝您开心每一天！`
  } else if (hour < 13) {
    content = `亲爱的${userName}，午安呐！`
  } else if (hour < 20) {
    content = `亲爱的${userName}，祝您开心每一天！`
  } else if (hour < 22) {
    content = `亲爱的${userName}，晚安哟！`
  } else {
    content = `晚安全世界，晚安${userName}！`
  }
  return content;
}

type ContentProps = {
  currentUser: Partial<API.CurrentUser | undefined>,
}

const PageHeaderContent: React.FC<ContentProps> = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{ rows: 1 }} active />;
  }
  return (
    <div className={styles.pageHeaderContent} style={{ marginTop: '-12px' }}>
      <div className={styles.avatar}>
        <Avatar size="large" src={'/avatar.png'} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle2}>{greetContent(currentUser?.name)}</div>
        <div>最近登录时间：{moment().format('YYYY-MM-DD hh:mm:ss')}</div>
      </div>
    </div>
  );
};

export default (): React.ReactNode => {
  const { initialState } = useModel('@@initialState');
  const { currentUser, settings } = initialState || {}

  return (
    <PageContainer
      title={false}
      content={<PageHeaderContent currentUser={currentUser} />}
      extraContent={
        <div className={styles.extraContent}>
          <div className={styles.statItem}>
            <Statistic title={'访问次数'} value={9999} />
          </div>
        </div>
      }
    >
      <Card>
        <Result
          icon={
            <Typography.Text strong style={{ fontSize: '24px' }}>
              欢迎您
            </Typography.Text>
          }
          subTitle={
            <Typography.Text style={{ fontSize: '16px' }}>{settings?.description}</Typography.Text>
          }
        />
      </Card>
    </PageContainer>
  );
};
