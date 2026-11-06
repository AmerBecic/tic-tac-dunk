import { createStore } from 'zustand/vanilla';

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
  return createStore<UserStore>()((set) => ({
    ...initState,
    setUsername: (username) => set({ username }),
    setFavouriteTeam: (favouriteTeam) => set({ favouriteTeam }),
    setTheme: (theme) => set({ theme }),
  }));
};
