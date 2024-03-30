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

type RoomType = HTMLAnchorElement;
type RoomRef = React.RefObject<RoomType>;

export function RoomList() {
  const notify = useNotify();
  const navigate = useNavigate();

  const initialQuery = useQueryRoomList();
  const additionalQuery = useQueryRoomList();

  const { roomId } = useParams();

  const [listData, setListData] = useState<RoomListType>();

  const [additionalLoad, setAdditionalLoad] = useState({
    toLoad: false,
    min: 0,
    max: 0,
  });

  // Initial check and load data
  useEffect(() => {
    if (!checkRoomId(roomId)) navigate(routes.home.path);

    const queryAction = async () => {
      const { success, data } = await initialQuery.run({
        min: "0",
        max: "8",
      });
      if (!success) notify.show.error("ROOM LIST NO SUCCESS");
      if (success) setListData(data);
    };
    queryAction();
  }, []);

  const listRef = useRef<ListType>(null);
  const roomRef = useRef<RoomType>(null);

  // check for additional load
  useEffect(() => {
    const isLoaded = !!(
      !initialQuery.isLoading &&
      listData &&
      listRef.current &&
      roomRef.current &&
      !additionalLoad.toLoad
    );

    if (isLoaded) {
      const itemsCapacity = Math.ceil(
        listRef.current?.offsetHeight / roomRef.current?.offsetHeight,
      );
      const itemsLoadedCount = listData.roomDataArr?.length;
      const isNeedToLoadMore = !!(
        itemsLoadedCount &&
        itemsCapacity > itemsLoadedCount &&
        itemsLoadedCount < listData.allCount
      );
      if (isNeedToLoadMore) {
        setAdditionalLoad({
          toLoad: true,
          min: itemsLoadedCount,
          max: itemsCapacity,
        });
      }
    }
  }, [initialQuery.isLoading]);

  useEffect(() => {
    if (additionalLoad.toLoad) {
      const queryAction = async () => {
        const { success, data } = await additionalQuery.run({
          min: additionalLoad.min.toString(),
          max: additionalLoad.max.toString(),
        });
        console.log(data?.roomDataArr?.length);
        if (!success) notify.show.error("ROOM LIST ADDITIONAL NO SUCCESS");
        if (success && listData?.roomDataArr && data.roomDataArr) {
          setListData({
            ...listData,
            roomDataArr: listData.roomDataArr.concat(data.roomDataArr),
          });
          setAdditionalLoad({ ...additionalLoad, toLoad: false });
        }
      };
      queryAction();
    }
  }, [additionalLoad]);

  return (
    <Rooms
      isLoading={initialQuery.isLoading}
      isEmpty={listData?.allCount === 0}
      data={listData}
      openedRoomId={roomId as RoomId}
      listRef={listRef}
      roomRef={roomRef}
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

function RoomsSkeleton({ listRef }: { listRef: ListRef }) {
  const count = getRandomInt(2, 8);

  return (
    <Container listRef={listRef}>
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

function Container({
  listRef,
  children,
}: {
  listRef: ListRef;
  children: ReactNode;
}) {
  return (
    <ul
      ref={listRef}
      className="overflow-y-scroll overscroll-none scroll-smooth h-full w-1/3 min-w-40 flex flex-col border-r-2 border-slate-400"
    >
      {children}
    </ul>
  );
}

function Rooms({
  isLoading,
  isEmpty,
  data,
  openedRoomId,
  listRef,
  roomRef,
}: {
  isLoading: boolean;
  isEmpty: boolean;
  data?: RoomListType;
  openedRoomId?: RoomId;
  listRef: ListRef;
  roomRef: RoomRef;
}) {
  if (isLoading) return <RoomsSkeleton listRef={listRef} />;
  if (isEmpty || !data?.roomDataArr)
    return <Container listRef={listRef}>You have no rooms</Container>;

  const rooms = data.roomDataArr.map((roomData) => (
    <li key={roomData.roomId}>
      <Room
        isOpened={openedRoomId === roomData.roomId}
        data={roomData}
        roomRef={roomRef}
      />
    </li>
  ));

  return <Container listRef={listRef}>{rooms}</Container>;
}

function Room({
  isOpened,
  data,
  roomRef,
}: {
  isOpened: boolean;
  data: RoomInListType;
  roomRef: RoomRef;
}) {
  const date = data.lastMessage
    ? formatDate().roomList(data.lastMessage.created)
    : formatDate().roomList(data.roomInfo.created);

  const lastMessage = data.lastMessage
    ? data.lastMessage.content.text
    : "There is no messages";

  return (
    <Link
      to={"/room/" + data.roomId}
      className="w-full py-1 px-2 flex"
      ref={roomRef}
    >
      <button
        className={`${isOpened ? "bg-slate-200" : "bg-slate-100"} w-full flex flex-col p-2 justify-between items-center shadow-md rounded-md hover:bg-slate-200`}
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
