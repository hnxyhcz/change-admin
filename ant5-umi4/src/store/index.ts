import { createContext } from 'react';
import DictStore from './DictStore';

// export * from './DictStore';
export * from './InitialStore';

export default class AppStore {
  dictStore: DictStore;

  constructor() {
    this.dictStore = new DictStore();
  }
}

export const AppContext = createContext<AppStore>({} as AppStore);
