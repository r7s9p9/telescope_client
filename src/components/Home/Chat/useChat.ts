import { useCallback, useEffect, useRef, useState } from "react";
import {
  useQueryCompareMessages,
  useQueryReadMessages,
  useQueryRoomInfo,
} from "../../../shared/api/api.model";
import { RoomId } from "../../../shared/api/api.schema";
import { MessageDates, MessageType } from "../../../shared/api/api.schema";
import { useInterval } from "../../../shared/hooks/useInterval";
import { useStore } from "../../../shared/store/store";
import { debounce } from "../../../shared/lib/debounce";
import { useParams } from "react-router-dom";
import { getRandomArray, getRandomBoolean } from "../../../shared/lib/random";
import { useNotify } from "../../../shared/features/Notification/Notification";
import { langError } from "../../../locales/en";

const INFO_UPDATE_INTERVAL = 10000 as const;

const CHAT_UPDATE_INTERVAL = 4000 as const;
const CHAT_COMPARE_INTERVAL = 8000 as const;

const CHAT_ITEM_COUNT_FOR_INITIAL_LOADING = 20 as const;
const ITEM_COUNT_TO_FURTHER_LOADING = 10 as const;

const RECENT_MESSAGES_COUNT_FOR_MANDATORY_COMPARISON = 20 as const;
const MESSAGES_COUNT_FOR_OPTIONAL_COMPARISON = 20 as const;
const CHANCE_OF_OPTIONAL_COMPARISON = 0.25 as const;

const THRESHOLD_FOR_SHOW_SCROLL_BUTTON = 200 as const;
const THRESHOLD_FOR_HIDE_SCROLL_BUTTON = 50 as const;

const DEBOUNCE_SCROLL_INTERVAL = 200 as const;
const SCROLL_HEIGHT_TO_TRIGGER_FURTHER_LOADING = 0.75 as const;

const getScrollPosition = (target: HTMLElement) => {
  return target.scrollHeight - (target.offsetHeight + target.scrollTop);
};

const setScrollPosition = (target: HTMLElement, scrollBottom: number) => {
  if (!isFinite(scrollBottom)) {
    console.error("scrollBottom must be finite number");
    return;
  }
  target.scrollTop = target.scrollHeight - (target.offsetHeight + scrollBottom);
};

