import {
  IconArrowDown,
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconInfoCircle,
  IconLogout,
  IconMessageReply,
  IconSend2,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { MessageType } from "../../../shared/api/api.schema";
import { formatDate, isSameDay } from "../../../shared/lib/date";
import React from "react";
import { useChat } from "./useChat";
import { useMenuContext } from "../../context-menu/ContextMenu";
import { UseFormRegister } from "react-hook-form";
import { useQueryLeaveRoom } from "../../../shared/api/api";
import { RoomId } from "../../../types";
import { Outlet, useNavigate } from "react-router-dom";
import { routes } from "../../../constants";
import { useActionStore } from "../../../shared/store/StoreProvider";

function messageParser(items: ReturnType<typeof useChat>["messages"]["items"], dateBubble: (created: number) => JSX.Element, message: (content: MessageType) => JSX.Element) {
  if (!items || items.length === 0) return { isEmpty: true as const }

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

  return { isEmpty: false as const, readyMessages}
}

export function Chat() {
  const {
    roomId,
    info,
    messages,
    debouncedHandleScroll,
    isUnreadMessage,
    isShowScrollToBottom,
    scrollToBottom,
    useSend,
    useDelete,
    useEdit,
  } = useChat();

  const sendAction = useSend();
  const deleteAction = useDelete();
  const editAction = useEdit();

  if (messages.isInitialLoading) {
    return (
      <Wrapper>
        <TopBar info={info} roomId={roomId} />
        <Spinner />
        {info.isInitialLoading && <BottomBarSkeleton />}
        {!info.isInitialLoading && !info.isMember && <BottomBarNoMember />}
        {!info.isInitialLoading && info.isMember && (
          <BottomBar sendAction={sendAction} />
        )}
      </Wrapper>
    );
  }

  const messageJSX = (content: MessageType) => { return <Message
  key={`message-${content.created}`}
  message={content}
  deleteAction={deleteAction}
  editAction={editAction}
/> }
  const dateBubbleJSX = (created: number) => {
    return  <DateBubble
    key={`date-${created}`}
    date={created}
  />
  }

  const { readyMessages, isEmpty } = messageParser(messages.items, dateBubbleJSX, messageJSX)

  return (
    <Wrapper>
      <TopBar info={info} roomId={roomId as RoomId} />
      <Messages
        listRef={messages.ref}
        isUnreadMessage={isUnreadMessage}
        isShowScrollToBottom={isShowScrollToBottom}
        scrollToBottom={scrollToBottom}
        onScroll={debouncedHandleScroll}
      >
        {readyMessages}
      </Messages>
      {info.isInitialLoading && <BottomBarSkeleton />}
      {!info.isInitialLoading && !info?.isMember && <BottomBarNoMember />}
      {!info.isInitialLoading && info?.isMember && (
        <BottomBar sendAction={sendAction} />
      )}
    </Wrapper>
  );
}

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
    <li className="sticky text-center top-0 w-44 mt-4 px-4 py-1 bg-slate-50 self-center rounded-full ring-2 ring-slate-200 text-md font-light select-none">
      {str}
    </li>
  );
}

function Messages({
  children,
  listRef,
  isUnreadMessage,
  isShowScrollToBottom,
  scrollToBottom,
  onScroll,
}: {
  children: ReactNode;
  listRef: React.RefObject<HTMLUListElement>;
  isUnreadMessage: boolean;
  isShowScrollToBottom: boolean;
  scrollToBottom: ReturnType<typeof Function>;
  onScroll: (e: React.UIEvent<HTMLElement>) => void;
}) {
  return (
    <>
      <ul
        ref={listRef}
        onScroll={onScroll}
        className="relative overflow-y-scroll will-change-scroll overscroll-none scroll-auto grow w-full p-4 flex flex-col bg-slate-200"
      >
        {children}
      </ul>
      <ScrollButton
        isUnreadMessage={isUnreadMessage}
        isShowScrollToBottom={isShowScrollToBottom}
        scrollToBottom={scrollToBottom}
      />
    </>
  );
}

