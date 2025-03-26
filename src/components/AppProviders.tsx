"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SearchProvider } from "@/context/searchContext/searchContext";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <SearchProvider>{children}</SearchProvider>
    </Provider>
  );
}
