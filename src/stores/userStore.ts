import { createStore } from 'zustand/vanilla';
import { createJSONStorage, persist } from 'zustand/middleware';

export type UserState = {
  username: string;
  favouriteTeam: string | null;
  theme: 'light' | 'dark';
};

export type UserActions = {
  setUsername: (username: string) => void;
  setFavouriteTeam: (favouriteTeam: string | null) => void;
  setTheme: (theme: UserState['theme']) => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  username: '',
  favouriteTeam: null,
  theme: 'light',
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()(
    persist(
      (set) => ({
        ...initState,
        setUsername: (username) => set({ username }),
        setFavouriteTeam: (favouriteTeam) => set({ favouriteTeam }),
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'user-preferences',
        storage: createJSONStorage<UserState>(() => ({
          getItem: (name) => {
            try {
              return localStorage.getItem(name);
            } catch {
              return null;
            }
          },
          setItem: (name, value) => {
            try {
              localStorage.setItem(name, value);
            } catch {
              // Preferences remain usable in memory when storage is unavailable.
            }
          },
          removeItem: (name) => {
            try {
              localStorage.removeItem(name);
            } catch {
              // Storage may be unavailable in restricted browser contexts.
            }
          },
        })),
        skipHydration: true,
        partialize: ({ username, favouriteTeam, theme }) => ({
          username,
          favouriteTeam,
          theme,
        }),
      }
    )
  );
};
