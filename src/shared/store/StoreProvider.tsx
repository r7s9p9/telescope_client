import { ReactNode, createContext, useContext, useState } from "react";
import { MessageListType, RoomListType } from "../api/api.schema";
import { RoomId } from "../../types";

type StoreType = {
  rooms?: {
    success: boolean;
    data?: RoomListType;
    error?: string;
  };
  chats?: {
    [key: RoomId]: {
      success: boolean;
      access: boolean;
      isEmpty: boolean;
      allCount: number;
      messages?: MessageListType["messages"];
      bottomScrollPosition: number;
    };
  };
};

export type StoreState = {
  store: StoreType;
  setStore: React.Dispatch<React.SetStateAction<StoreType>>;
};

const StoreState = {
  store: { rooms: undefined, chats: undefined },
  setStore: () => {},
};

const StoreContext = createContext<StoreState>(StoreState);

export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState(StoreState["store"]);
  return (
    <StoreContext.Provider value={{ store, setStore }}>
      {children}
    </StoreContext.Provider>
  );
}
