import { IframeHTMLAttributes } from 'react';
import Loading from '../Loading';

type HTMLIframeProps = Omit<IframeHTMLAttributes<HTMLIFrameElement>, 'loading'>;

interface IframeProps extends HTMLIframeProps {
  loading?: boolean;
}

export default (props: IframeProps) => {
  const { loading = false, style: styleProps, ...iframeProps } = props;
  const style = {
    border: 0,
    width: '100%',
    height: 'calc(100vh - 105px)',
    ...styleProps,
  };

  return loading ? <Loading /> : <iframe style={style} {...iframeProps} />;
};
