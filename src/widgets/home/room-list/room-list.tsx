import { Link, useNavigate, useParams } from "react-router-dom";
import { RoomInListType } from "../../../shared/api/api.schema";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { formatDate } from "../../../shared/lib/date";
import { useNotify } from "../../notification/notification";
import { getRandomInt } from "../../../shared/lib/random";
import { checkRoomId } from "../../../shared/lib/uuid";
import { routes } from "../../../constants";
import { debounce } from "../../../shared/lib/debounce";
import React from "react";
import { IconCirclePlus, IconSearch } from "@tabler/icons-react";
import { useStore } from "../../../shared/store/StoreProvider";
import { useRooms } from "../../../shared/store/store";

const itemHeight = 64 as const; // for skeleton & item

const overscreenItemCountToTriggerFurtherLoading = 5 as const;
const overscreenItemCountForFurtherLoading = 10 as const;
const debounceScrollDelay = 100 as const;

const SkeletonList = React.memo(({ count }: { count: number }) => {
  if (count > 0) {
    const skeletonItems = Array(count)
      .fill(1)
      .map((_, i) => (
        <li key={i}>
          <ItemSkeleton />
        </li>
      ));
    return skeletonItems;
  }
  return null;
});

export function RoomList() {
  const notify = useNotify();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const { queryRange } = useRooms();
  const { store } = useStore();
  const rooms = store.rooms?.data;

  const isInitialLoading = !rooms?.roomDataArr;
  const isZeroItemCount = rooms?.allCount === 0;
  const isAllLoaded = !!(rooms && rooms.allCount === rooms.roomDataArr?.length);

  useEffect(() => {
    // wrong roomId protection
    if (roomId && !checkRoomId(roomId)) navigate(routes.home.path);
    // show errors
    const action = async () => {
      if (store.rooms?.error) {
        notify.show.error(store.rooms.error);
      }
    };
    action();
  }, [rooms]);

  const handleScroll = useCallback(
    async (e: React.UIEvent<HTMLElement>) => {
      if (
        !isInitialLoading &&
        !isAllLoaded &&
        !isZeroItemCount &&
        rooms?.roomDataArr
      ) {
        const target = e.nativeEvent.target as HTMLElement;
        const lastVisibleIndex = Math.ceil(
          (target.scrollTop + target.offsetHeight) / itemHeight,
        );
        const lastLoadedIndex = rooms.roomDataArr.length;
        const isNeedToLoad = !!(
          lastLoadedIndex - lastVisibleIndex <
          overscreenItemCountToTriggerFurtherLoading
        );
        if (isNeedToLoad) {
          const startItem = lastLoadedIndex;
          if (
            lastLoadedIndex + overscreenItemCountForFurtherLoading >
            rooms.allCount
          ) {
            await queryRange(lastLoadedIndex, rooms.allCount);
          }
          if (lastVisibleIndex > lastLoadedIndex) {
            const stopItem =
              lastVisibleIndex + overscreenItemCountForFurtherLoading;
            stopItem > rooms.allCount
              ? await queryRange(startItem, rooms.allCount)
              : await queryRange(startItem, stopItem);
          } else {
            const stopItem = startItem + overscreenItemCountForFurtherLoading;
            await queryRange(startItem, stopItem);
          }
        }
      }
    },
    [
      isAllLoaded,
      isInitialLoading,
      isZeroItemCount,
      rooms?.allCount,
      rooms?.roomDataArr,
      queryRange,
    ],
  );

  const debouncedHandleScroll = useMemo(
    () => debounce(handleScroll, debounceScrollDelay),
    [handleScroll],
  );

  if (isZeroItemCount)
    return (
      <RootWrapper>
        <ListEmpty />
      </RootWrapper>
    );

  const skeletonCount = getRandomInt(4, 12);
  if (!rooms?.roomDataArr || isInitialLoading) {
    return (
      <RootWrapper>
        <ListWrapper>
          <SkeletonList count={skeletonCount} />
        </ListWrapper>
      </RootWrapper>
    );
  }

  const items = rooms.roomDataArr.map((itemData) => (
    <li key={itemData.roomId}>
      <Item isOpened={roomId === itemData.roomId} data={itemData} />
    </li>
  ));

  return (
    <RootWrapper>
      <ListWrapper onScroll={debouncedHandleScroll}>
        {items}
        {!isAllLoaded && (
          <SkeletonList count={rooms.allCount - rooms.roomDataArr.length} />
        )}
      </ListWrapper>
    </RootWrapper>
  );
}

function RootWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex flex-col w-1/2 min-w-52 max-w-xs">
      <div className="pb-4 px-4 flex flex-col items-center flex-col">
        <Title />
        <Search />
      </div>
      {children}
    </div>
  );
}

function Title() {
  return (
    <div className="h-16 py-2 w-full flex justify-between items-center">
      <p className="font-thin tracking-widest uppercase text-3xl">Rooms</p>
      <Link
        to={routes.createRoom.path}
        title="Create new room"
        className="size-12 rounded-full hover:bg-slate-200 duration-200 justify-self-end flex justify-center items-center"
      >
        <IconCirclePlus strokeWidth="1" className="text-slate-400" size={32} />
      </Link>
    </div>
  );
}

function ListWrapper({
  children,
  onScroll,
}: {
  children: ReactNode;
  onScroll?: (e: React.UIEvent<HTMLElement>) => void;
}) {
  return (
    <ul
      onScroll={onScroll}
      className="overflow-y-scroll overscroll-none scroll-smooth w-full h-full flex flex-col bg-slate-50"
    >
      {children}
    </ul>
  );
}

const itemHeightStyle = { height: itemHeight + "px" };

function ListEmpty() {
  return (
    <ListWrapper>
      <p
        style={itemHeightStyle}
        className="w-full text-center p-4 font-thin text-xl bg-slate-100"
      >
        You have no rooms
      </p>
    </ListWrapper>
  );
}

function ItemSkeleton() {
  return (
    <div
      style={itemHeightStyle}
      className="w-full flex flex-col px-4 py-2 justify-between bg-slate-50"
    >
      <div className="flex justify-between animate-pulse">
        <div className="rounded-md h-4 w-2/5 bg-slate-200"></div>
        <div className="rounded-md h-4 w-1/5 bg-slate-200"></div>
      </div>
      <div className="h-4 w-3/5 rounded-md bg-slate-200 animate-pulse"></div>
    </div>
  );
}

function Item({ isOpened, data }: { isOpened: boolean; data: RoomInListType }) {
  const date = formatDate().roomList(data.lastMessage.created);

  const lastMessage = data.lastMessage
    ? data.lastMessage.content.text
    : "There is no messages";

  let lastUsername: string | false = false;
  if (data.lastMessage.authorId === "self") {
    lastUsername = "You" as const;
  } else if (data.lastMessage.username) {
    lastUsername = data.lastMessage.username;
  }

  return (
    <Link
      to={routes.rooms.path + data.roomId}
      style={itemHeightStyle}
      className={`${isOpened ? "bg-slate-200 cursor-default" : "bg-slate-50"} w-full flex flex-col px-4 py-2 justify-between items-center hover:bg-slate-200 duration-300 ease-out`}
    >
      <div className="w-full flex flex-row justify-between items-center gap-2">
        <p className="text-md text-green-600 font-light">{data.roomName}</p>
        <p className="text-sm text-slate-600 font-light lowercase">{date}</p>
      </div>
      <div className="w-full flex flex-row gap-2 items-center">
        {lastUsername && (
          <p className="text-sm shrink-0 text-blue-600 truncate">
            {lastUsername}:
          </p>
        )}
        <p className="text-sm grow font-light text-left truncate">
          {lastMessage}
        </p>
        <UnreadCount count={data.unreadCount} />
      </div>
    </Link>
  );
}

function UnreadCount({ count }: { count: number }) {
  if (count !== 0) {
    return (
      <p className="shrink-0 size-6 flex justify-center items-center text-sm text-light text-slate-50 bg-slate-400 text-center rounded-full">
        {count > 9 ? "9+" : count}
      </p>
    );
  }
}

function Search() {
  return (
    <div className="shrink-0 relative h-12 w-full flex items-center">
      <input
        placeholder="Search..."
        className="h-full w-full pl-4 pr-16 outline-none font-light text-gray-800 text-xl bg-slate-100 ring-2 ring-slate-200 rounded-xl focus:ring-slate-300 focus:bg-slate-50 duration-300 ease-in-out"
      ></input>
      <div className="absolute right-4 flex items-center">
        <IconSearch className="text-slate-400" size={18} />
      </div>
    </div>
  );
}
