import React from 'react';

export type ContextState = (state: string) => void;

const contextDefaultValues: ContextState = () => null;

const UpdateAuthStateContext = React.createContext<ContextState>(contextDefaultValues);

export const UpdateAuthStateProvider = UpdateAuthStateContext.Provider;

export default UpdateAuthStateContext;
