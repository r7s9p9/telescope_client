import { ReactNode, createContext, useContext, useState } from "react";
import { StoreState, StoreType } from "./types";

const storeInit = {
  store: {
    rooms: Object.create(null),
    chats: Object.create(null),
    routesState: {
      sessionRemove: true,
      accountRead: true,
      accountUpdate: true,
      roomGetRoomList: true,
      roomSearch: true,
      roomReadInfo: true,
      roomUpdateInfo: true,
      roomCreate: true,
      roomDelete: true,
      roomLeave: true,
      roomJoin: true,
      messageRead: true,
      messageCompare: true,
      messageSend: true,
      messageUpdate: true,
      messageRemove: true,
    },
  },
  setStore: () => {},
};

const StoreContext = createContext<StoreState>(storeInit);

// eslint-disable-next-line react-refresh/only-export-components
export const useStoreProvider = () => useContext(StoreContext);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreType>(storeInit["store"]);

  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  );
}
