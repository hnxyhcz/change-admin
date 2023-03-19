import Iframe from '@/components/Iframe';

const JavaServer: React.FC = () => {
  return <Iframe src={`${process.env.BASE_URL}/admin/applications`} />;
};

export default JavaServer;
