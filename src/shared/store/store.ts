import { RoomId } from "../../types";
import { useStore } from "./StoreProvider";
import { MessageListType, MessageType, RoomsType } from "../api/api.schema";

export type StoreActionType = ReturnType<typeof store>;

export const store = () => {
  const { store, setStore } = useStore();

  const chat = (roomId: RoomId) => {
    const read = () => {
      return store.chats?.[roomId];
    };

    const create = (data?: MessageListType) => {
      setStore((store) => ({
        ...store,
        chats: {
          ...store.chats,
          [roomId]: {
            ...data,
            scrollPosition: 0 as const,
            selected: { isSelected: false, created: 0 },
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

      const messages = (messages: MessageType[]) => {
        setStore((store) => ({
          ...store,
          chats: {
            ...store.chats,
            [roomId]: {
              ...store.chats?.[roomId],
              messages: messages,
            },
          },
        }));
      };

      const data = (data: MessageListType) => {
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

      return { editable, data, messages, scrollPosition };
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
      return store.rooms;
    };

    const update = (data: RoomsType) => {
      setStore((store) => ({
        ...store,
        rooms: data,
      }));
    };

    return { read, update };
  };

  return { chat, rooms };
};
