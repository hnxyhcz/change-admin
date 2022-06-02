import { createContext, createElement } from 'react';
import AppStore from '@/store/AppStore';

export const AppContext = createContext<AppStore>({} as AppStore);

const createContextCleaner = <T>(...contexts: React.Context<T>[]) => {
  return ({ children }: any) => {
    return contexts.reduce((buf, ctx) => {
      return createElement(ctx.Provider, { value: undefined as any }, buf)
    }, children)
  }
}

export const ContextCleaner = createContextCleaner(AppContext);
