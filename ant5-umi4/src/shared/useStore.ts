import { useContext } from 'react';
import { AppContext } from '../store';

export function useAppStore() {
  return useContext(AppContext);
}

export function useDictStore() {
  return useAppStore().dictStore;
}
