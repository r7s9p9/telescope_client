import {
  useQueryCompareMessages,
  useQueryReadMessages,
  useQueryRoomList,
} from "../api/api";
import { useCallback, useEffect } from "react";
import { RoomId } from "../../types";
import { StoreState, useStore } from "./StoreProvider";
import { MessageDates, MessageListType, MessageType } from "../api/api.schema";
import { useInterval } from "../lib/useInterval";

const roomsItemCountForInitialLoading = 20 as const;
const roomsReloadInterval = 10000 as const;

const chatItemCountForInitialLoading = 10 as const;
const chatCompareInterval = 7000 as const;
const chatUpdateInterval = 3000 as const;

const chat = (
  setStore: StoreState["setStore"],
  roomId: RoomId,
  data?: MessageListType,
) => {
  const create = () => {
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

  const update = (messages: MessageType[]) => {
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
  return { create, update, flagAsBad };
};

export function useChat(roomId: RoomId) {
  const { store, setStore } = useStore();

  const storedChat = store.chats?.[roomId];
  const storedMessages = storedChat?.messages;

  const queryRead = useQueryReadMessages();
  const queryCompare = useQueryCompareMessages();

  const loadOlderMessages = useCallback(
    async (min: number, max: number) => {
      const { success, data } = await queryRead
        .run()
        .indexRange(roomId, { min, max });

      const chatAction = chat(setStore, roomId, data);

      if (success && data) {
        if (!storedMessages) chatAction.create();
        if (storedMessages) {
          const messages = storedMessages.concat(data.messages || []);
          chatAction.update(messages);
        }
      }
      if (!success) chatAction.flagAsBad();
    },
    [queryRead, storedChat],
  );

  const loadNewerMessages = useCallback(async () => {
    if (storedMessages) {
      const range = {
        min: storedMessages[0].created + 1,
      };
      const { success, data } = await queryRead
        .run()
        .createdRange(roomId, range);

      const chatAction = chat(setStore, roomId, data);

      if (success) {
        const messages = (data?.messages || []).concat(storedMessages);
        chatAction.update(messages);
      }
      if (!success) chatAction.flagAsBad();
    }
  }, [queryRead, storedChat]);

  const compareMessages = useCallback(async () => {
    if (storedMessages) {
      const toCompare: MessageDates[] = [];
      for (const message of storedMessages) {
        if (message.modified) {
          toCompare.push({
            created: message.created,
            modified: message.modified,
          });
        } else {
          toCompare.push({ created: message.created });
        }
      }
      const { success, data } = await queryCompare.run(roomId, toCompare);
      const chatAction = chat(setStore, roomId, data);
      if (success) {
        if (data.isEqual) return;

        let messages: MessageType[] = [];
        if (data.toRemove) {
          for (let i = 0; i < storedMessages.length; i++) {
            if (!data.toRemove.includes(storedMessages[i].created)) {
              messages.push(storedMessages[i]);
            }
          }
        } else {
          messages = [...storedMessages];
        }
        if (data.toUpdate) {
          for (let i = 0; i < storedMessages.length; i++) {
            for (const message of data.toUpdate) {
              if (message.created === storedMessages[i].created) {
                messages[i] = message;
              }
            }
          }
        }
        chatAction.update(messages);
      }
      if (!success) chatAction.flagAsBad();
    }
  }, [queryCompare, storedMessages]);

  // Initial load data if no chat in store
  useEffect(() => {
    if (!storedChat) loadOlderMessages(0, chatItemCountForInitialLoading);
  }, [roomId]);

  // Compare existing messages
  useInterval(() => compareMessages(), chatCompareInterval);

  // Update messages
  useInterval(() => loadNewerMessages(), chatUpdateInterval);

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

  return { loadOlderMessages, setScrollPosition };
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
    if (!storedRooms) queryAtFirst(roomsItemCountForInitialLoading);
  }, []);

  // Reload rooms
  useInterval(() => {
    if (storedRooms?.rooms) queryAtFirst(storedRooms.rooms.length);
  }, roomsReloadInterval);

  return { queryAtFirst, queryRange };
}
