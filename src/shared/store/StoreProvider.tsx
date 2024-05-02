import { ReactNode, createContext, useContext, useRef, useState } from "react";
import { CallbackType, StoreState, StoreType } from "./types";

const storeInit = {
  store: { rooms: Object.create(null), chats: Object.create(null) },
  setStore: () => {},
};

const callbackInit = {
  reloadRooms: () => {},
  reloadChatInfo: () => {},
  loadNewerMessages: () => {}
};

const StoreContext = createContext<StoreState>(storeInit);
const ActionContext = createContext(callbackInit);

export const useStore = () => useContext(StoreContext);
export const useActionStore = () => useContext(ActionContext);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreType>(storeInit["store"]);
  const actionStore = useRef<CallbackType>(callbackInit);

  return (
    <StoreContext.Provider value={{ store, setStore }}>
      <ActionContext.Provider value={actionStore.current}>
        {children}
      </ActionContext.Provider>
    </StoreContext.Provider>
  );
}
