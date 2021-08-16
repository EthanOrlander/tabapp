import React, { useContext } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';

export type ContextState = {
  updateAuthState: (state: string) => void;
  cognitoUser: CognitoUser | undefined;
  setCognitoUser: (user: CognitoUser) => void;
  username: string | undefined;
  setUsername: (username: string) => void;
};

const contextDefaultValues: ContextState = {
  updateAuthState: (state) => {},
  cognitoUser: undefined,
  setCognitoUser: (user) => {},
  username: undefined,
  setUsername: (username) => {},
};

const AuthContext = React.createContext<ContextState>(contextDefaultValues);
export const AuthProvider = AuthContext.Provider;
export default AuthContext;
