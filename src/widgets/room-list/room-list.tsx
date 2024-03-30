import { Link, useNavigate, useParams } from "react-router-dom";
import { RoomInListType, RoomListType } from "../../shared/api/api.schema";
import { ReactNode, useEffect, useState } from "react";
import { formatDate } from "../../shared/lib/date";
import { useNotify } from "../notification/notification";
import { useQueryRoomList } from "../../shared/api/api";
import { getRandomInt } from "../../shared/lib/random";
import { checkRoomId } from "../../shared/lib/uuid";
import { routes } from "../../constants";
import { RoomId } from "../../types";

export function RoomList() {
  const notify = useNotify();
  const navigate = useNavigate();
  const query = useQueryRoomList();

  const { roomId } = useParams();

  const [roomList, setRoomList] = useState<RoomListType>();

  useEffect(() => {
    if (!checkRoomId(roomId)) navigate(routes.home.path);

    const queryAction = async () => {
      const { success, data } = await query.run({
        min: "0",
        max: "10",
      });
      if (!success) notify.show.error("ROOM LIST NO SUCCESS");
      if (success) setRoomList(data);
    };
    queryAction();
  }, []);

  return (
    <Rooms
      isLoading={query.isLoading}
      isEmpty={!!roomList?.isEmpty}
      data={roomList}
      openedRoomId={roomId as RoomId}
    />
  );
}

function Skeleton() {
  const nameWidth = getRandomInt(2, 6) * 32;
  const contentWidth = getRandomInt(2, 6) * 48;

  return (
    <div className="w-full h-14 p-2 mb-2 flex flex-col justify-between bg-slate-100 shadow-md rounded-md">
      <div className="w-full flex justify-between animate-pulse">
        <div
          style={{ width: `${nameWidth}px` }}
          className="rounded-md h-4 bg-slate-200"
        ></div>
        <div className="w-16 rounded-md h-4 bg-slate-200"></div>
      </div>
      <div className="w-full flex justify-between animate-pulse">
        <div
          style={{ width: `${contentWidth}px` }}
          className="h-4 rounded-md bg-slate-200"
        ></div>
      </div>
    </div>
  );
}

function RoomsSkeleton() {
  const count = getRandomInt(2, 8);

  return (
    <Container>
      {Array(count)
        .fill(1)
        .map((_, i) => (
          <li key={i}>
            <Skeleton />
          </li>
        ))}
    </Container>
  );
}

function UnreadCount({ count }: { count: number }) {
  if (count !== 0) {
    return (
      <p className="text-xs text-blue-600 bg-slate-50 text-center px-1 rounded-xl">
        {count > 9 ? "9+" : count}
      </p>
    );
  }
}

function Container({ children }: { children: ReactNode }) {
  return (
    <ul className="w-1/3 min-w-40 h-full border-r-2 p-2 border-slate-400">
      {children}
    </ul>
  );
}

function Rooms({
  isLoading,
  isEmpty,
  data,
  openedRoomId,
}: {
  isLoading: boolean;
  isEmpty: boolean;
  data?: RoomListType;
  openedRoomId?: RoomId;
}) {
  if (isLoading) return <RoomsSkeleton />;
  if (isEmpty || !data?.roomDataArr)
    return <Container>You have no rooms</Container>;

  const rooms = data.roomDataArr.map((roomData) => (
    <li key={roomData.roomId}>
      <Room isOpened={openedRoomId === roomData.roomId} data={roomData} />
    </li>
  ));

  return <Container>{rooms}</Container>;
}

function Room({ isOpened, data }: { isOpened: boolean; data: RoomInListType }) {
  const date = data.lastMessage
    ? formatDate().roomList(data.lastMessage.created)
    : formatDate().roomList(data.roomInfo.created);

  const lastMessage = data.lastMessage
    ? data.lastMessage.content.text
    : "There is no messages";

  return (
    <Link to={"/room/" + data.roomId}>
      <button
        className={`${isOpened ? "bg-slate-200" : "bg-slate-100"} w-full flex flex-col p-2 justify-between items-center shadow-md rounded-md hover:bg-slate-200`}
      >
        <div className="w-full flex flex-row justify-between items-center gap-2">
          <p className="text-sm text-blue-600">{data.roomInfo.name}</p>
          <p className="text-xs text-gray-800">{date}</p>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <p className="w-full text-xs truncate text-black">{lastMessage}</p>
          <UnreadCount count={data.unreadCount} />
        </div>
      </button>
    </Link>
  );
}
