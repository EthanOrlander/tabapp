import React from 'react';
import UpdateAuthStateContext, { ContextState } from './UpdateAuthStateContext';

const useUpdateAuthState = (): ContextState => React.useContext(UpdateAuthStateContext);

export default useUpdateAuthState;
