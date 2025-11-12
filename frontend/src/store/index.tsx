"use client";

import { configureStore } from "@reduxjs/toolkit";
import { Provider as ReduxProviderBase } from "react-redux";
import authReducer from "./authSlice";
import uiReducer from "./uiSlice";
import { ReactNode } from "react";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer, // 👈 added
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <ReduxProviderBase store={store}>{children}</ReduxProviderBase>;
}
