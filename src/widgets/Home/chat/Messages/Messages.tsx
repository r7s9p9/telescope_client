import { ReactNode } from "react";
import {
  IconArrowDown,
  IconCopy,
  IconEdit,
  IconMessageReply,
  IconTrash,
} from "@tabler/icons-react";
import { useMenuContext } from "../../../ContextMenu/ContextMenu";
import { useChat, useDelete, useEdit } from "../useChat";
import { formatDate } from "../../../../shared/lib/date";
import { MessageType } from "../../../../shared/api/api.schema";
import { getRandomBoolean, getRandomInt } from "../../../../shared/lib/random";
import React from "react";
import { Button } from "../../../../shared/ui/Button/Button";
import { Text } from "../../../../shared/ui/Text/Text";

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
      className="relative overflow-y-scroll will-change-scroll overscroll-none scroll-auto grow w-full p-4 flex flex-col bg-slate-200"
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
          isShowScrollToBottom || isUnreadMessage ? "" : "translateY(200%)",
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

export function Message({ message }: { message: MessageType }) {
  const editAction = useEdit();
  const deleteAction = useDelete();
  const { openMenu, closeMenu } = useMenuContext();

  const text = message.content.text;
  const date = formatDate().message(message.created, message.modified);
  if (message.authorId === "service") {
    return (
      <li className="flex flex-col h-fit p-2 mt-4 self-center bg-slate-50 rounded-xl ring-2 ring-slate-200 select-none">
        <Text size="sm" font="default">
          {text}
        </Text>
        <Text size="sm" font="thin" className="text-center">
          {date}
        </Text>
      </li>
    );
  }

  const isYourMessage = message.authorId === "self";

  function onContextHandler(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    openMenu(
      e,
      <MessageContextMenu
        closeMenu={closeMenu}
        message={message}
        isYourMessage={isYourMessage}
        deleteAction={deleteAction}
        editAction={editAction}
      />,
    );
  }

  return (
    <li
      onContextMenu={(e) => onContextHandler(e)}
      className={`${isYourMessage ? "self-end" : "self-start"} flex flex-col mt-4 p-2 bg-slate-50 ring-slate-400 rounded-xl shadow w-fit max-w-full select-none`}
    >
      <div className="flex flex-row justify-between gap-4 min-w-32 max-w-full text-sm">
        <Text size="sm" font="default" className="text-green-600">
          {isYourMessage ? "You" : message.username}
        </Text>
        <Text size="sm" font="thin">
          {date}
        </Text>
      </div>
      <Text size="sm" font="default" className="text-justify break-all">
        {text}
      </Text>
    </li>
  );
}

function MessageContextMenu({
  closeMenu,
  message,
  isYourMessage,
  deleteAction,
  editAction,
}: {
  closeMenu: ReturnType<typeof Function>;
  message: MessageType;
  isYourMessage: boolean;
  deleteAction: {
    onDelete: (created: number) => Promise<{
      success: boolean;
    }>;
    isLoading: boolean;
  };
  editAction: {
    onEdit: (message: MessageType) => void;
  };
}) {
  async function onClickHandler(type: "reply" | "edit" | "copy" | "delete") {
    // if (type === "reply") {
    // }
    if (type === "edit") {
      editAction.onEdit(message);
      closeMenu();
    }
    if (type === "copy") {
      navigator.clipboard.writeText(message.content.text);
      closeMenu();
    }
    if (type === "delete") {
      const success = await deleteAction.onDelete(message.created);
      if (success) closeMenu();
    }
  }

  return (
    <div className="bg-slate-100 flex flex-col m-2 rounded-lg shadow-xl">
      <Button
        title="Reply"
        className="rounded-t-lg"
        onClick={() => onClickHandler("reply")}
      >
        <div className="flex flex-row w-32 h-8 items-center">
          <IconMessageReply
            className="text-slate-600 w-12"
            strokeWidth="2"
            size={18}
          />
          <Text size="md" font="default" className="text-slate-600">
            Reply
          </Text>
        </div>
      </Button>
      {isYourMessage && (
        <Button title="Edit" onClick={() => onClickHandler("edit")}>
          <div className="flex flex-row w-32 h-8 items-center">
            <IconEdit
              className="text-slate-600 w-12"
              strokeWidth="2"
              size={18}
            />
            <Text size="md" font="default" className="text-slate-600">
              Edit
            </Text>
          </div>
        </Button>
      )}
      <Button title="Copy" onClick={() => onClickHandler("copy")}>
        <div className="flex flex-row w-32 h-8 items-center">
          <IconCopy className="text-slate-600 w-12" strokeWidth="2" size={18} />
          <Text size="md" font="default" className="text-slate-600">
            Copy
          </Text>
        </div>
      </Button>
      {isYourMessage && (
        <Button
          title="Delete"
          className="rounded-b-lg"
          onClick={() => onClickHandler("delete")}
        >
          <div className="flex flex-row w-32 h-8 items-center">
            <IconTrash
              className="text-red-600 w-12"
              strokeWidth="2"
              size={18}
            />
            <Text size="md" font="default" className="text-red-600">
              Delete
            </Text>
          </div>
        </Button>
      )}
    </div>
  );
}
