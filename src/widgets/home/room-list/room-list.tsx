import { Link, useNavigate, useParams } from "react-router-dom";
import { RoomInListType, RoomListType } from "../../../shared/api/api.schema";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { formatDate } from "../../../shared/lib/date";
import { useNotify } from "../../notification/notification";
import { useQueryRoomList } from "../../../shared/api/api";
import { getRandomInt } from "../../../shared/lib/random";
import { checkRoomId } from "../../../shared/lib/uuid";
import { routes } from "../../../constants";
import { debounce } from "../../../shared/lib/debounce";
import React from "react";

const itemHeight = 64 as const; // for skeleton & item

const itemCountForInitialLoading = 20 as const;
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
  const query = useQueryRoomList();
  const { roomId } = useParams();
  const [listData, setListData] = useState<RoomListType>();

  const isInitialLoading = !listData?.roomDataArr;
  const isZeroItemCount = listData?.allCount === 0;
  const isAllLoaded = !!(
    listData && listData.allCount === listData.roomDataArr?.length
  );

  const queryAction = useCallback(
    async (min: number, max: number) => {
      const { success, data } = await query.run({
        min: min.toString(),
        max: max.toString(),
      });
      if (!success) notify.show.error("ROOM LIST NO SUCCESS");
      if (success) {
        if (isInitialLoading) setListData(data);
        if (
          listData?.roomDataArr &&
          data.roomDataArr &&
          max > data.roomDataArr.length
        ) {
          setListData({
            ...listData,
            allCount: data.allCount,
            dev: data.dev,
            roomDataArr: listData.roomDataArr.concat(data.roomDataArr),
          });
        }
      }
    },
    [query],
  );

  //
  const revalidateInterval = 10000 as const;

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(listData?.roomDataArr?.length);
      if (listData?.roomDataArr) {
        const max = listData.roomDataArr.length;
        queryAction(0, max);
      }
    }, revalidateInterval);
    return () => clearInterval(interval);
  }, [listData]);

  // Initial load data
  useEffect(() => {
    // wrong roomId protection
    if (roomId && !checkRoomId(roomId)) navigate(routes.home.path);
    if (!listData) {
      queryAction(0, itemCountForInitialLoading);
    }
  }, []);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      if (
        !isInitialLoading &&
        !isAllLoaded &&
        !isZeroItemCount &&
        listData?.roomDataArr
      ) {
        const target = e.nativeEvent.target as HTMLElement;
        const lastVisibleIndex = Math.ceil(
          (target.scrollTop + target.offsetHeight) / itemHeight,
        );
        const lastLoadedIndex = listData.roomDataArr.length;
        const isNeedToLoad = !!(
          lastLoadedIndex - lastVisibleIndex <
          overscreenItemCountToTriggerFurtherLoading
        );

        if (isNeedToLoad) {
          const startItem = lastLoadedIndex;
          if (
            lastLoadedIndex + overscreenItemCountForFurtherLoading >
            listData.allCount
          ) {
            queryAction(lastLoadedIndex, listData.allCount);
          }
          if (lastVisibleIndex > lastLoadedIndex) {
            const stopItem =
              lastVisibleIndex + overscreenItemCountForFurtherLoading;
            stopItem > listData.allCount
              ? queryAction(startItem, listData.allCount)
              : queryAction(startItem, stopItem);
          } else {
            const stopItem = startItem + overscreenItemCountForFurtherLoading;
            queryAction(startItem, stopItem);
          }
        }
      }
    },
    [
      isAllLoaded,
      isInitialLoading,
      isZeroItemCount,
      listData?.allCount,
      listData?.roomDataArr,
      queryAction,
    ],
  );

  const debouncedHandleScroll = useMemo(
    () => debounce(handleScroll, debounceScrollDelay),
    [handleScroll],
  );

  if (isZeroItemCount) return <ListEmpty />;

  const count = getRandomInt(4, 12);
  if (!listData?.roomDataArr || isInitialLoading) {
    return (
      <ListWrapper>
        <SkeletonList count={count} />
      </ListWrapper>
    );
  }

  const items = listData.roomDataArr.map((itemData) => (
    <li key={itemData.roomId}>
      <Item isOpened={roomId === itemData.roomId} data={itemData} />
    </li>
  ));

  return (
    <ListWrapper onScroll={debouncedHandleScroll}>
      {items}
      {!isAllLoaded && (
        <SkeletonList count={listData.allCount - listData.roomDataArr.length} />
      )}
    </ListWrapper>
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
      className="w-full flex flex-col px-4 py-2 justify-between bg-slate-50 border-b-2 border-slate-200"
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

  return (
    <Link to={"/room/" + data.roomId}>
      <button
        style={itemHeightStyle}
        className={`${isOpened ? "bg-slate-200 hover:bg-slate-200 cursor-default" : "bg-slate-50 hover:bg-slate-200"} w-full flex flex-col py-1 px-4 justify-between items-center border-b-2 border-slate-200 duration-300 ease-out`}
      >
        <div className="w-full flex flex-row justify-between items-center gap-2">
          <p className="text-sm text-green-600">{data.roomName}</p>
          <p className="text-sm text-slate-600">{date}</p>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <p className="w-full text-sm text-left truncate">{lastMessage}</p>
          <UnreadCount count={data.unreadCount} />
        </div>
      </button>
    </Link>
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
