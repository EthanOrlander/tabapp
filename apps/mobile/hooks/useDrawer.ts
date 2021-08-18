import React from 'react';
import DrawerContext, { ContextState } from '../screens/main/drawer/DrawerContext';

const useDrawer = (): ContextState => React.useContext(DrawerContext);

export default useDrawer;
