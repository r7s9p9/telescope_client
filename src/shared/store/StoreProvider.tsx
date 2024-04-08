import { ReactNode, createContext, useContext, useState } from "react";
import { StoreType } from "../api/api.types";

type StoreStateType = {
  store: StoreType;
  setStore: React.Dispatch<React.SetStateAction<StoreType>>;
};

const StoreState = {
  store: { rooms: undefined, chats: undefined },
  setStore: () => {},
};

const StoreContext = createContext<StoreStateType>(StoreState);

export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreType>(StoreState["store"]);
  console.log(store.chats);
  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  );
}
