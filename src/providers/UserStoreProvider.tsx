'use client';

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
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

  useEffect(() => {
    const fallbackTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';

    store.persist.setOptions({
      merge: (persistedState, currentState) => {
        const saved = persistedState as Partial<UserStore> | undefined;
        return {
          ...currentState,
          username:
            typeof saved?.username === 'string'
              ? saved.username.slice(0, 20)
              : `Guest${crypto.getRandomValues(new Uint32Array(1))[0] % 100000000}`,
          favouriteTeam:
            typeof saved?.favouriteTeam === 'string'
              ? saved.favouriteTeam
              : null,
          theme:
            saved?.theme === 'light' || saved?.theme === 'dark'
              ? saved.theme
              : fallbackTheme,
        };
      },
    });

    void store.persist.rehydrate();
    if (!store.persist.hasHydrated()) {
      const merge = store.persist.getOptions().merge!;
      store.setState(merge(undefined, store.getState()));
    } else {
      store.setState({});
    }
    document.documentElement.dataset.theme = store.getState().theme;

    return store.subscribe((state, previousState) => {
      if (state.theme !== previousState.theme) {
        document.documentElement.dataset.theme = state.theme;
      }
    });
  }, [store]);

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
