import { ReactNode, createContext, useContext, useRef, useState } from "react";
import { CallbackType, StoreState, StoreType } from "./types";

const storeInit = {
  store: { rooms: undefined, chats: undefined },
  setStore: () => {},
};

const callbackInit = {
  reloadRooms: () => {},
};

const StoreContext = createContext<StoreState>(storeInit);
const CallbackContext = createContext(callbackInit);

export const useStore = () => useContext(StoreContext);
export const useCallbackStore = () => useContext(CallbackContext);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreType>(storeInit["store"]);
  const callbackStore = useRef<CallbackType>(callbackInit);

  return (
    <StoreContext.Provider value={{ store, setStore }}>
      <CallbackContext.Provider value={callbackStore.current}>
        {children}
      </CallbackContext.Provider>
    </StoreContext.Provider>
  );
}
