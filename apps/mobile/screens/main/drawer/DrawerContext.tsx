import React from 'react';

export type ContextState = {
  openDrawer: () => void;
};

const contextDefaultValues: ContextState = {
  openDrawer: () => {},
};

const DrawerContext = React.createContext<ContextState>(contextDefaultValues);

export const DrawerProvider = DrawerContext.Provider;

export default DrawerContext;
