import { createContext, useContext } from 'react';

import { User } from './types';

const userContext = createContext<User | undefined>(undefined);
export const UserProvider = userContext.Provider;
export const useUser = () => useContext(userContext);
