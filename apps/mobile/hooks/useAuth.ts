import React from 'react';
import AuthContext, { ContextState } from '../screens/auth/AuthContext';

const useAuth = (): ContextState => React.useContext(AuthContext);

export default useAuth;
