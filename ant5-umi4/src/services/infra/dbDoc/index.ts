import { useAxios } from '@/shared/useAxios';

const request = useAxios();

// 导出Html
export const exportHtmlApi = () => {
  return request.downloadBlob({ url: '/infra/db-doc/export-html' });
};

// 导出Word
export const exportWordApi = () => {
  return request.downloadBlob({ url: '/infra/db-doc/export-word' });
};

// 导出Markdown
export const exportMarkdownApi = () => {
  return request.downloadBlob({ url: '/infra/db-doc/export-markdown' });
};
