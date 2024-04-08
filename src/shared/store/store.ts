import { useQueryReadMessageList } from "../api/api";
import { useCallback } from "react";
import { RoomId } from "../../types";
import { useStore } from "./StoreProvider";

export function useChat() {
    const { store, setStore } = useStore();
  
    const queryRead = useQueryReadMessageList();
  
    const queryReadAction = useCallback(async (roomId: RoomId, range: { min: number, max: number}) => {
      const { success, data } = await queryRead.run(roomId, {
        min: range.min,
        max: range.max,
      });
      if (success && data) {
        if (!store?.chats?.[roomId]) { 
            setStore({...store, chats: { ...store.chats, [roomId]: { data, success: true as const }}});
         }
        if (store?.chats?.[roomId]) {
            setStore({...store, chats: { ...store.chats,  [roomId]:  { data, success: true as const }} });
        }
      }
      if (!success) setStore({ chats: { ...store.chats, [roomId]: {success: false as const, error: "Chat no success!"} }})
    }, [queryRead]);

    return { queryReadAction }
}