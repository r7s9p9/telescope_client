import { ReactNode } from "react";
import {
  IconArrowDown,
  IconCopy,
  IconEdit,
  IconMessageReply,
  IconTrash,
} from "@tabler/icons-react";
import { useChat } from "../useChat";
import { useMessage } from "./useMessages";
import { formatDate } from "../../../../shared/lib/date";
import { MessageType } from "../../../../shared/api/api.schema";
import { getRandomBoolean, getRandomInt } from "../../../../shared/lib/random";
import React from "react";
import { Text } from "../../../../shared/ui/Text/Text";
import { Paper } from "../../../../shared/ui/Paper/Paper";
import { RoomId } from "../../../../shared/api/api.schema";
import { Button } from "../../../../shared/ui/Button/Button";

export const MessagesSkeleton = React.memo(() => {
  function Skeleton() {
    const width = getRandomInt(4, 8) * 64;
    const height = width / 3;
    const direction = getRandomBoolean();

    return (
      <li
        style={{ height: height, width: width }}
        className={`p-2 mb-4 mx-4 ${direction ? "self-start" : "self-end"} bg-slate-100 opacity-50 rounded-xl ring-2 ring-slate-200 select-none`}
      />
    );
  }

  const count = getRandomInt(4, 8);
  const skeletonItems = Array(count)
    .fill(1)
    .map((_, i) => <Skeleton key={i} />);

  return (
    <ul className="overflow-hidden grow flex flex-col-reverse animate-pulse">
      {skeletonItems}
    </ul>
  );
});

export function DateBubble({ date }: { date: number }) {
  const str = formatDate().bubble(date);
  return (
    <li className="sticky top-0 w-44 mt-4 px-4 py-1 self-center bg-slate-50 rounded-full ring-2 ring-slate-200">
      <Text size="sm" font="bold" className="text-center select-none">
        {str}
      </Text>
    </li>
  );
}

export function Messages({
  children,
  chat,
}: {
  children: ReactNode;
  chat: ReturnType<typeof useChat>;
}) {
  return (
    <ul
      ref={chat.messagesRef}
      onScroll={chat.debouncedHandleScroll}
      className="relative overflow-y-auto will-change-scroll overscroll-none scroll-auto grow w-full p-4 flex flex-col bg-slate-200"
    >
      {children}
      <ScrollButton
        isUnreadMessage={chat?.isUnreadMessage}
        isShowScrollToBottom={chat.isShowScrollToBottom}
        scrollToBottom={chat.scrollToBottom}
      />
    </ul>
  );
}

function ScrollButton({
  isUnreadMessage,
  isShowScrollToBottom,
  scrollToBottom,
}: {
  isUnreadMessage?: boolean;
  isShowScrollToBottom: boolean;
  scrollToBottom: ReturnType<typeof Function>;
}) {
  return (
    <button
      disabled={!isShowScrollToBottom}
      onClick={() => scrollToBottom()}
      style={{
        transform:
          isShowScrollToBottom || isUnreadMessage
            ? ""
            : "translateY(200%) scale(0)",
      }}
      className={`sticky bottom-0 self-end border-2 rounded-full bg-slate-100 text-slate-600 p-2 hover:bg-slate-200 duration-500 ease-in-out`}
    >
      {isUnreadMessage && (
        <div className="absolute top-0 right-0 size-12 rounded-full ring-2 ring-blue-400 animate-pulse" />
      )}
      <IconArrowDown strokeWidth="1" size={32} />
    </button>
  );
}

export function Message({
  roomId,
  message,
}: {
  roomId: RoomId;
  message: MessageType;
}) {
  const { content, onClickMenuHandler, openMenu } = useMessage({
    roomId,
    message,
  });

  if (content.type === "service") {
    return (
      <Paper
        inList
        rounded="xl"
        padding={2}
        className="flex flex-col mt-4 self-center bg-slate-50 ring-2 ring-slate-200 select-none"
      >
        <Text size="sm" font="default">
          {content.text}
        </Text>
        <Text size="sm" font="thin" className="text-center">
          {content.date}
        </Text>
      </Paper>
    );
  }

  function onContextHandler(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    openMenu(
      e,
      <MessageContextMenu
        isYourMessage={content.type === "self"}
        onClickMenuHandler={onClickMenuHandler}
      />,
    );
  }

  return (
    <Paper
      onContextMenu={(e) => onContextHandler(e)}
      inList
      rounded="xl"
      padding={2}
      className={`${content.type === "self" ? "self-end" : "self-start"} flex flex-col mt-4 bg-slate-50 rounded-xl shadow select-none`}
    >
      <div className="flex flex-row justify-between gap-4 min-w-32 max-w-full text-sm">
        <Text size="sm" font="default" className="text-green-600">
          {content.type === "self" ? "You" : content.username}
        </Text>
        <Text size="sm" font="thin">
          {content.date}
        </Text>
      </div>
      <Text size="sm" font="default" className="text-justify break-words">
        {content.text}
      </Text>
    </Paper>
  );
}

function MessageContextMenu({
  isYourMessage,
  onClickMenuHandler,
}: {
  isYourMessage: boolean;
  onClickMenuHandler: ReturnType<typeof useMessage>["onClickMenuHandler"];
}) {
  return (
    <Paper rounded="lg" shadow="md" className="flex flex-col m-2">
      <Button
        title="Reply"
        size="md"
        unstyled
        padding={24}
        className="w-32 hover:bg-slate-200 rounded-t-lg"
        onClick={() => onClickMenuHandler("reply")}
      >
        <>
          <IconMessageReply
            className="text-slate-600"
            strokeWidth="1.5"
            size={18}
          />
          <Text size="md" font="default" className="text-slate-600">
            Reply
          </Text>
        </>
      </Button>
      {isYourMessage && (
        <Button
          title="Edit"
          size="md"
          unstyled
          padding={24}
          className="w-32 hover:bg-slate-200"
          onClick={() => onClickMenuHandler("edit")}
        >
          <>
            <IconEdit className="text-slate-600" strokeWidth="1.5" size={18} />
            <Text size="md" font="default" className="text-slate-600">
              Edit
            </Text>
          </>
        </Button>
      )}
      <Button
        title="Copy"
        size="md"
        unstyled
        padding={24}
        className={`w-32 hover:bg-slate-200 ${isYourMessage ? "" : "rounded-b-lg"}`}
        onClick={() => onClickMenuHandler("copy")}
      >
        <>
          <IconCopy className="text-slate-600" strokeWidth="1.5" size={18} />
          <Text size="md" font="default" className="text-slate-600">
            Copy
          </Text>
        </>
      </Button>
      {isYourMessage && (
        <Button
          title="Delete"
          size="md"
          unstyled
          padding={24}
          className="w-32 hover:bg-slate-200 rounded-b-lg"
          onClick={() => onClickMenuHandler("delete")}
        >
          <>
            <IconTrash className="text-red-600" strokeWidth="1.5" size={18} />
            <Text size="md" font="default" className="text-red-600">
              Delete
            </Text>
          </>
        </Button>
      )}
    </Paper>
  );
}
