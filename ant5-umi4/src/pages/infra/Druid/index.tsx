import Iframe from '@/components/Iframe';

const Durid: React.FC = () => {
  return <Iframe src={`${process.env.BASE_URL}/druid/index.html`} />;
};

export default Durid;
