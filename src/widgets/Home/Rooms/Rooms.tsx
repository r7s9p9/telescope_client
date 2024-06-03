import { Link, Outlet, useLocation } from "react-router-dom";
import React, { Dispatch, ReactNode, memo, useEffect, useState } from "react";
import { formatDate } from "../../../shared/lib/date";
import { getRandomInt } from "../../../shared/lib/random";
import { routes } from "../../../constants";
import { IconCirclePlus, IconSearch } from "@tabler/icons-react";
import { useRooms } from "./useRooms";
import { ITEM_HEIGHT } from "./constants";
import { RoomType, SearchRoomsType } from "../../../shared/api/api.schema";
import { useQuerySearchRooms } from "../../../shared/api/api";
import { RoomId } from "../../../types";
import { IconButton } from "../../../shared/ui/IconButton/IconButton";
import { Input } from "../../../shared/ui/Input/Input";
import { Text } from "../../../shared/ui/Text/Text";

const itemHeightStyle = { height: ITEM_HEIGHT + "px" };

const SkeletonList = memo(({ count }: { count?: number }) => {
  if (!count) count = getRandomInt(4, 12);

  if (count > 0) {
    return Array(count)
      .fill(1)
      .map((_, i) => (
        <li key={i}>
          <ItemSkeleton />
        </li>
      ));
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
        <FoundRooms
          isLoading={querySearch.isLoading}
          data={foundRooms}
          openedRoomId={roomId as RoomId}
        />
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
      <div className="h-full flex flex-col w-1/2 min-w-64 max-w-sm bg-slate-50">
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
  isLoading,
}: {
  data: SearchRoomsType | null;
  openedRoomId: RoomId;
  isLoading: boolean;
}) {
  if (isLoading) return <FoundRoomsSkeleton />;
  if (data && !data.isEmpty) {
    const items = data.rooms.map((item) => (
      <li key={item.roomId}>
        <FoundItem isOpened={openedRoomId === item.roomId} data={item} />
      </li>
    ));
    return <>{items}</>;
  }
  if (data?.isEmpty) {
    return (
      <Text size="md" font="thin" className="text-center">
        No rooms found
      </Text>
    );
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
      <Text size="sm" font="light" className="text-green-600">
        {data.name}
      </Text>
      <Text size="sm" font="light" className="text-slate-600">
        {membersStr}
      </Text>
    </Link>
  );
}

const FoundRoomsSkeleton = memo(() => {
  const skeleton = (
    <div
      style={itemHeightStyle}
      className={`bg-slate-100 w-full flex flex-col px-4 py-2 justify-between select-none animate-pulse`}
    >
      <div className="w-48 h-4 bg-slate-200 rounded-full" />
      <div className="w-24 h-4 bg-slate-200 rounded-full" />
    </div>
  );

  const count = getRandomInt(2, 6);

  return Array(count)
    .fill(1)
    .map((_, i) => <li key={i}>{skeleton}</li>);
});

function Title() {
  return (
    <div className="h-16 w-full flex justify-between items-center">
      <Text size="xl" font="thin" uppercase letterSpacing>
        Rooms
      </Text>
      <Link to={routes.createRoom.path}>
        <IconButton title={"Create new room"} noHover>
          <IconCirclePlus
            strokeWidth="1"
            className="text-slate-600"
            size={32}
          />
        </IconButton>
      </Link>
    </div>
  );
}

function ListEmpty() {
  return (
    <div
      style={itemHeightStyle}
      className="flex flex-col justify-center items-center w-full h-full px-4 bg-slate-200"
    >
      <Text size="sm" font="light" className="text-center">
        You don't have any rooms yet
      </Text>
      <Text size="sm" font="light" className="text-center">
        Create your own room or find a public room and join it
      </Text>
    </div>
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
        <Text size="sm" font="light" className="text-green-600">
          {data.name}
        </Text>
        <Text size="sm" font="light" className="text-slate-600">
          {date}
        </Text>
      </div>
      <div className="w-full flex flex-row gap-2 justify-start items-center">
        {lastUsername && (
          <Text size="sm" font="default" className="text-blue-600">
            {lastUsername}:
          </Text>
        )}
        <Text size="sm" font="light" className="text-slate-600 truncate">
          {lastMessage}
        </Text>
        <UnreadCount count={data.unreadCount} />
      </div>
    </Link>
  );
}

function UnreadCount({ count }: { count: number }) {
  if (count !== 0) {
    return (
      <>
        <div className="grow" />
        <Text
          size="sm"
          font="light"
          className="shrink-0 size-6 flex justify-center items-center bg-slate-300 rounded-full"
        >
          {count > 9 ? "9+" : count}
        </Text>
      </>
    );
  }
}
