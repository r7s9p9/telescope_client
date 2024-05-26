import { ReactNode } from "react";
import { MessageType } from "../../../shared/api/api.schema";
import { isSameDay } from "../../../shared/lib/date";
import { useChat, useInfo } from "./useChat";
import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar/TopBar";
import {
  Message,
  Messages,
  DateBubble,
  MessagesSkeleton,
} from "./Messages/Messages";
import { BottomBarWrapper } from "./BottomBar/BottomBar";

const noMessagesElement = (
  <li className="flex flex-col h-fit p-2 mt-4 self-center bg-slate-50 rounded-xl ring-2 ring-slate-200 select-none">
    <p className="text-sm text-justify">There are no messages here yet...</p>
  </li>
);

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="relative w-full h-full flex flex-col bg-slate-200">
        {children}
      </div>
      <Outlet />
    </>
  );
}

function messageParser(
  items: ReturnType<typeof useChat>["messages"],
  dateBubble: (created: number) => JSX.Element,
  message: (content: MessageType) => JSX.Element,
) {
  if (!items || items.length === 0) return { isEmpty: true as const };

  const readyMessages: JSX.Element[] = [];
  let prevMessageCreated;

  for (let i = items.length - 1; i >= 0; i--) {
    const isSameCreatedDay =
      prevMessageCreated && isSameDay(items[i].created, prevMessageCreated);
    if (!isSameCreatedDay) {
      prevMessageCreated = items[i].created;
      readyMessages.push(dateBubble(items[i].created));
    }
    readyMessages.push(message(items[i]));
  }

  return { isEmpty: false as const, readyMessages };
}

export function Chat() {
  const chat = useChat();
  const info = useInfo();

  if (chat?.isInitialLoading) {
    return (
      <Wrapper>
        <TopBar data={info} />
        <MessagesSkeleton />
        <BottomBarWrapper data={info} />
      </Wrapper>
    );
  }

  const messageElement = (content: MessageType) => {
    return <Message key={`message-${content.created}`} message={content} />;
  };
  const dateBubbleElement = (created: number) => {
    return <DateBubble key={`date-${created}`} date={created} />;
  };

  const { readyMessages, isEmpty } = messageParser(
    chat.messages,
    dateBubbleElement,
    messageElement,
  );

  return (
    <Wrapper>
      <TopBar data={info} />
      <Messages chat={chat}>
        {isEmpty ? noMessagesElement : readyMessages}
      </Messages>
      <BottomBarWrapper data={info} />
    </Wrapper>
  );
}
