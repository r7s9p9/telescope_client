import {
  IconArrowDown,
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconMessageReply,
  IconSend2,
  IconTrash,
} from "@tabler/icons-react";
import { FormEventHandler, ReactNode } from "react";
import { MessageType } from "../../../shared/api/api.schema";
import { formatDate, isSameDay } from "../../../shared/lib/date";
import React from "react";
import { useChat } from "./useChat";
import { useMenuContext } from "../../context-menu/ContextMenu";

export function Chat() {
  const {
    chat,
    messagesRef,
    messages,
    debouncedHandleScroll,
    isUnreadMessage,
    isShowScrollToBottom,
    scrollToBottom,
    useSend,
  } = useChat();

  const { register, onSubmit, isLoading } = useSend();

  console.log(chat);

  if (!messages) {
    return (
      <Wrapper>
        <Bar name={chat?.name} type={chat?.type} userCount={chat?.userCount} />
        <Spinner />
        <Send register={register} onSubmit={onSubmit} isLoading={isLoading} />
      </Wrapper>
    );
  }

  const readyMessages: JSX.Element[] = [];
  let prevMessageCreated;

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

    readyMessages.push(
      <Message key={`message-${messages[i].created}`} data={messages[i]} />,
    );
  }

  return (
    <Wrapper>
      <Bar name={chat?.name} type={chat?.type} userCount={chat?.userCount} />
      <Messages listRef={messagesRef} onScroll={debouncedHandleScroll}>
        {readyMessages}
      </Messages>
      <ScrollButton
        isUnreadMessage={isUnreadMessage}
        isShowScrollToBottom={isShowScrollToBottom}
        scrollToBottom={scrollToBottom}
      />
      <Send register={register} onSubmit={onSubmit} isLoading={isLoading} />
    </Wrapper>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col bg-slate-200">{children}</div>
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
  onScroll,
}: {
  children: ReactNode;
  listRef: React.RefObject<HTMLUListElement>;
  onScroll: (e: React.UIEvent<HTMLElement>) => void;
}) {
  return (
    <ul
      ref={listRef}
      onScroll={onScroll}
      className="relative overflow-y-scroll will-change-scroll overscroll-none scroll-auto grow w-full p-4 flex flex-col bg-slate-200"
    >
      {children}
    </ul>
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
          isShowScrollToBottom || isUnreadMessage ? "" : "translateY(150%)",
      }}
      className={`absolute bottom-24 right-4 border-2 rounded-full bg-slate-100 text-slate-600 p-2 hover:bg-slate-200 duration-200 ease-in-out`}
    >
      {isUnreadMessage && (
        <div className="absolute top-0 left-0 size-12 rounded-full ring-2 ring-blue-400 animate-pulse" />
      )}
      <IconArrowDown strokeWidth="1" size={32} />
    </button>
  );
}

function Message({ data }: { data: MessageType }) {
  const text = data.content.text;
  const date = formatDate().message(data.created, data.modified);
  if (data.authorId === "service") {
    return (
      <li className="flex flex-col p-2 mt-4 self-center bg-slate-50 rounded-xl ring-2 ring-slate-200">
        <p className="text-sm text-justify">{text}</p>
        <p className="text-slate-400 text-sm text-center">{date}</p>
      </li>
    );
  }

  const isYourMessage = data.authorId === ("self" as const);

  const { openMenu, closeMenu } = useMenuContext();

  function onClickHandler(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    openMenu(e, <MessageContextMenu closeMenu={closeMenu} />);
  }

  return (
    <li
      onContextMenu={(e) => onClickHandler(e)}
      className="flex flex-row mt-4 w-fit"
    >
      <div className="flex flex-col h-fit w-fit p-2 bg-slate-50 ring-2 ring-slate-200 rounded-xl">
        <div className="flex flex-row justify-between gap-4">
          <p className="text-green-500 text-sm">
            {isYourMessage ? "You" : data.username}
          </p>
          <p className="text-slate-400 text-sm">{date}</p>
        </div>
        <p className="text-sm text-justify">{text}</p>
      </div>
    </li>
  );
}

function MessageContextMenu({
  closeMenu,
}: {
  closeMenu: ReturnType<typeof Function>;
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
      Icon = <IconTrash className="text-slate-600" strokeWidth="2" size={18} />;
    }

    return (
      <button
        onClick={() => onClick(type)}
        className="flex flex-row items-center gap-4 p-2 px-4 hover:bg-slate-300 duration-100"
      >
        {Icon}
        <p className="capitalize font-light">{type}</p>
      </button>
    );
  }

  function onClickHandler(type: "reply" | "edit" | "copy" | "delete") {
    if (type === "reply") {
    }
    if (type === "edit") {
    }
    if (type === "copy") {
    }
    if (type === "delete") {
    }
  }

  return (
    <div className="bg-slate-100 flex flex-col m-2 border-2 border-slate-300 rounded-lg shadow-xl">
      <Button onClick={onClickHandler} type={"reply"} />
      <Button onClick={onClickHandler} type={"edit"} />
      <Button onClick={onClickHandler} type={"copy"} />
      <Button onClick={onClickHandler} type={"delete"} />
    </div>
  );
}

function Bar({
  name,
  type,
  userCount,
}: {
  name?: string;
  type?: string;
  userCount?: number;
}) {
  return (
    <div className="shrink-0 w-full h-16 px-4 font-light flex justify-between items-center border-x-2 border-slate-100 bg-slate-50 select-none">
      <div className="size-10 flex items-center justify-center text-2xl uppercase font-light rounded-full border-2 border-slate-400">
        {name?.at(0)}
      </div>
      <div className="flex flex-col ml-4 grow">
        {name && <p className="text-xl">{name}</p>}
        {type && userCount && (
          <div className="flex flex-row gap-1">
            <p className="text-sm capitalize">{type}</p>
            <p className="text-sm">room,</p>
            <p className="text-sm">
              {userCount} {userCount > 1 ? "members" : "member"}
            </p>
          </div>
        )}
      </div>
      <button className="py-2 rounded-xl hover:bg-slate-200 duration-200">
        <IconDotsVertical
          className="text-slate-400"
          strokeWidth="1"
          size={32}
        />
      </button>
    </div>
  );
}

function Send({
  register,
  onSubmit,
  isLoading,
}: {
  register: ReturnType<typeof Function>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isLoading: boolean;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="shrink-0 relative p-4 w-full flex items-center border-x-2 border-slate-100 bg-slate-50"
    >
      <input
        {...register("text")}
        autoComplete="off"
        placeholder="Send message..."
        className="h-12 grow pl-4 pr-1 outline-none font-light text-gray-800 text-xl bg-slate-100 ring-2 ring-slate-200 rounded-xl focus:ring-slate-300 focus:bg-slate-50 duration-300 ease-in-out"
      />
      <SendButton isLoading={isLoading} />
    </form>
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
