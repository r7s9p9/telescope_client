import { Link, Outlet, useLocation } from "react-router-dom";
import { UIEvent, ReactNode, memo, JSX } from "react";
import { formatDate } from "../../../shared/lib/date";
import { getRandomInt } from "../../../shared/lib/random";
import { routes } from "../../../constants";
import { IconCirclePlus, IconSearch, IconX } from "@tabler/icons-react";
import { useRooms, useTitle } from "./useRooms";
import { ITEM_HEIGHT } from "./constants";
import {
  RoomType,
  RoomId,
  SearchRoomsResponseType,
} from "../../../shared/api/api.schema";
import { IconButton } from "../../../shared/ui/IconButton/IconButton";
import { Input } from "../../../shared/ui/Input/Input";
import { Text } from "../../../shared/ui/Text/Text";
import { Paper } from "../../../shared/ui/Paper/Paper";
import { useLang } from "../../../shared/features/LangProvider/LangProvider";

const itemHeightStyle = { height: ITEM_HEIGHT + "px" };

// eslint-disable-next-line react/display-name
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
    lang,
  } = useRooms();

  if (isSearch) {
    return (
      <Wrapper
        isSearch={isSearch}
        searchValue={search.value}
        setSearchValue={setSearchValue}
        lang={lang}
      >
        <FoundRooms
          isLoading={isLoadingSearch}
          data={foundRooms}
          openedRoomId={roomId as RoomId}
          error={search.error}
          lang={lang}
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
        lang={lang}
      >
        <ListEmpty lang={lang} />
      </Wrapper>
    );

  if (!storedRooms) {
    return (
      <Wrapper
        isSearch={isSearch}
        searchValue={search.value}
        setSearchValue={setSearchValue}
        lang={lang}
      >
        <SkeletonList />
      </Wrapper>
    );
  }

  const items = storedRooms.map((itemData) => (
    <Item
      key={itemData.roomId}
      isOpened={roomId === itemData.roomId}
      data={itemData}
      lang={lang}
    />
  ));

  return (
    <Wrapper
      isSearch={isSearch}
      searchValue={search.value}
      setSearchValue={setSearchValue}
      onScroll={debouncedHandleScroll}
      lang={lang}
    >
      {items}
      {!isAllLoaded && <SkeletonList count={allCount - storedRooms.length} />}
    </Wrapper>
  );
}

function Wrapper({
  children,
  lang,
  isSearch,
  searchValue,
  setSearchValue,
  onScroll,
}: {
  children: ReactNode;
  lang: ReturnType<typeof useLang>["lang"];
  isSearch: boolean;
  searchValue: string;
  // eslint-disable-next-line no-unused-vars
  setSearchValue: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onScroll?: (e: UIEvent<HTMLElement>) => void;
}) {
  return (
    <>
      <div className="h-full flex flex-col md:w-1/2 md:min-w-72 md:max-w-sm bg-slate-50 border-t-2 border-slate-100 md:border-0">
        <div className="pb-4 px-4 flex flex-col items-center">
          <Title lang={lang} />
          <Input
            value={searchValue}
            setValue={setSearchValue}
            placeholder={lang.rooms.SEARCH_PLACEHOLDER}
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
          className="overflow-y-auto overscroll-none scroll-smooth w-full h-full flex flex-col"
        >
          {children}
        </ul>
      </div>
      <Outlet key={useLocation().pathname} />
    </>
  );
}

function Title({ lang }: { lang: ReturnType<typeof useLang>["lang"] }) {
  const { onCreate } = useTitle();

  return (
    <div className="h-16 w-full flex justify-between items-center">
      <Text size="xl" font="thin" uppercase letterSpacing>
        {lang.rooms.TITLE}
      </Text>
      <IconButton
        title={lang.rooms.BUTTON_CREATE_LABEL}
        noHover
        onClick={onCreate}
      >
        <IconCirclePlus strokeWidth="1" className="text-slate-600" size={32} />
      </IconButton>
    </div>
  );
}

function FoundRooms({
  data,
  openedRoomId,
  isLoading,
  error,
  lang,
}: {
  data: SearchRoomsResponseType | null;
  openedRoomId: RoomId;
  isLoading: boolean;
  error: string;
  lang: ReturnType<typeof useLang>["lang"];
}) {
  if (isLoading) return <FoundRoomsSkeleton />;

  const textProps = {
    size: "md" as const,
    font: "thin" as const,
    className: "text-center",
  };

  if (error) {
    return <Text {...textProps}>{error}</Text>;
  }

  if (data?.isEmpty) {
    return <Text {...textProps}>{lang.rooms.NO_ROOMS_FOUND}</Text>;
  }

  if (data) {
    const items = data.rooms.map((item) => (
      <FoundItem
        key={item.roomId}
        isOpened={openedRoomId === item.roomId}
        data={item}
        lang={lang}
      />
    ));
    return <>{items}</>;
  }
}

