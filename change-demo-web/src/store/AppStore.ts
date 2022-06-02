import SystemStore from './SystemStore';

export default class AppStore {
  systemStore: SystemStore;

  constructor() {
    this.systemStore = new SystemStore();
  }
}
