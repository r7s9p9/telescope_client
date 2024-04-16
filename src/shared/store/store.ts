import { RoomId } from "../../types";
import { useStore } from "./StoreProvider";
import {
  MessageListType,
  MessageType,
  RoomType,
  RoomsType,
} from "../api/api.schema";

export type StoreActionType = ReturnType<typeof store>;

export const store = () => {
  const { store, setStore } = useStore();

  const chat = (roomId: RoomId) => {
    const read = () => {
      return store?.chats?.[roomId];
    };

    const create = (data?: MessageListType) => {
      setStore((store) => ({
        ...store,
        chats: {
          ...store.chats,
          [roomId]: {
            success: true as const,
            access: data?.access,
            allCount: data?.allCount,
            messages: data?.messages,
            scrollPosition: 0 as const,
          },
        },
      }));
    };

    const update = () => {
      const messages = (
        data: MessageListType,
        updatedMessages: MessageType[],
      ) => {
        setStore((store) => ({
          ...store,
          chats: {
            ...store.chats,
            [roomId]: {
              ...store?.chats?.[roomId],
              success: true as const,
              access: data?.access,
              allCount: data?.allCount,
              messages: updatedMessages,
            },
          },
        }));
      };

      const info = (
        name: RoomType["roomName"],
        type: RoomType["type"],
        userCount: RoomType["userCount"],
      ) => {
        setStore((store) => ({
          ...store,
          chats: {
            ...store.chats,
            [roomId]: {
              ...store?.chats?.[roomId],
              name,
              type,
              userCount,
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

      return { messages, info, scrollPosition };
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
