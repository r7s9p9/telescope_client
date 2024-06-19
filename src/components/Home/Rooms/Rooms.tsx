import { Link, Outlet, useLocation } from "react-router-dom";
import { UIEvent, ReactNode, memo } from "react";
import { formatDate } from "../../../shared/lib/date";
import { getRandomInt } from "../../../shared/lib/random";
import { routes } from "../../../constants";
import { IconCirclePlus, IconSearch, IconX } from "@tabler/icons-react";
import { useRooms } from "./useRooms";
import { ITEM_HEIGHT } from "./constants";
import {
  RoomType,
  RoomId,
  SearchRoomsResponseType,
} from "../../../shared/api/api.schema";
import { IconButton } from "../../../shared/ui/IconButton/IconButton";
import { Input } from "../../../shared/ui/Input/Input";
import { Text } from "../../../shared/ui/Text/Text";

const itemHeightStyle = { height: ITEM_HEIGHT + "px" };

const SkeletonList = memo(({ count }: { count?: number }) => {
  if (!count) count = getRandomInt(4, 12);
  return Array(count)
    .fill(1)
    .map((_, i) => (
      <li key={i}>
        <ItemSkeleton />
      </li>
    ));
});

export function Rooms() {
  const {
    isZeroItemCount,
    isAllLoaded,
    roomId,
    storedRooms,
    allCount,
    debouncedHandleScroll,
    foundRooms,
    search,
    setSearchValue,
    isSearch,
    isLoadingSearch,
  } = useRooms();

  if (isSearch) {
    return (
      <Wrapper
        isSearch={isSearch}
        searchValue={search.value}
        setSearchValue={setSearchValue}
      >
        <FoundRooms
          isLoading={isLoadingSearch}
          data={foundRooms}
          openedRoomId={roomId as RoomId}
          error={search.error}
        />
      </Wrapper>
    );
  }

  if (isZeroItemCount)
    return (
      <Wrapper
        isSearch={isSearch}
        searchValue={search.value}
        setSearchValue={setSearchValue}
      >
        <ListEmpty />
      </Wrapper>
    );

  if (!storedRooms) {
    return (
      <Wrapper
        isSearch={isSearch}
        searchValue={search.value}
        setSearchValue={setSearchValue}
      >
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
      isSearch={isSearch}
      searchValue={search.value}
      setSearchValue={setSearchValue}
      onScroll={debouncedHandleScroll}
    >
      {items}
      {!isAllLoaded && <SkeletonList count={allCount - storedRooms.length} />}
    </Wrapper>
  );
}

function Wrapper({
  children,
  isSearch,
  searchValue,
  setSearchValue,
  onScroll,
}: {
  children: ReactNode;
  isSearch: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  onScroll?: (e: UIEvent<HTMLElement>) => void;
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
              <>
                {isSearch && (
                  <IconX
                    onClick={() => setSearchValue("")}
                    className="text-slate-400 cursor-pointer"
                    strokeWidth="1"
                    size={24}
                  />
                )}
                {!isSearch && (
                  <IconSearch
                    className="text-slate-400"
                    strokeWidth="1"
                    size={24}
                  />
                )}
              </>
            }
          />
        </div>
        <ul
          onScroll={onScroll}
          className="overflow-y-auto overscroll-none scroll-smooth w-full flex flex-col bg-slate-50"
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
  error,
}: {
  data: SearchRoomsResponseType | null;
  openedRoomId: RoomId;
  isLoading: boolean;
  error: string;
}) {
  if (isLoading) return <FoundRoomsSkeleton />;
  if (error) {
    return (
      <Text size="md" font="thin" className="text-center">
        {error}
      </Text>
    );
  }
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

  let username: JSX.Element = <></>;

  if (data?.lastMessage?.authorId === "self") {
    username = (
      <Text size="sm" font="light" className="text-green-600">
        You:
      </Text>
    );
  } else if (data?.lastMessage?.username) {
    username = (
      <Text size="sm" font="light" className="text-gray-600">
        {data.lastMessage.username}:
      </Text>
    );
  } else if (data?.lastMessage?.authorId === "service") {
    username = (
      <Text size="sm" font="light" className="text-blue-600">
        Service:
      </Text>
    );
  }

  return (
    <Link
      to={routes.rooms.path + data.roomId}
      style={itemHeightStyle}
      className={`${isOpened ? "bg-slate-200 cursor-default" : "bg-slate-50"} w-full flex flex-col px-4 py-2 justify-between items-center hover:bg-slate-200 duration-300 ease-out`}
    >
      <div className="w-full flex flex-row justify-between items-center gap-2">
        <Text size="sm" font="light" className="text-gray-600">
          {data.name}
        </Text>
        <Text size="sm" font="light" className="text-gray-600">
          {date}
        </Text>
      </div>
      <div className="w-full flex flex-row gap-2 justify-start items-center">
        {username}
        <Text size="sm" font="light" className="truncate text-gray-600">
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
