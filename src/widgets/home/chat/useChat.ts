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
import { getRandomArray, getRandomBoolean } from "../../../shared/lib/random";

const CHAT_UPDATE_INTERVAL = 2000 as const;
const CHAT_COMPARE_INTERVAL = 7000 as const;

const CHAT_ITEM_COUNT_FOR_INITIAL_LOADING = 20 as const;
const ITEM_COUNT_TO_FURTHER_LOADING = 10 as const;

const RECENT_MESSAGES_COUNT_FOR_MANDATORY_COMPARISON = 20 as const;
const MESSAGES_COUNT_FOR_OPTIONAL_COMPARISON = 20 as const;
const CHANCE_OF_OPTIONAL_COMPARISON = 0.25 as const;

const THRESHOLD_FOR_SHOW_SCROLL_BUTTON = 750 as const;
const THRESHOLD_FOR_HIDE_SCROLL_BUTTON = 250 as const;

const DEBOUNCE_SCROLL_INTERVAL = 250 as const;
const SCROLL_HEIGHT_TO_TRIGGER_FURTHER_LOADING = 0.75 as const;

const calcScrollBottom = (target: HTMLElement) => {
  return target.scrollHeight - (target.offsetHeight + target.scrollTop);
};

const calcScrollTop = (target: HTMLElement, scrollBottom: number) => {
  if (!isFinite(scrollBottom)) {
    console.error("scrollBottom must be finite number");
    return 0;
  }
  return target.scrollHeight - (target.offsetHeight + scrollBottom);
};

const compareGenerator = (storedMessages: MessageDates[]) => {
  if (storedMessages.length === 0) {
    console.error("the array must have at least one element");
    return [];
  }

  function datesAssembler(
    index: number,
    dates: MessageDates[],
    result: MessageDates[],
  ) {
    if (dates[index].modified) {
      result.push({
        created: dates[index].created,
        modified: dates[index].modified,
      });
    } else {
      result.push({ created: dates[index].created });
    }
  }

  // Mandatory Comparison
  const result: MessageDates[] = [];
  for (
    let i = 0;
    i < RECENT_MESSAGES_COUNT_FOR_MANDATORY_COMPARISON &&
    i < storedMessages.length;
    i++
  ) {
    datesAssembler(i, storedMessages, result);
  }

  // Optional Comparison
  const isOptionalCompare = getRandomBoolean(CHANCE_OF_OPTIONAL_COMPARISON);
  if (
    isOptionalCompare &&
    storedMessages.length > RECENT_MESSAGES_COUNT_FOR_MANDATORY_COMPARISON
  ) {
    let count =
      storedMessages.length - RECENT_MESSAGES_COUNT_FOR_MANDATORY_COMPARISON;
    if (count > MESSAGES_COUNT_FOR_OPTIONAL_COMPARISON) {
      count = MESSAGES_COUNT_FOR_OPTIONAL_COMPARISON;
    }
    const minIndex = RECENT_MESSAGES_COUNT_FOR_MANDATORY_COMPARISON;
    const maxIndex = storedMessages.length - 1;
    const targetIndices = getRandomArray(minIndex, maxIndex, count);

    for (const index of targetIndices) {
      datesAssembler(index, storedMessages, result);
    }
  }

  return result;
};

const compareUpdater = (
  storedMessages: MessageType[],
  isEqual: boolean,
  toUpdate?: MessageType[],
  toRemove?: MessageType["created"][],
) => {
  if (isEqual) return { isUpdateNeeded: false as const };
  if (!toRemove && !toUpdate) return { isUpdateNeeded: false as const };

  let updatedMessages: MessageType[] = [];

  if (toRemove) {
    for (let i = 0; i < storedMessages.length; i++) {
      if (!toRemove.includes(storedMessages[i].created)) {
        updatedMessages.push(storedMessages[i]);
      }
    }
  } else {
    updatedMessages = [...storedMessages];
  }

  if (toUpdate) {
    for (let i = 0; i < storedMessages.length; i++) {
      for (const message of toUpdate) {
        if (message.created === storedMessages[i].created) {
          updatedMessages[i] = message;
        }
      }
    }
  }
  return { isUpdateNeeded: true as const, updatedMessages };
};

