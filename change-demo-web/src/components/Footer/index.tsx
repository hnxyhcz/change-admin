import { DefaultFooter } from '@ant-design/pro-layout';

export default (props: any) => {
  const defaultMessage = '中国医学科学院阜外医院';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        // {
        //   key: 'Ant Design Pro',
        //   title: 'Ant Design Pro',
        //   href: 'https://pro.ant.design',
        //   blankTarget: true,
        // },
      ]}
      {...props}
    />
  );
};
