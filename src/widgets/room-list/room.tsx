import { useEffect, useState } from "react";
import { useFetcher, useRouteLoaderData } from "react-router-dom";
import { MessageType, RoomDataType } from "../../shared/api/api.schema";
import { formatDate } from "../../shared/lib/date";
import {
  IconCopy,
  IconEdit,
  IconMessageReply,
  IconMessageUp,
  IconTrash,
} from "@tabler/icons-react";

export function Room() {
  const { roomData } = useRouteLoaderData("room") as { roomData: RoomDataType };
  const [data, setData] = useState(roomData);
  if (roomData.roomId !== data.roomId) setData(roomData);

  if (!data.messageArr || data.messageArr.length === 0)
    return <div>no messages</div>;

  const messageArr = data.messageArr.map((message) => (
    <Message key={message.created} message={message} />
  ));
  return <ChatContainer messageArr={messageArr} roomData={roomData} />;
}

function ChatContainer({
  messageArr,
  roomData,
}: {
  messageArr: JSX.Element[];
  roomData: RoomDataType;
}) {
  return (
    <div className="flex flex-col justify-between w-full bg-gray-100 rounded-2xl p-2 m-2">
      <ChatTopPanel roomData={roomData} />
      <div className="flex flex-col w-full  gap-4">
        <ul className="flex flex-col gap-4">{messageArr}</ul>
        <SendMessage roomId={roomData.roomId} />
      </div>
    </div>
  );
}

function ChatTopPanel({ roomData }: { roomData: RoomDataType }) {
  return (
    <div className="flex w-full justify-center items-center h-8 border-2 border-slate-300 rounded-xl bg-gray-200">
      <p className="text-blue-600">roomId: {roomData.roomId}</p>
    </div>
  );
}

function Message({ message }: { message: MessageType }) {
  const text = message.content.text;
  const date = formatDate().message(message.created, message.modified);

  if (message.authorId === "service") {
    return (
      <li className="flex flex-col w-fit p-2 self-center justify-center bg-slate-100 rounded-xl shadow-md">
        <p className="text-xs text-justify">{text}</p>
        <p className="text-slate-400 text-xs text-center">{date}</p>
      </li>
    );
  }

  const [isShowMenu, setShowMenu] = useState(false);
  const [point, setPoint] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleClick = () => setShowMenu(false);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <li
      className="flex flex-row w-fit"
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu(true);
        setPoint({
          x: e.pageX,
          y: e.pageY,
        });
      }}
    >
      {isShowMenu && <MessageMenu x={point.x} y={point.y} />}
      <div className="flex flex-row items-center justify-center w-8 h-8 bg-slate-200 rounded-full shadow-md border-2 border-slate-300">
        <p className="text-xl text-blue-600">{message.authorId.charAt(0)}</p>
      </div>
      <div className="flex flex-col h-12 ml-2 px-2 bg-slate-100 rounded-xl shadow-md">
        <div className="flex flex-row justify-between gap-4">
          <p className="text-green-500 text-sm">{message.authorId}</p>
          <p className="text-slate-400 text-xs">{date}</p>
        </div>
        <p className="text-sm text-justify">{text}</p>
      </div>
    </li>
  );
}

function MessageMenu({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="flex items-center absolute bg-slate-100 rounded-md border-2 shadow-sm select-none"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      <div className="flex flex-col justify-between w-32 h-fit text-sm font-thin p-2">
        <button className="flex flex-row items-center p-1 rounded-md hover:bg-slate-200">
          <IconMessageReply size={16} className="mr-6" />
          Reply
        </button>
        <button className="flex flex-row items-center p-1 rounded-md hover:bg-slate-200">
          <IconEdit size={16} className="mr-6" />
          Edit
        </button>
        <button className="flex flex-row items-center p-1 rounded-md hover:bg-slate-200">
          <IconCopy size={16} className="mr-6" />
          Copy Text
        </button>
        <button className="flex flex-row items-center p-1 rounded-md hover:bg-slate-200 text-red-600">
          <IconTrash size={16} className="mr-6" />
          Delete
        </button>
      </div>
    </div>
  );
}

function SendMessage({ roomId }: { roomId: string }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      action="/room/:roomId/message/add"
      className="flex right-0 focus:outline-none rtl:left-0 rtl:right-auto"
    >
      <input
        type="text"
        name="text"
        placeholder="Send message..."
        className="block w-full py-1 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-xl pl-5 pr-11 rtl:pr-5 rtl:pl-11 focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
      />
      <input type="hidden" name="roomId" value={roomId}></input>
      <button type="submit">
        <IconMessageUp className="w-6 h-6 mx-4 text-gray-400 transition-colors duration-300 hover:text-gray-600"></IconMessageUp>
      </button>
    </fetcher.Form>
  );
}
