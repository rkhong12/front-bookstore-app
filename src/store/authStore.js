import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const authStore = create(
  persist(
    immer((set, get) => ({
      token: null,
      userId: null,
      userName: null,
      userRole: null,

      isAuthenticated: () => !!get().token,
      getUserRole: () => get().userRole,

      setLogin: ({ token, userId, userName, userRole }) =>
        set((state) => {
          state.token = token;
          state.userId = userId;
          state.userName = userName;
          state.userRole = userRole;
        }),

      setToken: (token) =>
        set((state) => {
          state.token = token;
        }),

      getToken: () => get().token,

      clearAuth: () =>
        set((state) => {
          state.token = null;
          state.userId = null;
          state.userName = null;
          state.userRole = null;
        }),
    })),
    {
      name: "auth-info",
      partialize: (state) => ({
        token: state.token,
        userId: state.userId,
        userName: state.userName,
        userRole: state.userRole,
      }),
    }
  )
);