const resetScrollPosition = (target: HTMLElement) => {
  target.scrollTop = target.scrollHeight;
  return target.scrollHeight;
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

export function useLoadNewerMessages() {
  const queryRead = useQueryReadMessages();
  const { roomId } = useParams();
  const storeAction = useStore().chat(roomId as RoomId);
  const storedChat = storeAction.read();
  const storedMessages = storedChat?.messages;
  const notify = useNotify();

  const loadNewerMessages = useCallback(async () => {
    if (storedMessages) {
      const createdRange = {
        min: storedMessages[0].created + 1,
      };
      const { success, response, requestError, responseError } =
        await queryRead.run({
          roomId: roomId as RoomId,
          createdRange,
        });

      if (!success) {
        notify.show.error(
          requestError || responseError || langError.UNKNOWN_MESSAGE,
        );
        return;
      }

      if (response.messages) {
        storeAction.update().data({
          allCount: response.allCount ? response.allCount : 0,
          //messages: response.messages.reverse().concat(storedMessages),
          messages: response.messages.concat(storedMessages),
          isNewMessages: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryRead, roomId, storedMessages, storeAction]);

  return { run: loadNewerMessages, isLoading: queryRead.isLoading };
}

function useLoadOlderMessages() {
  const queryRead = useQueryReadMessages();
  const { roomId } = useParams();
  const storeAction = useStore().chat(roomId as RoomId);
  const storedChat = storeAction.read();
  const storedMessages = storedChat?.messages;
  const notify = useNotify();

  const loadOlderMessages = useCallback(
    async (min: number, max: number) => {
      const { success, response, requestError, responseError } =
        await queryRead.run({
          roomId: roomId as RoomId,
          indexRange: { min, max },
        });

      if (!success) {
        notify.show.error(
          requestError || responseError || langError.UNKNOWN_MESSAGE,
        );
        return;
      }

      if (response.messages) {
        storeAction.update().data({
          allCount: response.allCount ? response.allCount : 0,
          messages: (storedMessages || []).concat(response.messages),
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryRead, roomId, storedMessages, storeAction],
  );

  return { run: loadOlderMessages };
}

function useCompareMessages() {
  const queryCompare = useQueryCompareMessages();
  const { roomId } = useParams();
  const storeAction = useStore().chat(roomId as RoomId);
  const storedChat = storeAction.read();
  const storedMessages = storedChat?.messages;
  const notify = useNotify();

  const compareMessages = useCallback(async () => {
    if (storedMessages) {
      const { success, response, requestError, responseError } =
        await queryCompare.run({
          roomId: roomId as RoomId,
          toCompare: compareGenerator(storedMessages),
        });

      if (!success) {
        notify.show.error(
          requestError || responseError || langError.UNKNOWN_MESSAGE,
        );
        return;
      }

      const { isUpdateNeeded, updatedMessages } = compareUpdater(
        storedMessages,
        response.isEqual,
        response.toUpdate,
        response.toRemove,
      );
      if (isUpdateNeeded) {
        storeAction.update().data({
          allCount: response.toRemove?.length
            ? storedChat.allCount - response.toRemove.length
            : storedChat.allCount,
          messages: updatedMessages,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCompare, storedMessages, roomId, storeAction, storedChat?.allCount]);

  return { run: compareMessages, isLoading: queryCompare.isLoading };
}

export function useChat() {
  const { roomId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isRestoredScroll, setIsRestoredScroll] = useState(false);
  const [isShowScrollToBottom, setIsShowScrollToBottom] = useState(false);

  const messagesRef = useRef<HTMLUListElement>(null);

  const storeAction = useStore().chat(roomId as RoomId);
  const storedChat = storeAction.read();
  const storedMessages = storedChat?.messages;
  const isAllLoaded =
    storedMessages && storedMessages.length === storedChat.allCount;

  const loadOlderMessages = useLoadOlderMessages();
  const loadNewerMessages = useLoadNewerMessages();
  const compareMessages = useCompareMessages();

  useEffect(() => {
    // Initial load data if no chat in store
    if (!storedChat) {
      const initStoredChat = () => {
        storeAction.create({
          allCount: 0,
          scrollPosition: 0,
          isFirstLoad: true,
          editable: { isExist: false },
        });
      };
      initStoredChat();
      loadOlderMessages.run(0, CHAT_ITEM_COUNT_FOR_INITIAL_LOADING - 1);
    }
  }, [storedChat, storeAction, loadOlderMessages]);

  // Update messages
  useInterval(() => {
    if (!compareMessages.isLoading) loadNewerMessages.run();
  }, CHAT_UPDATE_INTERVAL);

  // Compare existing messages
  useInterval(() => {
    if (!loadNewerMessages.isLoading) compareMessages.run();
  }, CHAT_COMPARE_INTERVAL);

  const onScrollLoader = useCallback(async () => {
    if (!isLoading && !isAllLoaded && storedMessages && storedChat.allCount) {
      setIsLoading(true);
      const min = storedMessages.length;
      const max =
        storedChat.allCount < min + ITEM_COUNT_TO_FURTHER_LOADING
          ? storedChat.allCount
          : min + ITEM_COUNT_TO_FURTHER_LOADING;
      await loadOlderMessages.run(min, max);
      setIsLoading(false);
    }
  }, [
    isLoading,
    isAllLoaded,
    storedMessages,
    storedChat?.allCount,
    loadOlderMessages,
  ]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      const target = e.nativeEvent.target as HTMLElement;
      const scrollPercent = 1 - target.scrollTop / target.scrollHeight;
      const isLoadNeeded =
        scrollPercent >= SCROLL_HEIGHT_TO_TRIGGER_FURTHER_LOADING;
      if (isLoadNeeded) onScrollLoader();

      // Save scroll position
      const scrollPosition = getScrollPosition(target);
      storeAction.update().scrollPosition(scrollPosition);

      // Scroll down button logic
      if (scrollPosition >= THRESHOLD_FOR_SHOW_SCROLL_BUTTON) {
        setIsShowScrollToBottom(true);
      }
      if (scrollPosition <= THRESHOLD_FOR_HIDE_SCROLL_BUTTON) {
        setIsShowScrollToBottom(false);
        storeAction.update().data({ isNewMessages: false });
      }
    },
    [storeAction, onScrollLoader],
  );

  const debouncedHandleScroll = debounce(
    handleScroll,
    DEBOUNCE_SCROLL_INTERVAL,
  );

  // Restoring scroll position
  useEffect(() => {
    if (storedChat && messagesRef.current && !isRestoredScroll) {
      if (storedChat.isFirstLoad) {
        // Chat is loaded for the first time, the scroll position has not been set before
        const scrollPosition = resetScrollPosition(messagesRef.current);
        storeAction.update().scrollPosition(scrollPosition);
        storeAction.update().data({ isFirstLoad: false });
      } else {
        // The chat has already been loaded and the scroll position was saved before
        setScrollPosition(messagesRef.current, storedChat.scrollPosition);
      }
      setIsRestoredScroll(true);
    }
  }, [messagesRef, storedChat, storeAction, isRestoredScroll]);

  // Scroll down the list if a new message appears and the button is not shown
  useEffect(() => {
    if (
      messagesRef.current &&
      !isShowScrollToBottom &&
      storedChat?.isNewMessages
    ) {
      const scrollPosition = resetScrollPosition(messagesRef.current);
      storeAction.update().scrollPosition(scrollPosition);
      setIsShowScrollToBottom(false);
      storeAction.update().data({ isNewMessages: false });
    }
  }, [
    storeAction,
    storedChat?.isNewMessages,
    messagesRef,
    isShowScrollToBottom,
  ]);

  // Handle click on ScrollBottom button
  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      setIsShowScrollToBottom(false);
      storeAction.update().data({ isNewMessages: false });
      resetScrollPosition(messagesRef.current);
    }
  }, [messagesRef, storeAction]);

  return {
    roomId: roomId as RoomId,
    messagesRef: messagesRef,
    messages: storedMessages,
    isInitialLoading: !storedMessages,
    debouncedHandleScroll,
    isUnreadMessage: storedChat?.isNewMessages,
    isShowScrollToBottom,
    scrollToBottom,
  };
}

export function useLoadInfo() {
  const queryInfo = useQueryRoomInfo();
  const { roomId } = useParams();
  const storeAction = useStore().chat(roomId as RoomId);
  const notify = useNotify();

  const run = useCallback(async () => {
    const { success, response, requestError, responseError } =
      await queryInfo.run({ roomId: roomId as RoomId });

    if (!success) {
      if (requestError) notify.show.error(requestError);
      if (responseError) notify.show.error(responseError);
      if (!requestError && !responseError)
        notify.show.error(langError.UNKNOWN_MESSAGE);
    }

    if (success) {
      storeAction.update().data({ info: response.info });
    }

    // if (!success) storeAction.flagAsBad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryInfo, roomId, storeAction]);

  return {
    run,
    roomId: roomId as RoomId,
    storedInfo: storeAction.read()?.info,
  };
}

export function useInfo() {
  const { run, roomId, storedInfo } = useLoadInfo();

  useEffect(() => {
    // Initial load data if no chat in store
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update info
  useInterval(() => run(), INFO_UPDATE_INTERVAL);

  return {
    run,
    roomId,
    info: {
      ...storedInfo,
      isInitialLoading: !storedInfo,
    },
  };
}

export function useEdit() {
  const { roomId } = useParams();
  const storeAction = useStore().chat(roomId as RoomId);
  const editable = storeAction.read()?.editable;

  const onEdit = (message: MessageType) => {
    storeAction.update().editable(true, message);
  };

  const closeEdit = () => {
    storeAction.update().editable(false);
  };
  return { onEdit, closeEdit, editable };
}
