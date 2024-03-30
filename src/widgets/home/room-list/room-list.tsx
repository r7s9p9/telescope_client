import { Link, useNavigate, useParams } from "react-router-dom";
import { RoomInListType, RoomListType } from "../../../shared/api/api.schema";
import { ReactNode, useEffect, useRef, useState } from "react";
import { formatDate } from "../../../shared/lib/date";
import { useNotify } from "../../notification/notification";
import { useQueryRoomList } from "../../../shared/api/api";
import { getRandomInt } from "../../../shared/lib/random";
import { checkRoomId } from "../../../shared/lib/uuid";
import { routes } from "../../../constants";
import { RoomId } from "../../../types";

type ListType = HTMLUListElement;
type ListRef = React.RefObject<ListType>;

type ItemType = HTMLLIElement;
type ItemRef = React.RefObject<ItemType>;

export function RoomList() {
  const notify = useNotify();
  const navigate = useNavigate();

  const query = useQueryRoomList();

  const { roomId } = useParams();

  const [listData, setListData] = useState<RoomListType>();
  const [isLoaded, setIsLoaded] = useState(false);

  const listRef = useRef<ListType>(null);
  const itemRef = useRef<ItemType>(null);

  // Initial check and load data
  useEffect(() => {
    const queryAction = async (count: number) => {
      const { success, data } = await query.run({
        min: "0",
        max: count.toString(),
      });
      if (!success) notify.show.error("ROOM LIST NO SUCCESS");
      if (success) {
        setListData(data);
        setIsLoaded(true);
      }
    };

    if (roomId && !checkRoomId(roomId)) navigate(routes.home.path);
    if (!isLoaded && listRef.current && itemRef.current) {
      console.log(listRef.current?.offsetHeight, itemRef.current?.offsetHeight);
      const count = Math.ceil(
        listRef.current?.offsetHeight / itemRef.current?.offsetHeight,
      );
      queryAction(count);
    }
  });

  return (
    <Rooms
      isLoading={!isLoaded}
      isEmpty={listData?.allCount === 0}
      data={listData}
      openedRoomId={roomId as RoomId}
      listRef={listRef}
      itemRef={itemRef}
    />
  );
}

function List({ children }: { children: ReactNode }) {
  return (
    <ul className="overflow-y-scroll overscroll-none scroll-smooth h-full p-2 w-1/3 min-w-40 flex flex-col border-r-2 border-slate-400">
      {children}
    </ul>
  );
}

function ListSkeleton({
  itemRef,
  listRef,
}: {
  itemRef: ItemRef;
  listRef: ListRef;
}) {
  const count = getRandomInt(2, 8);
  return (
    <ul
      className="overflow-y-scroll overscroll-none scroll-smooth h-full p-2 w-1/3 min-w-40 flex flex-col border-r-2 border-slate-400"
      ref={listRef}
    >
      {Array(count)
        .fill(1)
        .map((_, i) => (
          <li key={i} ref={itemRef}>
            <ItemSkeleton />
          </li>
        ))}
    </ul>
  );
}

function ItemSkeleton() {
  const nameWidth = getRandomInt(2, 6) * 32;
  const contentWidth = getRandomInt(2, 6) * 48;

  return (
    <div className="w-full h-14 mb-2 flex flex-col justify-between bg-slate-100 shadow-md rounded-md">
      <div className="flex mx-2 mt-2 justify-between animate-pulse">
        <div
          style={{ width: `${nameWidth}px` }}
          className="rounded-md h-4 bg-slate-200"
        ></div>
        <div className="w-16 rounded-md h-4 bg-slate-200"></div>
      </div>
      <div className="flex mx-2 mb-2 justify-between animate-pulse">
        <div
          style={{ width: `${contentWidth}px` }}
          className="h-4 rounded-md bg-slate-200"
        ></div>
      </div>
    </div>
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

function Rooms({
  isLoading,
  isEmpty,
  data,
  openedRoomId,
  listRef,
  itemRef,
}: {
  isLoading: boolean;
  isEmpty: boolean;
  data?: RoomListType;
  openedRoomId?: RoomId;
  listRef: ListRef;
  itemRef: ItemRef;
}) {
  if (isLoading) {
    return <ListSkeleton listRef={listRef} itemRef={itemRef} />;
  }

  if (isEmpty || !data?.roomDataArr) {
    return <List>You have no rooms</List>;
  }

  const items = data.roomDataArr.map((roomData) => (
    <li key={roomData.roomId}>
      <Item isOpened={openedRoomId === roomData.roomId} data={roomData} />
    </li>
  ));

  return <List>{items}</List>;
}

function Item({ isOpened, data }: { isOpened: boolean; data: RoomInListType }) {
  const date = data.lastMessage
    ? formatDate().roomList(data.lastMessage.created)
    : formatDate().roomList(data.roomInfo.created);

  const lastMessage = data.lastMessage
    ? data.lastMessage.content.text
    : "There is no messages";

  return (
    <Link to={"/room/" + data.roomId}>
      <button
        className={`${isOpened ? "bg-slate-200" : "bg-slate-100"} w-full flex h-14 mb-2 flex-col p-2 justify-between items-center shadow-md rounded-md hover:bg-slate-200`}
      >
        <div className="w-full flex flex-row justify-between items-center gap-2">
          <p className="text-sm text-blue-600">{data.roomInfo.name}</p>
          <p className="text-xs text-gray-800">{date}</p>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <p className="w-full text-xs text-left truncate text-black">
            {lastMessage}
          </p>
          <UnreadCount count={data.unreadCount} />
        </div>
      </button>
    </Link>
  );
}
