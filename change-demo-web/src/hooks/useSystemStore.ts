import { useAppStore } from './useAppStore';

export function useSystemStore() {
  return useAppStore().systemStore;
}
