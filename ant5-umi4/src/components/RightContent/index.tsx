import React from 'react';
import { Space } from 'antd';
import { SelectLang } from '@umijs/max';
import AvatarDropdown from './AvatarDropdown';
import UpdatePassword from './UpdatePassword';
import { useEmotionCss } from '@ant-design/use-emotion-css';
// import NoticeIconView from '../NoticeIcon';

export * from './SettingDropdown';

const GlobalHeaderRight: React.FC = () => {
  const className = useEmotionCss(() => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      gap: 8,
    };
  });

  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      float: 'right',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      cursor: 'pointer',
      padding: '0 12px',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <Space className={className}>
      {/* <NoticeIconView /> */}
      <AvatarDropdown />
      <SelectLang className={actionClassName} />
      <UpdatePassword />
    </Space>
  );
};

export default GlobalHeaderRight;
