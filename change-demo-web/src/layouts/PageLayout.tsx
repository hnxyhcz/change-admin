import { AppContext } from '@/shared';
import AppStore from '@/store/AppStore';
import React, { useMemo } from 'react';

export const PageLayout: React.FC = (props) => {
  const appStore = useMemo(() => new AppStore(), []);

  return (
    <AppContext.Provider value={appStore}>
      {props.children}
    </AppContext.Provider>
  );
};

export default PageLayout;