export function useChat() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isRestoredScroll, setIsRestoredScroll] = useState(false);
  const [isShowScrollToBottom, setIsShowScrollToBottom] = useState(false);
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

  const useLoadOlderMessages = useCallback(
    async (min: number, max: number, storedMessages?: MessageType[]) => {
      const { success, data } = await queryRead
        .run()
        .indexRange(roomId as RoomId, { min, max });

      if (success && data) {
        if (!storedMessages) storeAction.create(data);
        if (storedMessages) {
          const messages = storedMessages.concat(data.messages || []);
          storeAction.update().messages(data, messages);
        }
      }
      if (!success) storeAction.flagAsBad();
    },
    [queryRead, roomId, storedMessages],
  );

  const useLoadNewerMessages = useCallback(
    async (storedMessages: MessageType[]) => {
      const range = {
        min: storedMessages[0].created + 1,
      };
      const { success, data } = await queryRead
        .run()
        .createdRange(roomId as RoomId, range);

      if (success && data.messages) {
        const messages = (data?.messages || []).concat(storedMessages);
        storeAction.update().messages(data, messages);
        scrollToBottom(); // bad idea
      }
      if (!success) {
        storeAction.flagAsBad();
        console.error("queryRead !success");
      }
    },
    [queryRead, roomId, storedMessages],
  );

  const useCompareMessages = useCallback(
    async (storedMessages: MessageType[]) => {
      const { success, data } = await queryCompare.run(
        roomId as RoomId,
        compareGenerator(storedMessages),
      );
      if (success) {
        const { isUpdateNeeded, updatedMessages } = compareUpdater(
          storedMessages,
          data.isEqual,
          data.toUpdate,
          data.toRemove,
        );
        if (isUpdateNeeded) {
          storeAction.update().messages(data, updatedMessages);
        }
      }
      if (!success) {
        storeAction.flagAsBad();
        console.error("queryCompare !success");
      }
    },
    [queryCompare, storedMessages, compareGenerator],
  );

  useEffect(() => {
    // wrong roomId protection
    if (roomId && !checkRoomId(roomId)) navigate(routes.home.path);
    // Initial load data if no chat in store
    if (!storedChat)
      useLoadOlderMessages(0, CHAT_ITEM_COUNT_FOR_INITIAL_LOADING - 1);
  }, [roomId, storedChat]);

  // Compare existing messages
  useInterval(() => {
    if (storedMessages) useCompareMessages(storedMessages);
  }, CHAT_COMPARE_INTERVAL);

  // Update messages
  useInterval(() => {
    if (storedMessages) useLoadNewerMessages(storedMessages);
  }, CHAT_UPDATE_INTERVAL);

  const onScrollLoader = async () => {
    if (!isLoading && !isAllLoaded && storedMessages && storedChat.allCount) {
      setIsLoading(true);
      const min = storedMessages.length;
      const max =
        storedChat.allCount < min + ITEM_COUNT_TO_FURTHER_LOADING
          ? storedChat.allCount
          : min + ITEM_COUNT_TO_FURTHER_LOADING;
      await useLoadOlderMessages(min, max);
      setIsLoading(false);
    }
  };

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      const target = e.nativeEvent.target as HTMLElement;
      const scrollPercent = 1 - target.scrollTop / target.scrollHeight;
      const isLoadNeeded =
        scrollPercent >= SCROLL_HEIGHT_TO_TRIGGER_FURTHER_LOADING;
      if (isLoadNeeded) onScrollLoader();

      // Showing scroll to bottom button
      const scrollBottom = calcScrollBottom(target);
      if (scrollBottom >= THRESHOLD_FOR_SHOW_SCROLL_BUTTON) {
        setIsShowScrollToBottom(true);
      }
      if (scrollBottom <= THRESHOLD_FOR_HIDE_SCROLL_BUTTON) {
        setIsShowScrollToBottom(false);
      }

      // Save scroll position (calc offset from bottom)
      const scrollPosition =
        target.scrollHeight - (target.scrollTop + target.offsetHeight);

      if (scrollPosition !== storedChat?.scrollPosition) {
        storeAction.update().scrollPosition(scrollPosition);
      }
    },
    [isAllLoaded, isLoading, roomId, storedMessages],
  );

  const debouncedHandleScroll = useMemo(
    () => debounce(handleScroll, DEBOUNCE_SCROLL_INTERVAL),
    [handleScroll, roomId],
  );

  // Restoring scroll
  useEffect(() => {
    if (storedChat && messagesRef.current && !isRestoredScroll) {
      const target = messagesRef.current;
      if (storedChat.scrollPosition !== 0) {
        target.scrollTop = calcScrollTop(target, storedChat.scrollPosition);
      } else {
        // First chat opening
        target.scrollTop = target.scrollHeight;
      }
      setIsRestoredScroll(true);
    }
  }, [messagesRef, storedChat]);

  // For click on ScrollBottom button
  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      setIsShowScrollToBottom(false);
    }
  }, [messagesRef.current]);

  return {
    messages: storedMessages,
    messagesRef,
    debouncedHandleScroll,
    isShowScrollToBottom,
    scrollToBottom,
  };
}
