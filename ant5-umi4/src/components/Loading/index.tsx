import { useEmotionCss } from '@ant-design/use-emotion-css';
import classNames from 'classnames';
import './style.less';

export default () => {
  const bgColorClassName = useEmotionCss(({ token }) => {
    return {
      backgroundColor: token.colorPrimary,
    };
  });

  return (
    <div className="sk-cube-grid">
      <div className={classNames('sk-cube sk-cube1', bgColorClassName)} />
      <div className={classNames('sk-cube sk-cube2', bgColorClassName)} />
      <div className={classNames('sk-cube sk-cube3', bgColorClassName)} />
      <div className={classNames('sk-cube sk-cube4', bgColorClassName)} />
      <div className={classNames('sk-cube sk-cube5', bgColorClassName)} />
      <div className={classNames('sk-cube sk-cube6', bgColorClassName)} />
      <div className={classNames('sk-cube sk-cube7', bgColorClassName)} />
      <div className={classNames('sk-cube sk-cube8', bgColorClassName)} />
      <div className={classNames('sk-cube sk-cube9', bgColorClassName)} />
    </div>
  );
};
