import { useCallback, useEffect, useRef, useState } from "react";
import {
  useQueryCompareMessages,
  useQueryDeleteMessage,
  useQueryReadMessages,
  useQueryRoomInfo,
  useQuerySendMessage,
  useQueryUpdateMessage,
} from "../../../shared/api/api";
import { RoomId } from "../../../types";
import {
  MessageDates,
  MessageType,
  SendMessageFormType,
  sendMessageFormSchema,
} from "../../../shared/api/api.schema";
import { useInterval } from "../../../shared/lib/useInterval";
import { store } from "../../../shared/store/store";
import { debounce } from "../../../shared/lib/debounce";
import { checkRoomId } from "../../../shared/lib/uuid";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../../constants";
import { getRandomArray, getRandomBoolean } from "../../../shared/lib/random";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  const storeAction = store().chat(roomId as RoomId);
  const storedChat = storeAction.read();
  const storedMessages = storedChat?.messages?.items;

  const loadNewerMessages = useCallback(async () => {
    if (storedMessages) {
      const range = {
        min: storedMessages[0].created + 1,
      };
      const { success, data } = await queryRead
        .run()
        .createdRange(roomId as RoomId, range);

      if (success && data.messages) {
        storeAction.update().data({
          messages: {
            allCount: data.allCount ? data.allCount : 0,
            items: data.messages.concat(storedMessages),
          },
          isNewMessages: true,
        });
      }
      if (!success) {
        storeAction.flagAsBad();
        console.error("queryRead !success");
      }
    }
  }, [queryRead, roomId, storedMessages, storeAction]);

  return { run: loadNewerMessages };
}

function useLoadOlderMessages() {
  const queryRead = useQueryReadMessages();
  const { roomId } = useParams();
  const storeAction = store().chat(roomId as RoomId);
  const storedChat = storeAction.read();
  const storedMessages = storedChat?.messages?.items;

  const loadOlderMessages = useCallback(
    async (min: number, max: number) => {
      const { success, data } = await queryRead
        .run()
        .indexRange(roomId as RoomId, { min, max });

      if (success && data) {
        storeAction.update().data({
          messages: {
            allCount: data.allCount ? data.allCount : 0,
            items: (storedMessages || []).concat(data.messages || []),
          },
        });
      }
      if (!success) storeAction.flagAsBad();
    },
    [queryRead, roomId, storedMessages, storeAction],
  );

  return { run: loadOlderMessages };
}

function useCompareMessages() {
  const queryCompare = useQueryCompareMessages();
  const { roomId } = useParams();
  const storeAction = store().chat(roomId as RoomId);
  const storedChat = storeAction.read();
  const storedMessages = storedChat?.messages?.items;

  const compareMessages = useCallback(async () => {
    if (storedMessages) {
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
          storeAction.update().data({
            messages: {
              allCount: storedChat.messages?.allCount,
              items: updatedMessages,
            },
          });
        }
      }
      if (!success) {
        storeAction.flagAsBad();
        console.error("queryCompare !success");
      }
    }
  }, [
    queryCompare,
    storedMessages,
    roomId,
    storeAction,
    storedChat?.messages?.allCount,
  ]);

  return { run: compareMessages };
}

export function useLoadInfo() {
  const queryInfo = useQueryRoomInfo();
  const { roomId } = useParams();
  const storeAction = store().chat(roomId as RoomId);

  const loadInfo = useCallback(async () => {
    const { success, data } = await queryInfo.run(roomId as RoomId);

    if (success) {
      storeAction.update().data({ info: data.info });
    }

    if (!success) storeAction.flagAsBad();
  }, [queryInfo, roomId, storeAction]);

  return { run: loadInfo };
}

