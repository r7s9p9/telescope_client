import { Link, useNavigate, useParams } from "react-router-dom";
import { RoomInListType, RoomListType } from "../../../shared/api/api.schema";
import { ReactNode, useEffect, useRef, useState } from "react";
import { formatDate } from "../../../shared/lib/date";
import { useNotify } from "../../notification/notification";
import { useQueryRoomList } from "../../../shared/api/api";
import { getRandomInt } from "../../../shared/lib/random";
import { checkRoomId } from "../../../shared/lib/uuid";
import { routes } from "../../../constants";
import throttle from "../../../shared/lib/throttle";
import { debounce } from "../../../shared/lib/debounce";

type ListType = HTMLUListElement;
type ListRef = React.RefObject<ListType>;

const itemHeight = 64 as const; // for skeleton & item

const overscreenItemCountForInitialLoading = 6 as const;
const overscreenItemCountToTriggerFurtherLoading = 4 as const;
const overscreenItemCountForFurtherLoading = 6 as const;
const debounceScrollDelay = 200 as const;

export function RoomList() {
  const notify = useNotify();
  const navigate = useNavigate();
  const query = useQueryRoomList();
  const { roomId } = useParams();
  const listRef = useRef<ListType>(null);
  const [listData, setListData] = useState<RoomListType>();

  const isInitialLoading = !listData?.roomDataArr;
  const isZeroItemCount = listData?.allCount === 0;
  const isAllLoaded = !!(
    listData && listData.allCount === listData.roomDataArr?.length
  );

  const queryAction = async (min: number, max: number) => {
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
  };

  function debouncedQueryAction(min: number, max: number, delay: number) {
    debounce(() => {
      queryAction(min, max);
    }, delay);
  }

  // Initial load data
  useEffect(() => {
    // wrong roomId protection
    if (roomId && !checkRoomId(roomId)) navigate(routes.home.path);
    if (!listData && listRef.current) {
      const onscreenItemCount = Math.ceil(
        listRef.current.offsetHeight / itemHeight,
      );
      const stopItem = onscreenItemCount + overscreenItemCountForInitialLoading;
      queryAction(0, stopItem);
    }
  }, []);

  const debouncedHandleScroll = debounce(() => {
    if (
      !isInitialLoading &&
      !isAllLoaded &&
      !isZeroItemCount &&
      listRef.current &&
      listData?.roomDataArr
    ) {
      const lastVisibleIndex = Math.ceil(
        (listRef.current.scrollTop + listRef.current.offsetHeight) / itemHeight,
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
  }, debounceScrollDelay);

  if (isZeroItemCount) return <ListEmpty listRef={listRef} />;

  if (!listData?.roomDataArr || isInitialLoading)
    return <ListSkeleton listRef={listRef} />;

  const items = listData.roomDataArr.map((itemData) => (
    <li key={itemData.roomId}>
      <Item isOpened={roomId === itemData.roomId} data={itemData} />
    </li>
  ));

  const skeletonAdder = () => {
    if (listData.roomDataArr) {
      const count = listData.allCount - listData.roomDataArr.length;
      const skeletonItems = Array(count)
        .fill(1)
        .map((_, i) => (
          <li key={i}>
            <ItemSkeleton />
          </li>
        ));
      return items.concat(skeletonItems);
    }
  };

  return (
    <ListWrapper listRef={listRef} handleScroll={debouncedHandleScroll}>
      {isAllLoaded ? items : skeletonAdder()}
    </ListWrapper>
  );
}

function ListWrapper({
  children,
  listRef,
  handleScroll,
}: {
  children: ReactNode;
  listRef: ListRef;
  handleScroll?: ReturnType<typeof Function>;
}) {
  function onScroll() {
    if (handleScroll) handleScroll();
  }

  return (
    <ul
      onScroll={() => onScroll()}
      onClick={() => onScroll()}
      className="overflow-y-scroll overscroll-none scroll-smooth w-full h-full flex flex-col bg-slate-50"
      ref={listRef}
    >
      {children}
    </ul>
  );
}

function ListEmpty({ listRef }: { listRef: ListRef }) {
  return (
    <ListWrapper listRef={listRef}>
      <p
        style={{ height: itemHeight + "px" }}
        className="w-full text-center p-4 font-thin text-xl bg-slate-100"
      >
        You have no rooms
      </p>
    </ListWrapper>
  );
}

function ListSkeleton({ listRef }: { listRef: ListRef }) {
  const count = getRandomInt(4, 12);
  return (
    <ListWrapper listRef={listRef}>
      {Array(count)
        .fill(1)
        .map((_, i) => (
          <li key={i}>
            <ItemSkeleton />
          </li>
        ))}
    </ListWrapper>
  );
}

function ItemSkeleton() {
  return (
    <div
      style={{ height: itemHeight + "px" }}
      className="w-full flex flex-col px-4 py-2 justify-between bg-slate-50 border-b-2 border-slate-200"
    >
      <div className="flex justify-between animate-pulse">
        <div className="rounded-md h-4 w-2/5 bg-slate-200"></div>
        <div className="w-16 rounded-md h-4 w-1/5 bg-slate-200"></div>
      </div>
      <div className="h-4 w-3/5 rounded-md bg-slate-200 animate-pulse"></div>
    </div>
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
        style={{ height: itemHeight + "px" }}
        className={`${isOpened ? "bg-slate-200 hover:bg-slate-200 cursor-default" : "bg-slate-50 hover:bg-slate-200"} w-full flex flex-col py-1 px-4 justify-between items-center border-b-2 border-slate-200 duration-300 ease-out`}
      >
        <div className="w-full flex flex-row justify-between items-center gap-2">
          <p className="text-sm text-green-600">{data.roomInfo.name}</p>
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
