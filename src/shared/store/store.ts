import { useQueryRoomList } from "../api/api";
import { useCallback, useEffect } from "react";
import { RoomId } from "../../types";
import { useStore } from "./StoreProvider";
import { MessageListType, MessageType } from "../api/api.schema";
import { useInterval } from "../lib/useInterval";

const roomsItemCountForInitialLoading = 20 as const;
const roomsReloadInterval = 10000 as const;

export const store = () => {
  const chat = (roomId: RoomId) => {
    const { store, setStore } = useStore();

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
            isEmpty: data?.allCount === 0,
            allCount: data?.allCount,
            messages: data?.messages,
            bottomScrollPosition: 0 as const,
          },
        },
      }));
    };

    const update = (data: MessageListType, messages: MessageType[]) => {
      setStore((store) => ({
        ...store,
        chats: {
          ...store.chats,
          [roomId]: {
            ...store?.chats?.[roomId],
            success: true as const,
            access: data?.access,
            isEmpty: data?.allCount === 0,
            allCount: data?.allCount,
            messages: messages,
          },
        },
      }));
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

  return { chat };
};

export function useRooms() {
  const { store, setStore } = useStore();
  const storedRooms = store.rooms?.data;

  const query = useQueryRoomList();

  const queryAtFirst = useCallback(
    async (max: number) => {
      const { success, data } = await query.run({ min: 0 as const, max });
      if (success && data)
        setStore((store) => ({
          ...store,
          rooms: { data, success: true as const },
        }));
      if (!success)
        setStore((store) => ({
          ...store,
          rooms: {
            ...store.rooms,
            success: false as const,
            error: "Rooms no success!",
          },
        }));
    },
    [query, store],
  );

  const queryRange = useCallback(
    async (min: number, max: number) => {
      const { success, data } = await query.run({
        min,
        max,
      });
      if (success && data?.rooms && storedRooms?.rooms) {
        if (storedRooms.allCount !== data.allCount) {
          await queryAtFirst(max);
          return;
        }
        if (storedRooms.allCount === data.allCount) {
          for (let i = 0; i < storedRooms.allCount; i++) {
            if (
              storedRooms.rooms[i + min] &&
              storedRooms.rooms[i + min].roomId !== data.rooms[i].roomId
            ) {
              await queryAtFirst(max);
              return;
            }
          }
          setStore((store) => ({
            ...store,
            rooms: {
              success: true as const,
              data: {
                success: true as const,
                allCount: data.allCount,
                dev: data.dev,
                rooms: (storedRooms.rooms || []).concat(data.rooms || []),
              },
            },
          }));
        }
      }
      if (!success)
        setStore((store) => ({
          ...store,
          rooms: {
            ...store.rooms,
            success: false as const,
            error: "ROOMS NO SUCCESS" as const,
          },
        }));
    },
    [query, store],
  );

  // Initial load data
  useEffect(() => {
    if (!storedRooms) queryAtFirst(roomsItemCountForInitialLoading);
  }, []);

  // Reload rooms
  useInterval(() => {
    if (storedRooms?.rooms) queryAtFirst(storedRooms.rooms.length);
  }, roomsReloadInterval);

  return { queryAtFirst, queryRange };
}
