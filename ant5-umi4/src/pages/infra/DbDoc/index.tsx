import { exportHtmlApi } from '@/services/infra/dbDoc';
import { useEffect, useState } from 'react';

import Iframe from '@/components/Iframe';

const DbDoc: React.FC = () => {
  const [docHtml, setDocHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    initBlobURL();
  }, []);

  const initBlobURL = async () => {
    const res = await exportHtmlApi();
    let blob = new Blob([res], { type: 'text/html' });
    let blobUrl = window.URL.createObjectURL(blob);
    setDocHtml(blobUrl);
    setLoading(false);
  };

  return <Iframe src={docHtml} loading={loading} />;
};

export default DbDoc;
