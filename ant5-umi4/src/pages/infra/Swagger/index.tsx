import Iframe from '@/components/Iframe';

const Swagger: React.FC = () => {
  return <Iframe src={`${process.env.BASE_URL}/swagger-ui/index.html`} />;
};

export default Swagger;
