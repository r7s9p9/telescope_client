import { ReactNode } from "react";
import {
  IconArrowDown,
  IconCopy,
  IconEdit,
  IconMessageReply,
  IconTrash,
} from "@tabler/icons-react";
import { useMenuContext } from "../../../context-menu/ContextMenu";
import { useChat, useDelete, useEdit } from "../useChat";
import { formatDate } from "../../../../shared/lib/date";
import { MessageType } from "../../../../shared/api/api.schema";
import { getRandomBoolean, getRandomInt } from "../../../../shared/lib/random";
import React from "react";
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
    <li className="sticky text-center top-0 w-44 mt-4 px-4 py-1 bg-slate-50 self-center rounded-full ring-2 ring-slate-200 text-md font-light select-none">
      {str}
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
    <>
      <ul
        ref={chat.messagesRef}
        onScroll={chat.debouncedHandleScroll}
        className="relative overflow-y-scroll will-change-scroll overscroll-none scroll-auto grow w-full p-4 flex flex-col bg-slate-200"
      >
        {children}
      </ul>
      <ScrollButton
        isUnreadMessage={chat?.isUnreadMessage}
        isShowScrollToBottom={chat.isShowScrollToBottom}
        scrollToBottom={chat.scrollToBottom}
      />
    </>
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
            : "translateY(100%) rotate(90deg) scale(0)",
      }}
      className={`absolute bottom-40 right-4 border-2 rounded-full bg-slate-100 text-slate-600 p-2 hover:bg-slate-200 duration-500 ease-in-out`}
    >
      {isUnreadMessage && (
        <div className="absolute top-0 left-0 size-12 rounded-full ring-2 ring-blue-400 animate-pulse" />
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
        <p className="text-sm text-justify">{text}</p>
        <p className="text-slate-400 text-sm text-center">{date}</p>
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
        <p className="text-green-500 max-w-full">
          {isYourMessage ? "You" : message.username}
        </p>
        <p className="text-gray-400">{date}</p>
      </div>
      <p className="text-sm text-justify break-all">{text}</p>
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
  function MenuButton({
    type,
  }: {
    type: "reply" | "edit" | "copy" | "delete";
  }) {
    let Icon;
    if (type === "reply") {
      Icon = (
        <IconMessageReply
          className="text-slate-600"
          strokeWidth="2"
          size={18}
        />
      );
    }
    if (type === "edit") {
      Icon = <IconEdit className="text-slate-600" strokeWidth="2" size={18} />;
    }
    if (type === "copy") {
      Icon = <IconCopy className="text-slate-600" strokeWidth="2" size={18} />;
    }
    if (type === "delete") {
      Icon = <IconTrash className="text-red-600" strokeWidth="2" size={18} />;
    }

    return (
      <Button title={type} onClick={() => onClickHandler(type)}>
        <div className="flex flex-row w-32 h-8 items-center">
          <div className="w-12 flex justify-center">{Icon}</div>

          <p
            className={`${type === "delete" ? "text-red-600" : "text-slate-600"} capitalize`}
          >
            {type}
          </p>
        </div>
      </Button>
    );
  }

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
    <div className=" bg-slate-100 flex flex-col m-2 rounded-lg shadow-xl">
      <MenuButton type={"reply"} />
      {isYourMessage && <MenuButton type={"edit"} />}
      <MenuButton type={"copy"} />
      {isYourMessage && <MenuButton type={"delete"} />}
    </div>
  );
}
