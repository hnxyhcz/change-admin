import React from 'react';
import { Button } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';

import styles from './LoginLayout.less';

export interface LayoutProps {
  bacgImage?: string;
  /** 是否显示返回首页按钮 */
  showHome?: boolean;
  /** 是否显示跳转登录按钮 */
  showLogin?: boolean;
  /** 是否显示跳转注册按钮 */
  showRegister?: boolean;
}

const Layout: React.FC<LayoutProps> = props => {
  const { bacgImage = '/bacgImage.jpg', showLogin = false, showHome = false, showRegister = false } = props

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bacgImage})` }}>
      {(showLogin || showHome || showRegister) && (
        <Header>
          <div style={{ marginRight: '32px', float: 'right' }}>
            {showLogin && (
              <a href="/user/login" className={styles.redirectBtn}>
                <Button shape="round" size="large" type="primary">登录</Button>
              </a>
            )}
            {showRegister && (
              <a href="/user/register" className={styles.redirectBtn}>
                <Button shape="round" size="large" ghost>注册</Button>
              </a>
            )}
            {showHome && (
              <a href="/welcome" className={styles.redirectBtn}>
                <Button shape="round" size="large" ghost>返回首页</Button>
              </a>
            )}
          </div>
        </Header>
      )}
      <Content style={{ padding: '64px' }}>
        {props.children}
      </Content>
      <Footer style={{ background: 'unset' }} />
    </div>
  );
};

export default Layout;
