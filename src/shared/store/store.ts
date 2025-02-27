import { RoomId } from "../api/api.schema";
import { useStoreProvider } from "./StoreProvider";
import { MessageType, ReadRoomsResponseType } from "../api/api.schema";
import { StoreType } from "./types";

export const useStore = () => {
  const { store, setStore } = useStoreProvider();

  const chat = (roomId: RoomId) => {
    const read = () => {
      return store.chats?.[roomId];
    };

    const create = (data: Partial<StoreType["chats"][RoomId]>) => {
      setStore((store) => ({
        ...store,
        chats: {
          ...store.chats,
          [roomId]: {
            ...data,
          },
        },
      }));
    };

    const update = () => {
      const editable = (isExist: boolean, message?: MessageType) => {
        setStore((store) => ({
          ...store,
          chats: {
            ...store.chats,
            [roomId]: {
              ...store.chats?.[roomId],
              editable: message ? { isExist, message } : { isExist },
            },
          },
        }));
      };

      const data = (data: Partial<StoreType["chats"][RoomId]>) => {
        setStore((store) => ({
          ...store,
          chats: {
            ...store.chats,
            [roomId]: {
              ...store.chats?.[roomId],
              ...data,
            },
          },
        }));
      };

      const scrollPosition = (px: number) => {
        setStore((store) => ({
          ...store,
          chats: {
            ...store.chats,
            [roomId]: {
              ...store?.chats?.[roomId],
              scrollPosition: px,
            },
          },
        }));
      };

      return { editable, data, scrollPosition };
    };

    return { read, create, update };
  };

  const rooms = () => {
    const read = () => {
      return store.rooms as StoreType["rooms"];
    };

    const update = (data: Partial<ReadRoomsResponseType>) => {
      setStore((store) => ({
        ...store,
        rooms: {
          ...store.rooms,
          ...data,
        },
      }));
    };

    return { read, update };
  };

  return { chat, rooms };
};
