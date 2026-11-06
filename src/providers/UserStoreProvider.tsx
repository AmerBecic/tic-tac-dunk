'use client';

import { type ReactNode, createContext, useContext, useState } from 'react';
import { useStore } from 'zustand';

import { type UserStore, createUserStore } from '@/stores/userStore';

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(
  undefined
);

export interface UserStoreProviderProps {
  children: ReactNode;
}

export const UserStoreProvider = ({
  children,
}: UserStoreProviderProps): React.JSX.Element => {
  const [store] = useState(() => createUserStore());

  return (
    <UserStoreContext.Provider value={store}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
  const store = useContext(UserStoreContext);

  if (!store) {
    throw new Error('useUserStore must be used within UserStoreProvider');
  }

  return useStore(store, selector);
};
