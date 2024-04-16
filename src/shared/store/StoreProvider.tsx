import { ReactNode, createContext, useContext, useState } from "react";
import { StoreState, StoreType } from "./types";

const storeInit = {
  store: { rooms: undefined, chats: undefined },
  setStore: () => {},
};

const StoreContext = createContext<StoreState>(storeInit);

export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreType>(storeInit["store"]);
  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  );
}
