import {
  IconArrowDown,
  IconArrowDownCircle,
  IconSend2,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { MessageType } from "../../../shared/api/api.schema";
import { formatDate, isSameDay } from "../../../shared/lib/date";
import React from "react";
import { useChat } from "./useChat";

export function Chat() {
  const {
    messagesRef,
    messages,
    debouncedHandleScroll,
    isShowScrollToBottom,
    scrollToBottom,
  } = useChat();

  if (!messages) {
    return (
      <Wrapper>
        <Bar />
        <Spinner />
        <Send />
      </Wrapper>
    );
  }

  console.log(isShowScrollToBottom);

  const readyMessages: JSX.Element[] = [];
  let prevMessageCreated;
  let prevMessageAuthorId;

  for (let i = messages.length - 1; i >= 0; i--) {
    const isSameCreatedDay =
      prevMessageCreated && isSameDay(messages[i].created, prevMessageCreated);
    if (!isSameCreatedDay) {
      prevMessageCreated = messages[i].created;
      readyMessages.push(
        <DateBubble
          key={`date-${messages[i].created}`}
          date={messages[i].created}
        />,
      );
    }
    let isAvatar = false;
    if (
      messages[i].authorId !== "service" &&
      prevMessageAuthorId !== messages[i].authorId
    ) {
      prevMessageAuthorId = messages[i].authorId;
      isAvatar = true;
    }

    readyMessages.push(
      <Message
        key={`message-${messages[i].created}`}
        message={messages[i]}
        isAvatar={isAvatar}
      />,
    );
  }

  return (
    <Wrapper>
      <Bar />
      <Messages
        listRef={messagesRef}
        isShowScrollToBottom={isShowScrollToBottom}
        scrollToBottom={scrollToBottom}
        onScroll={debouncedHandleScroll}
      >
        {readyMessages}
      </Messages>
      <Send />
    </Wrapper>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full h-full flex flex-col bg-slate-200">
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <div className="relative grow flex justify-center items-center ">
      <div className="p-32 absolute rounded-full border-slate-300 border-x-2 animate-spin"></div>
    </div>
  );
}

function DateBubble({ date }: { date: number }) {
  const str = formatDate().bubble(date);
  return (
    <li className="sticky text-center top-0 w-44 mt-4 px-4 py-1 bg-slate-50 self-center rounded-full ring-2 ring-slate-200 text-md font-light">
      {str}
    </li>
  );
}

function Messages({
  children,
  listRef,
  isShowScrollToBottom,
  scrollToBottom,
  onScroll,
}: {
  children: ReactNode;
  listRef: React.RefObject<HTMLUListElement>;
  isShowScrollToBottom: boolean;
  scrollToBottom: ReturnType<typeof Function>;
  onScroll: (e: React.UIEvent<HTMLElement>) => void;
}) {
  return (
    <>
      <ul
        ref={listRef}
        onScroll={onScroll}
        className="relative overflow-y-scroll will-change-scroll overscroll-none scroll-auto relative grow w-full p-4 flex flex-col bg-slate-200"
      >
        {children}
      </ul>
      <button
        disabled={!isShowScrollToBottom}
        onClick={() => scrollToBottom()}
        style={{ transform: isShowScrollToBottom ? "" : "translateY(200%)" }}
        className="absolute bottom-24 right-4 bg-slate-50 text-slate-600 rounded-full p-2 hover:bg-slate-100 duration-300 ease-in-out"
      >
        <IconArrowDown strokeWidth="1" size={32} />
      </button>
    </>
  );
}

function Message({
  message,
  isAvatar,
}: {
  message: MessageType;
  isAvatar: boolean;
}) {
  const text = message.content.text;
  const date = formatDate().message(message.created, message.modified);
  if (message.authorId === "service") {
    return (
      <li className="flex flex-col p-2 mt-4 self-center bg-slate-50 rounded-xl ring-2 ring-slate-200">
        <p className="text-sm text-justify">{text}</p>
        <p className="text-slate-400 text-sm text-center">{date}</p>
      </li>
    );
  }
  const usernameFirstLetter = message.username && message.username.charAt(0);
  const isYourMessage = message.authorId === ("self" as const);

  return (
    <li className="flex flex-row mt-4 w-fit">
      {isAvatar && (
        <div className="text-lg text-blue-600 flex items-center justify-center uppercase size-8 bg-slate-50 ring-2 ring-slate-200 rounded-full">
          {usernameFirstLetter}
        </div>
      )}
      <div
        className={`${isAvatar ? "ml-4" : "ml-12"} flex flex-col h-fit w-fit p-2 bg-slate-50 ring-2 ring-slate-200 rounded-xl`}
      >
        <div className="flex flex-row justify-between gap-4">
          <p className="text-green-500 text-sm">
            {isYourMessage ? "You" : message.username}
          </p>
          <p className="text-slate-400 text-sm">{date}</p>
        </div>
        <p className="text-sm text-justify">{text}</p>
      </div>
    </li>
  );
}

function Bar() {
  return (
    <div className="shrink-0 w-full h-16 border-x-2 border-slate-100 bg-slate-50"></div>
  );
}

function Send() {
  return (
    <div className="shrink-0 relative p-4 w-full flex items-center border-x-2 border-slate-100 bg-slate-50">
      <input
        placeholder="Send message..."
        className="h-12 grow pl-4 pr-1 outline-none font-light text-gray-800 text-xl bg-slate-100 ring-2 ring-slate-200 rounded-xl focus:ring-slate-300 focus:bg-slate-50 duration-300 ease-in-out"
      />
      <SendButton />
    </div>
  );
}

function SendButton() {
  return (
    <div className="absolute right-6 flex items-center">
      <button className="p-2 rounded-full hover:bg-slate-300 duration-300 ease-in-out">
        <IconSend2 className="text-slate-400" size={18} />
      </button>
    </div>
  );
}
