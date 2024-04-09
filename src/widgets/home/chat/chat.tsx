import { IconSend2 } from "@tabler/icons-react";
import { useNotify } from "../../notification/notification";
import { useNavigate, useParams } from "react-router-dom";
import { ReactNode, useEffect, useRef } from "react";
import { checkRoomId } from "../../../shared/lib/uuid";
import { MessageType } from "../../../shared/api/api.schema";
import { RoomId } from "../../../types";
import { routes } from "../../../constants";
import { formatDate, isSameDay } from "../../../shared/lib/date";
import { useChat } from "../../../shared/store/store";
import { useStore } from "../../../shared/store/StoreProvider";

type MessageLIType = HTMLLIElement;
type MessageRefType = React.RefObject<MessageLIType> | undefined;

const itemCountToTriggerFurtherLoading = 2 as const;
const itemCountToFurtherLoading = 4 as const;

function observerMessageSelector(count: number, index: number) {
  if (count > itemCountToTriggerFurtherLoading) {
    if (count - index === itemCountToTriggerFurtherLoading) {
      return { isTopTrigger: true as const, isBottomTrigger: false as const };
    }
    if (index === itemCountToTriggerFurtherLoading) {
      return { isBottomTrigger: true as const, isTopTrigger: false as const };
    }
  } else {
    if (index === count)
      return { isTopTrigger: true as const, isBottomTrigger: false as const };
    if (index === (0 as const))
      return { isBottomTrigger: true as const, isTopTrigger: false as const };
  }

  return { isTopTrigger: false as const, isBottomTrigger: false as const };
}

export function Chat() {
  const notify = useNotify();
  const navigate = useNavigate();
  const { store } = useStore();
  const { roomId } = useParams();
  const chat = store?.chats?.[roomId as RoomId];
  const { queryReadRange } = useChat(roomId as RoomId);

  const topMessageRef = useRef(null);
  const bottomMessageRef = useRef(null);

  useEffect(() => {
    const action = async () => {
      // wrong roomId protection
      if (roomId && !checkRoomId(roomId)) navigate(routes.home.path);
      if (chat?.error) notify.show.error(chat.error);
    };
    if (chat) action();
  }, [roomId]);

  useEffect(() => {
    const observer = new IntersectionObserver(async (entries) => {
      const target = entries[0];
      if (target.isIntersecting && target.target === topMessageRef.current) {
        // const min = chat.data.messageArr.length;
        // const range = {
        //   min: chat.data.messageArr.length,
        //   max: min + itemCountToFurtherLoading,
        // };
        console.log("Top Triggered !");
        // await queryReadRange(range);
      }
      if (target.isIntersecting && target.target === bottomMessageRef.current) {
        console.log("Bottom Triggered !");
      }
    });

    if (
      chat?.data?.messageArr &&
      (topMessageRef.current || bottomMessageRef.current)
    ) {
      if (topMessageRef.current) observer.observe(topMessageRef.current);
      if (bottomMessageRef.current) observer.observe(bottomMessageRef.current);
    } else {
      return () => {
        if (topMessageRef.current) observer.unobserve(topMessageRef.current);
        if (bottomMessageRef.current)
          observer.unobserve(bottomMessageRef.current);
      };
    }
  }, [chat, topMessageRef, bottomMessageRef]);

  if (!chat || !chat.data?.messageArr) {
    return (
      <Wrapper>
        <Bar />
        <Spinner />
        <Send />
      </Wrapper>
    );
  }

  const messages: JSX.Element[] = [];
  let prevMessageCreated;
  let prevMessageAuthorId;

  for (let i = chat.data.messageArr.length - 1; i >= 0; i--) {
    const isSameCreatedDay =
      prevMessageCreated &&
      isSameDay(chat.data.messageArr[i].created, prevMessageCreated);
    if (!isSameCreatedDay) {
      prevMessageCreated = chat.data.messageArr[i].created;
      messages.push(
        <DateBubble
          key={`date-${chat.data.messageArr[i].created}`}
          date={chat.data.messageArr[i].created}
        />,
      );
    }
    let isAvatar = false;
    if (
      chat.data.messageArr[i].authorId !== "service" &&
      prevMessageAuthorId !== chat.data.messageArr[i].authorId
    ) {
      prevMessageAuthorId = chat.data.messageArr[i].authorId;
      isAvatar = true;
    }
    const { isBottomTrigger, isTopTrigger } = observerMessageSelector(
      chat.data.messageArr.length,
      i + 1,
    );
    if (isBottomTrigger || isTopTrigger) {
      messages.push(
        <li
          ref={
            isTopTrigger
              ? topMessageRef
              : isBottomTrigger
                ? bottomMessageRef
                : undefined
          }
          key={`trigger-${chat.data.messageArr[i].created}`}
          className="w-full py-1 bg-red-400"
        ></li>,
      );
    }

    messages.push(
      <Message
        key={`message-${chat.data.messageArr[i].created}`}
        message={chat.data.messageArr[i]}
        isAvatar={isAvatar}
      />,
    );
  }

  return (
    <Wrapper>
      <Bar />
      <Messages>{messages}</Messages>
      <Send />
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

function DateBubble({ date }: { date: string }) {
  const str = formatDate().bubble(date);
  return (
    <li className="sticky text-center top-0 w-44 mt-4 px-4 py-1 bg-slate-50 self-center rounded-full ring-2 ring-slate-200 text-md font-light">
      {str}
    </li>
  );
}

function Messages({ children }: { children: ReactNode }) {
  return (
    <ul className="relative grow w-full p-4 flex flex-col overflow-y-scroll overscroll-none scroll-smooth bg-slate-200">
      {children}
    </ul>
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
