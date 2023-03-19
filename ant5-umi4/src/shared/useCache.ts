/**
 * 配置浏览器本地存储的方式，可直接存储对象数组。
 */
import WebStorageCache from 'web-storage-cache';

type CacheType = 'sessionStorage' | 'localStorage';

export const useCache = (storage: CacheType = 'sessionStorage') => {
  const wsCache = new WebStorageCache({ storage });

  return { wsCache };
};
