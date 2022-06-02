import { useContext } from 'react';
import { AppContext } from '@/shared';

export function useAppStore() {
  return useContext(AppContext);
}
