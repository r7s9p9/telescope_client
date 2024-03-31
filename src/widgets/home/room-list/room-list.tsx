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

type LoaderType = HTMLLIElement;
type LoaderRef = React.RefObject<LoaderType>;

const itemHeight = 64 as const; // for skeleton & item

export function RoomList() {
  const notify = useNotify();
  const navigate = useNavigate();

  const query = useQueryRoomList();

  const { roomId } = useParams();

  const [listData, setListData] = useState<RoomListType>();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const isAllLoaded = !!(
    listData &&
    (listData.allCount === 0 ||
      listData.allCount === listData.roomDataArr?.length)
  );

  const listRef = useRef<ListType>(null);
  const loaderRef = useRef<LoaderType>(null);

  const queryInitialAction = async (count: number) => {
    const { success, data } = await query.run({
      min: "0",
      max: count.toString(),
    });
    if (!success) notify.show.error("ROOM LIST NO SUCCESS");
    if (success) {
      setListData(data);
      setIsInitialLoading(false);
    }
  };

  const queryAction = async (min: number, max: number) => {
    if (!isAllLoaded && listData?.roomDataArr) {
      const { success, data } = await query.run({
        min: min.toString(),
        max: max.toString(),
      });
      if (!success) notify.show.error("ROOM LIST NO SUCCESS");
      if (success && data.roomDataArr) {
        setListData({
          ...listData,
          allCount: data.allCount,
          dev: data.dev,
          roomDataArr: listData.roomDataArr.concat(data.roomDataArr),
        });
      }
    }
  };

  // Initial load data
  useEffect(() => {
    if (roomId && !checkRoomId(roomId)) navigate(routes.home.path);
    if (isInitialLoading && listRef.current) {
      const count = Math.ceil(listRef.current?.offsetHeight / itemHeight);
      queryInitialAction(count);
    }
  });

  // Second+ load data
  useEffect(() => {
    if (!query.isLoading && !isAllLoaded) {
      const observer = new IntersectionObserver((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          const min = listData?.roomDataArr?.length
            ? listData.roomDataArr.length
            : 0;
          const max = min + 4;
          queryAction(min, max);
          console.log(`To load: ${max}`);
        }
      });

      if (loaderRef.current) observer.observe(loaderRef.current);

      return () => {
        if (loaderRef.current) observer.unobserve(loaderRef.current);
      };
    }
  }, [isInitialLoading, query.isLoading]);

  return (
    <Rooms
      isLoading={isInitialLoading}
      isAllLoaded={isAllLoaded}
      data={listData}
      openedRoomId={roomId as RoomId}
      listRef={listRef}
      loaderRef={loaderRef}
    />
  );
}

function Rooms({
  isLoading,
  isAllLoaded,
  data,
  openedRoomId,
  listRef,
  loaderRef,
}: {
  isLoading: boolean;
  isAllLoaded: boolean;
  data?: RoomListType;
  openedRoomId?: RoomId;
  listRef: ListRef;
  loaderRef: LoaderRef;
}) {
  if (data?.allCount === 0) {
    return <div>You have no rooms</div>;
  } else if (!data?.roomDataArr || isLoading) {
    return <ListSkeleton listRef={listRef} />;
  }

  const items = data.roomDataArr.map((roomData) => (
    <li key={roomData.roomId}>
      <Item isOpened={openedRoomId === roomData.roomId} data={roomData} />
    </li>
  ));

  return (
    <List isAllLoaded={isAllLoaded} loaderRef={loaderRef}>
      {items}
    </List>
  );
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
        style={{ height: 64 + "px" }}
        className={`${isOpened ? "bg-slate-200 hover:bg-slate-200 cursor-default" : "bg-slate-50 hover:bg-slate-200"} w-full flex flex-col py-1 px-4 justify-between items-center border-b-2 border-slate-200 duration-300 ease-out`}
      >
        <div className="w-full flex flex-row justify-between items-center gap-2">
          <p className="text-md text-green-600">{data.roomInfo.name}</p>
          <p className="text-md font-light">{date}</p>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <p className="w-full text-sm text-left truncate">{lastMessage}</p>
          <UnreadCount count={data.unreadCount} />
        </div>
      </button>
    </Link>
  );
}

function List({
  children,
  isAllLoaded,
  loaderRef,
}: {
  children: ReactNode;
  isAllLoaded: boolean;
  loaderRef: LoaderRef;
}) {
  return (
    <ul className="overflow-y-scroll overscroll-none scroll-smooth h-full w-1/3 min-w-40 flex flex-col border-r-2 border-slate-400">
      {children}
      {!isAllLoaded && (
        <li key="loader" ref={loaderRef}>
          <ItemSkeleton />
        </li>
      )}
    </ul>
  );
}

function ListSkeleton({ listRef }: { listRef: ListRef }) {
  const count = getRandomInt(4, 12);
  return (
    <ul
      className="overflow-y-scroll overscroll-none scroll-smooth h-full w-1/3 min-w-40 flex flex-col border-r-2 border-slate-200"
      ref={listRef}
    >
      {Array(count)
        .fill(1)
        .map((_, i) => (
          <li key={i}>
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
    <div
      style={{ height: itemHeight + "px" }}
      className="w-full flex flex-col justify-between bg-slate-100 border-b-2"
    >
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