function FoundItem({
  isOpened,
  data,
  lang,
}: {
  isOpened: boolean;
  data: { name: string; userCount: number; roomId: RoomId };
  lang: ReturnType<typeof useLang>["lang"];
}) {
  let membersStr = "";
  if (data.userCount === 0) membersStr = lang.rooms.FOUND_ITEM_NO_MEMBERS;
  if (data.userCount === 1) membersStr = lang.rooms.FOUND_ITEM_ONE_MEMBER;
  if (data.userCount > 1)
    membersStr = lang.rooms.FOUND_ITEM_MEMBERS(data.userCount);

  const textProps = {
    size: "sm" as const,
    font: "light" as const,
  };

  return (
    <li
      style={itemHeightStyle}
      className={`${isOpened ? "bg-slate-200 cursor-default" : "bg-slate-50"} w-full flex flex-col px-4 py-2 justify-between hover:bg-slate-200 duration-300 ease-out`}
    >
      <Link to={`${routes.rooms.path}/${data.roomId}`}>
        <Text {...textProps} className="text-green-600">
          {data.name}
        </Text>
        <Text {...textProps} className="text-slate-600">
          {membersStr}
        </Text>
      </Link>
    </li>
  );
}

// eslint-disable-next-line react/display-name
const FoundRoomsSkeleton = memo(() => {
  const skeleton = (
    <div
      style={itemHeightStyle}
      className={`w-full flex flex-col px-4 py-2 justify-between select-none animate-pulse`}
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

function ListEmpty({ lang }: { lang: ReturnType<typeof useLang>["lang"] }) {
  const textProps = {
    size: "sm" as const,
    font: "light" as const,
    className: "text-center",
  };
  return (
    <Paper
      padding={4}
      rounded="md"
      className="mt-1 mx-4 ring-2 ring-slate-200 bg-slate-100"
    >
      <Text {...textProps}>{lang.rooms.NO_ROOMS_HEAD}</Text>
      <Text {...textProps}>{lang.rooms.NO_ROOMS_TAIL}</Text>
    </Paper>
  );
}

function Item({
  isOpened,
  data,
  lang,
}: {
  isOpened: boolean;
  data: RoomType;
  lang: ReturnType<typeof useLang>["lang"];
}) {
  const date = data.lastMessage
    ? formatDate().roomList(data.lastMessage.created)
    : ("Never" as const);

  const lastMessage = data.lastMessage
    ? data.lastMessage.content.text
    : lang.rooms.NO_LAST_MESSAGE;

  let username: JSX.Element = <></>;

  const textProps = {
    size: "sm" as const,
    font: "light" as const,
  };

  if (data?.lastMessage?.authorId === "self") {
    username = (
      <Text {...textProps} className="text-green-600">
        {lang.rooms.LAST_MESSAGE_AUTHOR_YOU}
      </Text>
    );
  } else if (data?.lastMessage?.username) {
    username = (
      <Text {...textProps} className="text-gray-600">
        {data.lastMessage.username}:
      </Text>
    );
  } else if (data?.lastMessage?.authorId === "service") {
    username = (
      <Text {...textProps} className="text-blue-600">
        {lang.rooms.LAST_MESSAGE_AUTHOR_SERVICE}
      </Text>
    );
  }

  return (
    <Link to={`${routes.rooms.path}/${data.roomId}`}>
      <li
        style={itemHeightStyle}
        className={`${isOpened ? "bg-slate-200 cursor-default" : "bg-slate-50"} w-full flex flex-col px-4 py-2 justify-between items-center hover:bg-slate-200 duration-300 ease-out`}
      >
        <div className="w-full flex flex-row justify-between items-center gap-2">
          <Text {...textProps} className="truncate text-gray-600">
            {data.name}
          </Text>
          <Text {...textProps} className="text-gray-600">
            {date}
          </Text>
        </div>
        <div className="w-full flex flex-row gap-2 justify-start items-center">
          {username}
          <Text {...textProps} className="truncate text-gray-600">
            {lastMessage}
          </Text>
          <UnreadCount count={data.unreadCount} />
        </div>
      </li>
    </Link>
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

function UnreadCount({ count }: { count: number }) {
  if (count !== 0) {
    return (
      <>
        <div className="grow" />
        <Text
          size="sm"
          font="light"
          className="shrink-0 size-6 flex justify-center items-center rounded-full border-2 border-gray-400"
        >
          {count > 9 ? "9+" : count}
        </Text>
      </>
    );
  }
}
