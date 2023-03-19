import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel } from '@umijs/max';
import { Avatar, Spin } from 'antd';
import { setAlpha } from '@ant-design/pro-components';
import React, { useCallback } from 'react';
import HeaderDropdown from '../HeaderDropdown';

type SettingProps = {};

export const SettingDropdown: React.FC<SettingProps> = () => {
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: { key: string }) => {
      const { key } = event;
      if (key === 'logout') {
        initialState?.logout();
        return;
      }
      history.push(key);
    },
    [setInitialState],
  );

  const loading = (
    <span className={actionClassName}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;
  if (!currentUser || !currentUser.id) {
    return loading;
  }

  const menuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const inlineStyle = {
    cursor: 'pointer',
    padding: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    verticalAlign: 'middle',
  };

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
      placement="topRight"
    >
      <span style={inlineStyle}>
        <SettingOutlined />
      </span>
    </HeaderDropdown>
  );
};