export function useChat() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isRestoredScroll, setIsRestoredScroll] = useState(false);
  const [isShowScrollToBottom, setIsShowScrollToBottom] = useState(false);

  const messagesRef = useRef<HTMLUListElement>(null);

  const storeAction = store().chat(roomId as RoomId);
  const storedChat = storeAction.read();
  const storedMessages = storedChat?.messages?.items;
  const storedMessagesAllCount = storedChat?.messages?.allCount;
  const isAllLoaded =
    storedMessages && storedMessages.length === storedMessagesAllCount;

  const loadOlderMessages = useLoadOlderMessages();
  const loadNewerMessages = useLoadNewerMessages();
  const compareMessages = useCompareMessages();

  // Update messages
  useInterval(() => loadNewerMessages.run(), CHAT_UPDATE_INTERVAL);

  // Compare existing messages
  useInterval(() => compareMessages.run(), CHAT_COMPARE_INTERVAL);

  // Initial actions
  useEffect(() => {
    // wrong roomId protection
    if (roomId && !checkRoomId(roomId)) navigate(routes.home.path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Initial load data if no chat in store
    if (!storedChat) {
      const initStoredChat = () => {
        storeAction.create({
          messages: { allCount: 0 },
          scrollPosition: 0,
          isFirstLoad: true,
          editable: { isExist: false },
        });
      };
      initStoredChat();
      loadOlderMessages.run(0, CHAT_ITEM_COUNT_FOR_INITIAL_LOADING - 1);
    }
  }, [storedChat, storeAction, loadOlderMessages]);

  const onScrollLoader = useCallback(async () => {
    if (
      !isLoading &&
      !isAllLoaded &&
      storedMessages &&
      storedMessagesAllCount
    ) {
      setIsLoading(true);
      const min = storedMessages.length;
      const max =
        storedMessagesAllCount < min + ITEM_COUNT_TO_FURTHER_LOADING
          ? storedMessagesAllCount
          : min + ITEM_COUNT_TO_FURTHER_LOADING;
      await loadOlderMessages.run(min, max);
      setIsLoading(false);
    }
  }, [
    isLoading,
    isAllLoaded,
    storedMessages,
    storedMessagesAllCount,
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
    messagesRef: messagesRef,
    messages: storedMessages,
    isInitialLoading: !storedMessages,
    debouncedHandleScroll,
    isUnreadMessage: storedChat?.isNewMessages,
    isShowScrollToBottom,
    scrollToBottom,
  };
}

export function useInfo() {
  const { roomId } = useParams();
  const storedInfo = store()
    .chat(roomId as RoomId)
    .read()?.info;
  const loadInfo = useLoadInfo();

  useEffect(() => {
    // Initial load data if no chat in store
    if (!storedInfo) {
      loadInfo.run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedInfo]);

  // Update info
  useInterval(() => loadInfo.run(), INFO_UPDATE_INTERVAL);

  return {
    roomId: roomId as RoomId,
    info: {
      ...storedInfo,
      isInitialLoading: !storedInfo,
    },
  };
}

export function useSend() {
  const { register, reset, handleSubmit } = useForm<SendMessageFormType>({
    resolver: zodResolver(sendMessageFormSchema),
  });
  const { roomId } = useParams();
  const loadNewerMessages = useLoadNewerMessages();

  const storeAction = store().chat(roomId as RoomId);
  const storedChat = store()
    .chat(roomId as RoomId)
    .read();
  const storedMessages = storedChat?.messages?.items;
  const storedMessagesAllCount = storedChat?.messages?.allCount;

  const querySend = useQuerySendMessage();
  const queryUpdate = useQueryUpdateMessage();

  const editable = storedChat?.editable;

  const onSubmit = handleSubmit(async (data) => {
    if (
      data.text &&
      !querySend.isLoading &&
      !queryUpdate.isLoading &&
      storedMessages
    ) {
      // If message edited
      if (editable?.isExist) {
        const result = await queryUpdate.run(
          roomId as RoomId,
          editable.message.created,
          data,
        );
        if (result.success && result.access) {
          const updatedMessages = storedMessages.map((message) => {
            if (message.created === editable.message.created) {
              return {
                ...message,
                content: data,
                modified: result.dates.modified,
              };
            }
            return message;
          }) as MessageType[];

          storeAction.update().data({
            ...storedChat,
            messages: {
              allCount: storedMessagesAllCount ? storedMessagesAllCount : 0,
              items: updatedMessages,
            },
          });
          storeAction.update().editable(false);
        }
      } else {
        // If new message writed
        const result = await querySend.run(roomId as RoomId, data);
        if (result.success) {
          loadNewerMessages.run();
        }
      }
      reset();
    }
  });

  return {
    register,
    onSubmit,
    isLoading: querySend.isLoading || queryUpdate.isLoading,
  };
}

export function useEdit() {
  const { roomId } = useParams();
  const storeAction = store().chat(roomId as RoomId);
  const storedChat = store()
    .chat(roomId as RoomId)
    .read();

  const editable = storedChat?.editable;

  const onEdit = (message: MessageType) => {
    storeAction.update().editable(true, message);
  };

  const closeEdit = () => {
    storeAction.update().editable(false);
  };
  return { onEdit, closeEdit, editable };
}

export function useDelete() {
  const { roomId } = useParams();
  const storeAction = store().chat(roomId as RoomId);
  const storedChat = store()
    .chat(roomId as RoomId)
    .read();
  const storedMessages = storedChat?.messages?.items;
  const query = useQueryDeleteMessage();

  const onDelete = async (created: MessageType["created"]) => {
    const { success } = await query.run(roomId as RoomId, created);
    if (success && storedMessages) {
      const messages = storedMessages?.filter(
        (message) => message.created !== created,
      );
      storeAction.update().data({
        ...storedChat,
        messages: { ...storedChat.messages, items: messages },
      });
    }
    return { success };
  };
  return { onDelete, isLoading: query.isLoading };
}
