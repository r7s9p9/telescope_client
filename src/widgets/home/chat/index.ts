import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useQueryCompareMessages,
  useQueryReadMessages,
} from "../../../shared/api/api";
import { RoomId } from "../../../types";
import { MessageDates, MessageType } from "../../../shared/api/api.schema";
import { useInterval } from "../../../shared/lib/useInterval";
import { store } from "../../../shared/store/store";
import { debounce } from "../../../shared/lib/debounce";
import { checkRoomId } from "../../../shared/lib/uuid";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../../constants";

const chatItemCountForInitialLoading = 10 as const;
const chatCompareInterval = 7000 as const;
const chatUpdateInterval = 3000 as const;

const debounceScrollInterval = 250 as const;
const scrollHeightToTriggerFurtherLoading = 0.75 as const;

const itemCountToFurtherLoading = 2 as const;

export function useChat() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const scrollRestoredRoomId = useRef<RoomId>();
  const messagesRef = useRef<HTMLUListElement>(null);

  const queryRead = useQueryReadMessages();
  const queryCompare = useQueryCompareMessages();

  const storeAction = store().chat(roomId as RoomId);
  const storedChat = store()
    .chat(roomId as RoomId)
    .read();
  const storedMessages = storedChat?.messages;

  const isAllLoaded =
    storedMessages && storedMessages.length === storedChat.allCount;

  const loadOlderMessages = useCallback(
    async (min: number, max: number) => {
      const { success, data } = await queryRead
        .run()
        .indexRange(roomId as RoomId, { min, max });

      if (success && data) {
        if (!storedMessages) storeAction.create(data);
        if (storedMessages) {
          const messages = storedMessages.concat(data.messages || []);
          storeAction.update(data, messages);
        }
      }
      if (!success) storeAction.flagAsBad();
    },
    [queryRead],
  );

  const loadNewerMessages = useCallback(async () => {
    if (storedMessages) {
      const range = {
        min: storedMessages[0].created + 1,
      };
      const { success, data } = await queryRead
        .run()
        .createdRange(roomId as RoomId, range);

      if (success) {
        const messages = (data?.messages || []).concat(storedMessages);
        storeAction.update(data, messages);
      }
      if (!success) storeAction.flagAsBad();
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
      const { success, data } = await queryCompare.run(
        roomId as RoomId,
        toCompare,
      );
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
        storeAction.update(data, messages);
      }
      if (!success) storeAction.flagAsBad();
    }
  }, [queryCompare, storedMessages]);

  useEffect(() => {
    // Initial load data if no chat in store
    if (!storedChat) loadOlderMessages(0, chatItemCountForInitialLoading);
    // wrong roomId protection
    if (roomId && !checkRoomId(roomId)) navigate(routes.home.path);
  }, [roomId, storedChat]);

  // Compare existing messages
  useInterval(() => compareMessages(), chatCompareInterval);

  // Update messages
  useInterval(() => loadNewerMessages(), chatUpdateInterval);

  const onScrollLoader = async () => {
    if (!isLoading && !isAllLoaded && storedMessages && storedChat.allCount) {
      setIsLoading(true);
      const min = storedMessages.length;
      const max =
        storedChat.allCount < min + itemCountToFurtherLoading
          ? storedChat.allCount
          : min + itemCountToFurtherLoading;
      await loadOlderMessages(min, max);
      setIsLoading(false);
    }
  };

  const isScrollRestored = !(
    scrollRestoredRoomId.current !== roomId &&
    messagesRef.current &&
    storedChat
  );
  if (!isScrollRestored) {
    const bottomScroll = storeAction.scrollPosition().read();
    messagesRef.current.scrollTop =
      messagesRef.current.scrollHeight - bottomScroll;
    scrollRestoredRoomId.current = roomId as RoomId;
  }

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      const target = e.nativeEvent.target as HTMLElement;
      const scrollPercent = 1 - target.scrollTop / target.scrollHeight;
      const isLoadNeeded = scrollPercent >= scrollHeightToTriggerFurtherLoading;
      if (isLoadNeeded) onScrollLoader();

      // Set scroll position
      const scrollBottom = target.scrollHeight - target.scrollTop;
      if (scrollBottom !== storedChat?.bottomScrollPosition) {
        storeAction.scrollPosition().update(scrollBottom);
      }
    },
    [isAllLoaded, isLoading, roomId],
  );

  const debouncedHandleScroll = useMemo(
    () => debounce(handleScroll, debounceScrollInterval),
    [handleScroll, roomId],
  );

  return {
    messages: storedMessages,
    messagesRef,
    debouncedHandleScroll,
  };
}
