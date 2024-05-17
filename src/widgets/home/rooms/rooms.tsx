import { Link, Outlet, useLocation } from "react-router-dom";
import React, { Dispatch, ReactNode, useEffect, useState } from "react";
import { formatDate } from "../../../shared/lib/date";
import { getRandomInt } from "../../../shared/lib/random";
import { routes } from "../../../constants";
import { IconCirclePlus, IconSearch } from "@tabler/icons-react";
import { useRooms } from "./useRooms";
import { ITEM_HEIGHT } from "./constants";
import { RoomType, SearchRoomsType } from "../../../shared/api/api.schema";
import { useQuerySearchRooms } from "../../../shared/api/api";
import { RoomId } from "../../../types";
import { Button } from "../../../shared/ui/Button/Button";
import { Input } from "../../../shared/ui/input/input";
import { Text } from "../../../shared/ui/text/text";

const itemHeightStyle = { height: ITEM_HEIGHT + "px" };

const SkeletonList = React.memo(({ count }: { count?: number }) => {
  if (!count) count = getRandomInt(4, 12);

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

export function Rooms() {
  const {
    isZeroItemCount,
    isAllLoaded,
    roomId,
    storedData,
    debouncedHandleScroll,
  } = useRooms();

  const storedRooms = storedData?.items;

  const [searchValue, setSearchValue] = useState("");
  const [foundRooms, setFoundRooms] = useState<SearchRoomsType | null>(null);

  const querySearch = useQuerySearchRooms();

  const isSearch = searchValue !== "";

  useEffect(() => {
    const action = async () => {
      const { success, data } = await querySearch.run(searchValue);
      if (success) setFoundRooms(data);
    };
    if (isSearch) action();
    if (!isSearch) setFoundRooms(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, isSearch]);

  if (searchValue !== "") {
    return (
      <Wrapper searchValue={searchValue} setSearchValue={setSearchValue}>
        <FoundRooms data={foundRooms} openedRoomId={roomId as RoomId} />
      </Wrapper>
    );
  }

  if (isZeroItemCount)
    return (
      <Wrapper searchValue={searchValue} setSearchValue={setSearchValue}>
        <ListEmpty />
      </Wrapper>
    );

  if (!storedRooms) {
    return (
      <Wrapper searchValue={searchValue} setSearchValue={setSearchValue}>
        <SkeletonList />
      </Wrapper>
    );
  }

  const items = storedRooms.map((itemData) => (
    <li key={itemData.roomId}>
      <Item isOpened={roomId === itemData.roomId} data={itemData} />
    </li>
  ));

  return (
    <Wrapper
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      onScroll={debouncedHandleScroll}
    >
      {items}
      {!isAllLoaded && (
        <SkeletonList count={storedData.allCount - storedRooms.length} />
      )}
    </Wrapper>
  );
}

function Wrapper({
  children,
  searchValue,
  setSearchValue,
  onScroll,
}: {
  children: ReactNode;
  searchValue: string;
  setSearchValue: Dispatch<React.SetStateAction<string>>;
  onScroll?: (e: React.UIEvent<HTMLElement>) => void;
}) {
  return (
    <>
      <div className="h-full flex flex-col w-1/2 min-w-52 max-w-xs bg-slate-50">
        <div className="pb-4 px-4 flex flex-col items-center">
          <Title />
          <Input
            value={searchValue}
            setValue={setSearchValue}
            placeholder="Search..."
            size="md"
            rightSection={
              <IconSearch
                className="text-slate-400"
                strokeWidth="1"
                size={24}
              />
            }
          />
        </div>
        <ul
          onScroll={onScroll}
          className="overflow-y-scroll overscroll-none scroll-smooth w-full flex flex-col bg-slate-50"
        >
          {children}
        </ul>
      </div>
      <Outlet key={useLocation().pathname} />
    </>
  );
}

function FoundRooms({
  data,
  openedRoomId,
}: {
  data: SearchRoomsType | null;
  openedRoomId: RoomId;
}) {
  if (data && !data.isEmpty) {
    const items = data.rooms.map((item) => (
      <li key={item.roomId}>
        <FoundItem isOpened={openedRoomId === item.roomId} data={item} />
      </li>
    ));

    return <>{items}</>;
  }
}

function FoundItem({
  isOpened,
  data,
}: {
  isOpened: boolean;
  data: { name: string; userCount: number; roomId: RoomId };
}) {
  let membersStr = "";
  if (data.userCount === 0) membersStr = "No members";
  if (data.userCount === 1) membersStr = "1 member";
  if (data.userCount > 1) membersStr = `${data.userCount} members`;

  return (
    <Link
      to={routes.rooms.path + data.roomId}
      style={itemHeightStyle}
      className={`${isOpened ? "bg-slate-200 cursor-default" : "bg-slate-50"} w-full flex flex-col px-4 py-2 justify-between hover:bg-slate-200 duration-300 ease-out`}
    >
      <p className="text-md text-green-600 font-light">{data.name}</p>
      <p className="text-sm text-slate-600 font-light">{membersStr}</p>
    </Link>
  );
}

function Title() {
  return (
    <div className="h-16 py-2 w-full flex justify-between items-center">
      <Text size="xl" font="thin" uppercase letterSpacing>
        Rooms
      </Text>
      <Link to={routes.createRoom.path}>
        <Button title={"Create new room"} rounded={"full"} noHover>
          <IconCirclePlus
            strokeWidth="1"
            className="text-slate-600"
            size={32}
          />
        </Button>
      </Link>
    </div>
  );
}

function ListEmpty() {
  return (
    <p
      style={itemHeightStyle}
      className="w-full text-center p-4 font-thin text-xl bg-slate-100"
    >
      You have no rooms
    </p>
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

function Item({ isOpened, data }: { isOpened: boolean; data: RoomType }) {
  const date = data.lastMessage
    ? formatDate().roomList(data.lastMessage.created)
    : ("Never" as const);

  const lastMessage = data.lastMessage
    ? data.lastMessage.content.text
    : "There is no messages";

  let lastUsername: string | false = false;
  if (data.lastMessage) {
    if (data.lastMessage.authorId === "self") {
      lastUsername = "You" as const;
    } else if (data.lastMessage.username) {
      lastUsername = data.lastMessage.username;
    }
  }

  return (
    <Link
      to={routes.rooms.path + data.roomId}
      style={itemHeightStyle}
      className={`${isOpened ? "bg-slate-200 cursor-default" : "bg-slate-50"} w-full flex flex-col px-4 py-2 justify-between items-center hover:bg-slate-200 duration-300 ease-out`}
    >
      <div className="w-full flex flex-row justify-between items-center gap-2">
        <p className="text-md text-green-600 font-light">{data.name}</p>
        <p className="text-sm text-slate-600 font-light">{date}</p>
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
