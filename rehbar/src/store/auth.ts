import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export enum Role {
  ADMIN = "admin",
  LEARNER = "user",
}

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  getIsAdmin: () => boolean;
  getIsLearner: () => boolean;
  getRole: () => Role;
}

interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  display_name: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      setToken: (token) => set({ token }),
      removeToken: () => set({ token: null }),
      user: null,
      setUser: (user) => set({ user }),
      getIsAdmin: () => get().user?.role === Role.ADMIN,
      getIsLearner: () => get().user?.role === Role.LEARNER,
      getRole: () => get().user?.role as Role,
    }),
    {
      name: "auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);
