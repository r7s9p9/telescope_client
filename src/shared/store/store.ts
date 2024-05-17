import { RoomId } from "../../types";
import { useStoreProvider } from "./StoreProvider";
import { MessageType, RoomsType } from "../api/api.schema";
import { StoreType } from "./types";

export type StoreActionType = ReturnType<typeof useStore>;

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

    const flagAsBad = () => {
      setStore((store) => ({
        ...store,
        chats: {
          ...store.chats,
          [roomId]: {
            ...store?.chats?.[roomId],
            success: false as const,
          },
        },
      }));
    };

    return { read, create, update, flagAsBad };
  };

  const rooms = () => {
    const read = () => {
      return store.rooms as StoreType["rooms"];
    };

    const update = (data: Partial<RoomsType>) => {
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

  const routesState = () => {
    const read = (route: keyof StoreType["routesState"]) => {
      return store.routesState[route];
    };

    const update = (data: Partial<StoreType["routesState"]>) => {
      setStore((store) => ({
        ...store,
        routesState: {
          ...store.routesState,
          ...data,
        },
      }));
    };

    return { read, update };
  };

  return { chat, rooms, routesState };
};