function ScrollButton({
  isUnreadMessage,
  isShowScrollToBottom,
  scrollToBottom,
}: {
  isUnreadMessage: boolean;
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

function Message({
  message,
  deleteAction,
  editAction,
}: {
  message: MessageType;
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

  const { openMenu, closeMenu } = useMenuContext();

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
  function Button({
    type,
    onClick,
  }: {
    type: "reply" | "edit" | "copy" | "delete";
    onClick: ReturnType<typeof Function>;
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
      <button
        onClick={() => onClick(type)}
        className="flex flex-row items-center gap-4 p-2 px-4 hover:bg-slate-300 duration-100"
      >
        {Icon}
        <p
          className={`${type === "delete" ? "text-red-600" : "text-slate-600"} capitalize`}
        >
          {type}
        </p>
      </button>
    );
  }

  async function onClickHandler(type: "reply" | "edit" | "copy" | "delete") {
    if (type === "reply") {
    }
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
      <Button onClick={onClickHandler} type={"reply"} />
      {isYourMessage && <Button onClick={onClickHandler} type={"edit"} />}
      <Button onClick={onClickHandler} type={"copy"} />
      {isYourMessage && <Button onClick={onClickHandler} type={"delete"} />}
    </div>
  );
}

function TopBar({
  info,
  roomId,
}: {
  info: ReturnType<typeof useChat>["info"];
  roomId: RoomId;
}) {
  const userCountStr = () => {
    if (info.userCount === 0) {
      return <p className="text-sm">no members</p>;
    }
    if (info.userCount === 1) {
      return <p className="text-sm">1 member</p>;
    }
    if (info.userCount && info.userCount > 1) {
      return <p className="text-sm">{info.userCount} members</p>;
    }
  };

  return (
    <div className="shrink-0 w-full h-16 px-4 font-light flex justify-between items-center border-x-2 border-slate-100 bg-slate-50 select-none">
      {!info.isInitialLoading && (
        <>
          <div className="size-10 flex items-center justify-center text-2xl uppercase font-light rounded-full border-2 border-slate-400">
            {info?.name?.at(0)}
          </div>
          <div className="flex flex-col ml-4 grow">
            <p className="text-xl">{info.name}</p>
            <div className="flex flex-row gap-1">
              <p className="text-sm capitalize">{info?.type}</p>
              <p className="text-sm">room,</p>
              {userCountStr()}
            </div>
          </div>
        </>
      )}
      {info.isInitialLoading && <BarSkeleton />}
      <BarMenu roomId={roomId} />
    </div>
  );
}

function BarSkeleton() {
  return (
    <div className="h-14 flex items-center animate-pulse">
      <div className="size-10 bg-slate-200 rounded-full"></div>
      <div className="ml-4 h-full flex flex-col justify-center gap-2">
        <div className="w-64 h-6 rounded-md bg-slate-200" />
        <div className="w-36 h-4 rounded-md bg-slate-200" />
      </div>
    </div>
  );
}

function BarMenu({ roomId }: { roomId: RoomId }) {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = () => {
    setIsMenuOpened((isMenuOpened) => (isMenuOpened ? false : isMenuOpened));
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        contentRef.current &&
        buttonRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    },
    [contentRef.current, buttonRef.current],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const queryLeave = useQueryLeaveRoom();
  const navigate = useNavigate();
  const action = useActionStore();

  async function onClickHandler(type: "info" | "leave") {
    if (roomId) {
      if (type === "info") {
        navigate({ pathname: routes.rooms.path + roomId + "/info" });
      }
      if (type === "leave") {
        const { success } = await queryLeave.run(roomId);
        if (success) {
          action.reloadRooms();
          navigate({ pathname: routes.rooms.path });
        }
      }
    }
  }

  function Button({
    type,
    onClick,
  }: {
    type: "info" | "leave";
    onClick: ReturnType<typeof Function>;
  }) {
    let Icon;
    let text = "";
    if (type === "info") {
      Icon = (
        <IconInfoCircle
          className="text-slate-600"
          strokeWidth="1.5"
          size={24}
        />
      );
      text = "View info";
    }
    if (type === "leave") {
      Icon = (
        <IconLogout className="text-red-600" strokeWidth="1.5" size={24} />
      );
      text = "Leave room";
    }

    return (
      <button
        onClick={() => onClick(type)}
        className="flex flex-row items-center gap-4 p-2 px-4 hover:bg-slate-300 duration-100"
      >
        {Icon}
        <p
          className={`${type === "leave" ? "text-red-600" : "text-slate-600"}`}
        >
          {text}
        </p>
      </button>
    );
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsMenuOpened(!isMenuOpened)}
        className="py-2 rounded-xl hover:bg-slate-200 duration-200"
      >
        <IconDotsVertical
          className="text-slate-400"
          strokeWidth="1"
          size={32}
        />
      </button>

      <div
        style={{
          opacity: isMenuOpened ? 1 : 0,
          transform: isMenuOpened
            ? "translateY(0%) scaleY(1)"
            : "translateY(-50%) scaleY(0)",
        }}
        ref={contentRef}
        className="absolute z-10 flex flex-col right-0 top-16 duration-300 ease-in-out border-t-2 border-slate-100 bg-slate-50 shadow-md font-normal"
      >
        <Button type="info" onClick={onClickHandler} />
        <Button type="leave" onClick={onClickHandler} />
      </div>
    </>
  );
}

function BottomBarSkeleton() {
  return (
    <div className="shrink-0 relative h-24 w-full flex items-center justify-center border-x-2 border-slate-100 bg-slate-50">
      <div className="p-8 absolute rounded-full border-slate-300 border-x-2 animate-spin"></div>
    </div>
  );
}

function BottomBarNoMember() {
  return (
    <div className="shrink-0 relative h-24 w-full flex items-center justify-center border-x-2 border-slate-100 bg-slate-50">
      <button className="px-6 py-2 text-xl font-light tracking-widest uppercase rounded-lg hover:bg-slate-200 duration-300">
        Join
      </button>
    </div>
  );
}

function BottomBar({
  editAction,
  sendAction,
}: {
  editAction?: {
    onEdit: (message: MessageType) => void;
    closeEdit: () => void;
    editable?: {
      isExist: boolean;
      message?: MessageType;
    };
  };
  sendAction: {
    register: UseFormRegister<{
      text?: string | undefined;
    }>;
    onSubmit: (
      e?: React.BaseSyntheticEvent<object, any, any> | undefined,
    ) => Promise<void>;
    isLoading: boolean;
  };
}) {
  const { register, isLoading } = sendAction;

  return (
    <>
      {editAction?.editable?.isExist && editAction.editable.message && (
        <div className="w-full px-4 border-x-2 border-b-2 border-slate-100 bg-slate-50 flex flex-row items-center">
          <IconEdit
            className="shrink-0 text-slate-400"
            strokeWidth="1"
            size={24}
          />
          <div className="grow w-0 pl-4 h-12 flex flex-col justify-center text-sm">
            <p className="font-light">Edit message</p>
            <p className="w-full truncate">
              {editAction.editable.message.content.text}
            </p>
          </div>
          <button
            onClick={() => editAction.closeEdit()}
            className="shrink-0 rounded-full ring-slate-200 hover:bg-slate-200 hover:ring-4 duration-300 ease-in-out"
          >
            <IconX className="text-slate-600" strokeWidth="1" size={24} />
          </button>
        </div>
      )}
      <form
        onSubmit={sendAction.onSubmit}
        className="shrink-0 relative h-24 p-4 w-full flex items-center border-x-2 border-slate-100 bg-slate-50"
      >
        <textarea
          {...register("text")}
          rows={2}
          defaultValue={
            editAction?.editable?.message?.content.text
              ? editAction.editable.message?.content.text
              : ""
          }
          aria-multiline={true}
          aria-expanded={true}
          autoComplete="off"
          placeholder="Send message..."
          className={`resize-none h-fit grow py-2 pl-4 pr-12 outline-none font-light text-gray-800 text-xl bg-slate-100 ring-2 ring-slate-200 rounded-xl focus:ring-slate-300 focus:bg-slate-50 duration-300 ease-in-out`}
        />
        <SendButton isLoading={isLoading} />
      </form>
    </>
  );
}

function SendButton({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="absolute right-6 flex items-center">
      <button
        disabled={isLoading}
        type="submit"
        formNoValidate={true}
        className="p-2 rounded-full hover:bg-slate-200 duration-300 ease-in-out"
      >
        <IconSend2 className="text-slate-400" size={24} />
      </button>
      {isLoading && (
        <div className="absolute size-8 rounded-full border-y-2 border-slate-300 animate-spin" />
      )}
    </div>
  );
}
