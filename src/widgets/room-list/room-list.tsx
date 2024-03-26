import { Link, useParams, useRouteLoaderData } from "react-router-dom";
import { RoomInListType, RoomListType } from "../../shared/api/api.schema";
import { ReactNode, useState } from "react";
import { formatDate } from "../../shared/lib/date";
import { IconSearch } from "@tabler/icons-react";

export function RoomList() {
  const { roomList } = useRouteLoaderData("home") as { roomList: RoomListType };
  const { roomId } = useParams();

  const [data, setData] = useState(roomList);

  if (data.isEmpty || !data.roomDataArr) return <div>You have no rooms</div>;

  const roomArr = data.roomDataArr.map((roomData) => (
    <li className="px-2 py-1" key={roomData.roomId}>
      <Room openedRoomId={roomId} data={roomData} />
    </li>
  ));
  return (
    <div className="flex-row border-r-2 border-slate-300">
      <Search />
      <ul>{roomArr}</ul>
    </div>
  );
}

function Search() {
  return (
    <div className="relative flex items-center p-2">
      <button className="absolute right-0 focus:outline-none rtl:left-0 rtl:right-auto">
        <IconSearch className="w-6 h-6 mx-4 text-gray-400 transition-colors duration-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"></IconSearch>
      </button>
      <input
        type="search"
        placeholder="Find room..."
        className="block w-full py-1 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-xl pl-5 pr-11 rtl:pr-5 rtl:pl-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
      />
    </div>
  );
}

function Room({
  openedRoomId,
  data,
}: {
  openedRoomId?: string;
  data: RoomInListType;
}) {
  const date = data.lastMessage
    ? formatDate().roomList(data.lastMessage.created)
    : formatDate().roomList(data.roomInfo.created);

  const noMessage = "There is no messages" as const;
  const message = data.lastMessage ? data.lastMessage.content.text : noMessage;
  const roomLink = "/room/" + data.roomId;

  function RoomContainer({ children }: { children: ReactNode }) {
    return (
      <Link to={roomLink}>
        {data.roomId === openedRoomId ? (
          <button className="shadow-md hover:bg-slate-300 rounded-xl bg-slate-300 ">
            {children}
          </button>
        ) : (
          <button className="shadow-md hover:bg-slate-200 rounded-xl bg-slate-100 ">
            {children}
          </button>
        )}
      </Link>
    );
  }

  const showCount = () => {
    if (data.unreadCount !== 0) {
      if (data.unreadCount > 9) {
        return (
          <p className="text-xs text-blue-600 bg-slate-200 text-center px-1 rounded-lg">
            {"9+"}
          </p>
        );
      }
      return (
        <p className="text-xs text-blue-600 bg-slate-200 text-center px-1 rounded-lg">
          {data.unreadCount}
        </p>
      );
    }
    return <></>;
  };

  return (
    <RoomContainer>
      <div className="flex flex-row items-center">
        <div className="flex flex-row items-center justify-center w-12 h-12 bg-slate-200 rounded-xl ">
          <p className="text-xl text-blue-600">
            {data.roomInfo.name.charAt(0)}
          </p>
        </div>
        <div className="w-72 h-8 flex flex-col px-2 justify-between ">
          <div className="flex justify-between items-center">
            <p className="text-sm text-blue-600">{data.roomInfo.name}</p>
            <p className="text-xs text-gray-800">{date}</p>
          </div>
          <div className="flex flex-row justify-between items-center gap-4">
            <p className="text-xs truncate text-black">{message}</p>
            {showCount()}
          </div>
        </div>
      </div>
    </RoomContainer>
  );
}
