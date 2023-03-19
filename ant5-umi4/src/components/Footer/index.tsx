import {
  GithubOutlined,
  GlobalOutlined,
  GoogleOutlined,
} from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';

// 开发环境和线上演示环境保留版权信息
const keepCopyright = process.env.COPYRIGHT === '1';

export default () => {
  if (!keepCopyright) {
    return <></>;
  }

  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '版权所有',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{ background: 'none' }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Survey King',
          title: <GlobalOutlined />,
          href: 'https://surveyking.cn',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/javahuang/SurveyKing',
          blankTarget: true,
        },
        {
          key: 'gitee',
          title: <GoogleOutlined />,
          href: 'https://gitee.com/surveyking/surveyking',
          blankTarget: true,
        },
      ]}
    />
  );
};
