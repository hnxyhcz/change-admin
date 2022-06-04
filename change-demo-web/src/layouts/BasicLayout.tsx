import React, { useContext } from 'react';
import { Button } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';

import styles from './styles.less';
import { useModel, history } from 'umi';
import { RouteContext } from '@ant-design/pro-layout';

/** 参数也可以从route中获取 */
export interface LayoutProps {
  /** 是否显示返回首页按钮 */
  showHome?: boolean;
  /** 是否显示跳转登录按钮 */
  showLogin?: boolean;
  /** 是否显示跳转注册按钮 */
  showRegister?: boolean;
}

const defaultProps = { showHome: false, showLogin: false, showRegister: false };

const Layout: React.FC<LayoutProps> = (props) => {
  const routeContext = useContext(RouteContext);
  const { matchMenus = [] } = routeContext;
  const matchMenu = matchMenus[matchMenus.length - 1] || defaultProps;
  const { showHome, showLogin, showRegister } = matchMenu;
  const {
    initialState: { settings },
  } = useModel<any>('@@initialState');
  const { bacgImage = '/bacgImage.jpg' } = settings;

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bacgImage})` }}>
      {(showLogin || showHome || showRegister) && (
        <Header>
          <div style={{ marginRight: '32px', float: 'right' }}>
            {showLogin && (
              <a onClick={() => history.push('/user/login')} className={styles.redirectBtn}>
                <Button shape="round" size="large" type="primary">
                  登录
                </Button>
              </a>
            )}
            {showRegister && (
              <a onClick={() => history.push('/user/register')} className={styles.redirectBtn}>
                <Button shape="round" size="large" ghost>
                  注册
                </Button>
              </a>
            )}
            {showHome && (
              <a onClick={() => history.push('/welcome')} className={styles.redirectBtn}>
                <Button shape="round" size="large" ghost>
                  返回首页
                </Button>
              </a>
            )}
          </div>
        </Header>
      )}
      <Content style={{ padding: '64px' }}>{props.children}</Content>
      <Footer style={{ background: 'unset' }} />
    </div>
  );
};

export default Layout;
