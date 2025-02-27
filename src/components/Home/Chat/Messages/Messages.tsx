import { ReactNode, memo } from "react";
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
import { useLang } from "../../../../shared/features/LangProvider/LangProvider";

// eslint-disable-next-line react/display-name
export const MessagesSkeleton = memo(() => {
  function Skeleton() {
    const width = getRandomInt(2, 5) * 64;
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
      className="relative overflow-y-auto will-change-scroll overscroll-none scroll-auto grow w-full p-4 flex flex-col border-t-2 border-slate-100 bg-slate-200"
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
  const { content, onClickMenuHandler, openMenu, lang } = useMessage({
    roomId,
    message,
  });

  if (content.type === "service") {
    return (
      <Paper
        inList
        rounded="xl"
        padding={2}
        className="flex flex-col mt-4 md:max-w-[75%] self-center bg-slate-50 ring-2 ring-slate-200 select-none"
      >
        <Text size="sm" font="default" className="text-center break-all">
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
        lang={lang}
      />,
    );
  }

  return (
    <Paper
      onContextMenu={(e) => onContextHandler(e)}
      inList
      rounded="xl"
      padding={2}
      className={`${content.type === "self" ? "self-end" : "self-start"} max-w-[90%] md:max-w-[75%] flex flex-col mt-4 bg-slate-50 select-none`}
    >
      <div className="flex justify-between gap-2">
        <Text size="sm" font="default" className="text-green-600">
          {content.type === "self"
            ? lang.messages.SELF_MESSAGE_TEXT
            : content.username}
        </Text>
        <Text size="sm" font="thin">
          {content.date}
        </Text>
      </div>
      <Text size="sm" font="default">
        {content.text}
      </Text>
    </Paper>
  );
}

function MessageContextMenu({
  isYourMessage,
  onClickMenuHandler,
  lang,
}: {
  isYourMessage: boolean;
  onClickMenuHandler: ReturnType<typeof useMessage>["onClickMenuHandler"];
  lang: ReturnType<typeof useLang>["lang"];
}) {
  const iconProps = {
    size: 18,
    strokeWidth: "1.5",
    className: "text-slate-600 shrink-0",
  };

  const textProps = {
    size: "md" as const,
    font: "default" as const,
    // text-nowrap <- needed to prevent incorrect rendering of the context menu
    // due to incorrect calculation of the width before displaying the menu
    className: "text-slate-600 text-nowrap",
  };

  return (
    <Paper rounded="lg" className="w-fit flex flex-col m-2 shadow-md">
      <Button
        title={lang.messages.CONTEXT_MENU_REPLY_ACTION}
        size="md"
        unstyled
        padding={24}
        className="hover:bg-slate-200 gap-4 rounded-t-lg"
        onClick={() => onClickMenuHandler("reply")}
      >
        <IconMessageReply {...iconProps} />
        <Text {...textProps}>{lang.messages.CONTEXT_MENU_REPLY_ACTION}</Text>
      </Button>
      {isYourMessage && (
        <Button
          title={lang.messages.CONTEXT_MENU_EDIT_ACTION}
          size="md"
          unstyled
          padding={24}
          className="hover:bg-slate-200 gap-4"
          onClick={() => onClickMenuHandler("edit")}
        >
          <IconEdit {...iconProps} />
          <Text {...textProps}>{lang.messages.CONTEXT_MENU_EDIT_ACTION}</Text>
        </Button>
      )}
      <Button
        title={lang.messages.CONTEXT_MENU_COPY_ACTION}
        size="md"
        unstyled
        padding={24}
        className={`hover:bg-slate-200 gap-4 ${isYourMessage ? "" : "rounded-b-lg"}`}
        onClick={() => onClickMenuHandler("copy")}
      >
        <IconCopy {...iconProps} />
        <Text {...textProps}>{lang.messages.CONTEXT_MENU_COPY_ACTION}</Text>
      </Button>
      {isYourMessage && (
        <Button
          title={lang.messages.CONTEXT_MENU_DELETE_ACTION}
          size="md"
          unstyled
          padding={24}
          className="hover:bg-slate-200 gap-4 rounded-b-lg"
          onClick={() => onClickMenuHandler("delete")}
        >
          <IconTrash {...iconProps} className="text-red-600" />
          <Text {...textProps} className="text-red-600">
            {lang.messages.CONTEXT_MENU_DELETE_ACTION}
          </Text>
        </Button>
      )}
    </Paper>
  );
}
