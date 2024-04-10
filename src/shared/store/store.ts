import { useQueryReadMessageList, useQueryRoomList } from "../api/api";
import { useCallback, useEffect } from "react";
import { RoomId } from "../../types";
import { useStore } from "./StoreProvider";

const roomsItemCountForInitialLoading = 20 as const;
const roomsReloadInterval = 10000 as const;

const chatItemCountForInitialLoading = 20 as const;

export function useChat(roomId: RoomId) {
  const { store, setStore } = useStore();
  const storedChat = store.chats?.[roomId];

  const queryRead = useQueryReadMessageList();

  const queryReadRange = useCallback(
    async (range: { min: number; max: number }) => {
      const { success, data } = await queryRead.run(roomId, {
        min: range.min,
        max: range.max,
      });
      if (success && data) {
        if (!storedChat) {
          setStore((store) => ({
            ...store,
            chats: {
              ...store.chats,
              [roomId]: {
                data,
                success: true as const,
                bottomScrollPosition: 0 as const,
              },
            },
          }));
        }
        if (storedChat) {
          setStore((store) => ({
            ...store,
            chats: {
              ...store.chats,
              [roomId]: {
                ...store?.chats?.[roomId],
                data: {
                  ...data,
                  messages: (storedChat.data?.messages || []).concat(
                    data.messages || [],
                  ),
                },
                success: true as const,
              },
            },
          }));
        }
      }
      if (!success)
        setStore((store) => ({
          ...store,
          chats: {
            ...store.chats,
            [roomId]: {
              ...store?.chats?.[roomId],
              success: false as const,
              error: "Chat no success!",
            },
          },
        }));
    },
    [queryRead, store],
  );

  // Initial load data if no chat in store
  useEffect(() => {
    const action = async () => {
      await queryReadRange({ min: 0, max: chatItemCountForInitialLoading });
    };
    if (!storedChat) action();
  }, [roomId]);

  const setScrollPosition = (bottomScrollPosition: number) => {
    setStore((store) => ({
      ...store,
      chats: {
        ...store.chats,
        [roomId]: {
          ...store?.chats?.[roomId],
          bottomScrollPosition: bottomScrollPosition,
        },
      },
    }));
  };

  return { queryReadRange, setScrollPosition };
}

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
    const action = async () => {
      if (!storedRooms) await queryAtFirst(roomsItemCountForInitialLoading);
    };
    action();
  }, []);

  // Reload rooms
  useEffect(() => {
    const interval = setInterval(async () => {
      if (storedRooms?.rooms) {
        await queryAtFirst(storedRooms.rooms.length);
      }
    }, roomsReloadInterval);
    return () => clearInterval(interval);
  }, [storedRooms]);

  return { queryAtFirst, queryRange };
}
