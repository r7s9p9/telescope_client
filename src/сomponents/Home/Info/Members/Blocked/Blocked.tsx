import {
  IconCopy,
  IconLockOpen,
  IconRefresh,
  IconUserScan,
  IconX,
} from "@tabler/icons-react";
import { IconButton } from "../../../../../shared/ui/IconButton/IconButton";
import { Paper } from "../../../../../shared/ui/Paper/Paper";
import { Text } from "../../../../../shared/ui/Text/Text";
import { useBlocked } from "./useBlocked";
import { Overlay } from "../../../../../shared/ui/Overlay/Overlay";
import { RoomId, UserId } from "../../../../../types";
import { routes } from "../../../../../constants";
import { Link } from "react-router-dom";
import { ReactNode, RefObject } from "react";
import { Spinner } from "../../../../../shared/ui/Spinner/Spinner";
import { AccountReadType } from "../../../../../shared/api/api.schema";
import { formatDate } from "../../../../../shared/lib/date";
import { Button } from "../../../../../shared/ui/Button/Button";

export function BlockedUsers() {
  const {
    roomId,
    reload,
    isLoading,
    isEmpty,
    blockedUsers,
    openMenu,
    onClickMenuHandler,
  } = useBlocked();

  let blockedUsersContent: JSX.Element = <></>;

  if (isLoading) {
    blockedUsersContent = (
      <ListWrapper>
        <Spinner size={128} className="self-center" />
      </ListWrapper>
    );
  } else if (isEmpty) {
    blockedUsersContent = (
      <ListWrapper>
        <NoBlockedUsers />
      </ListWrapper>
    );
  } else if (blockedUsers) {
    blockedUsersContent = (
      <ListWrapper>
        {blockedUsers.map((user) => (
          <BlockedUser
            key={user.targetUserId}
            data={user}
            openMenu={openMenu}
            onClickMenuHandler={onClickMenuHandler}
          />
        ))}
      </ListWrapper>
    );
  }

  return (
    <Overlay>
      <Paper
        padding={4}
        rounded="lg"
        shadow="md"
        className="flex flex-col bg-slate-50"
      >
        <Title roomId={roomId} reload={reload} />
        {blockedUsersContent}
      </Paper>
    </Overlay>
  );
}

function Title({ roomId, reload }: { roomId: RoomId; reload: () => void }) {
  return (
    <div className="w-96 bg-slate-50 flex items-center justify-between gap-2">
      <Text size="xl" font="thin" uppercase letterSpacing className="grow">
        Blocked users
      </Text>
      <IconButton title="Refresh users" onClick={reload}>
        <IconRefresh className="text-slate-600" strokeWidth="1" size={32} />
      </IconButton>
      <Link to={routes.rooms.path + roomId + "/info"}>
        <IconButton title="Exit">
          <IconX className="text-slate-600" strokeWidth="1" size={32} />
        </IconButton>
      </Link>
    </div>
  );
}

function ListWrapper({
  children,
  listRef,
  onScroll,
}: {
  children: ReactNode;
  listRef?: RefObject<HTMLUListElement>;
  onScroll?: (e: React.UIEvent<HTMLElement>) => void;
}) {
  return (
    <ul
      onScroll={onScroll}
      ref={listRef}
      className="w-full h-[450px] overflow-scroll overscroll-none flex flex-col justify-center gap-2"
    >
      {children}
    </ul>
  );
}

function NoBlockedUsers() {
  return (
    <Text size="md" font="light" className="text-center select-none">
      There are no blocked users in this room
    </Text>
  );
}

function BlockedUser({
  data,
  openMenu,
  onClickMenuHandler,
}: {
  data: AccountReadType;
  openMenu: ReturnType<typeof useBlocked>["openMenu"];
  onClickMenuHandler: ReturnType<typeof useBlocked>["onClickMenuHandler"];
}) {
  let lastSeenStr;
  let memberState: "online" | "offline" | "invisible" | "you";
  if (data.targetUserId === "self") {
    memberState = "you";
  } else if (!data.general?.lastSeen) {
    memberState = "invisible";
  } else {
    const { result, range } = formatDate().member(data.general.lastSeen);
    if (range === "seconds") {
      memberState = "online";
    } else {
      memberState = "offline";
      lastSeenStr = `Last seen: ${result}`;
    }
  }

  function onContextHandler(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    openMenu(
      e,
      <UserContextMenu data={data} onClickMenuHandler={onClickMenuHandler} />,
    );
  }

  return (
    <Paper
      onContextMenu={(e) => onContextHandler(e)}
      padding={2}
      rounded="md"
      inList
      className="h-14 shrink-0 border-2 border-slate-200 bg-slate-50 hover:bg-slate-200 duration-300 ease-in-out flex"
    >
      <div className="grow flex flex-col">
        <Text size="sm" font="bold">
          @{data.general?.username}
        </Text>
        <Text size="sm" font="light">
          Name: {data.general?.name}
        </Text>
      </div>
      <div className="flex flex-col items-end">
        <Text
          size="sm"
          font="light"
          capitalize
          className={
            memberState === "online" || memberState === "you"
              ? "text-green-600 select-none"
              : "text-slate-600 select-none"
          }
        >
          {memberState}
        </Text>
        {memberState === "offline" && (
          <Text size="sm" font="light" className="select-none">
            {lastSeenStr}
          </Text>
        )}
      </div>
    </Paper>
  );
}

function UserContextMenu({
  data,
  onClickMenuHandler,
}: {
  data: AccountReadType;
  onClickMenuHandler: ReturnType<typeof useBlocked>["onClickMenuHandler"];
}) {
  return (
    <Paper rounded="lg" shadow="md" className="flex flex-col m-2 w-56">
      <Button
        title="Go to profile"
        size="md"
        unstyled
        padding={24}
        className="hover:bg-slate-200 rounded-t-lg gap-4"
        onClick={() =>
          onClickMenuHandler().profile(data.targetUserId as UserId)
        }
      >
        <>
          <IconUserScan
            className="text-slate-600"
            strokeWidth="1.5"
            size={24}
          />
          <Text size="md" font="default" className="text-slate-600">
            Go to profile
          </Text>
        </>
      </Button>
      <Button
        title="Copy username"
        size="md"
        unstyled
        padding={24}
        className="hover:bg-slate-200 gap-4"
        onClick={() =>
          onClickMenuHandler().copy(data.general?.username as string)
        }
      >
        <>
          <IconCopy className="text-slate-600" strokeWidth="1.5" size={24} />
          <Text size="md" font="default" className="text-slate-600">
            Copy username
          </Text>
        </>
      </Button>
      <Button
        title="Unban"
        size="md"
        unstyled
        padding={24}
        className="w-54 hover:bg-slate-200 rounded-b-lg gap-4"
        onClick={() =>
          onClickMenuHandler().unban(
            data.targetUserId as UserId,
            data.general?.username as string,
          )
        }
      >
        <>
          <IconLockOpen
            className="text-green-600"
            strokeWidth="1.5"
            size={24}
          />
          <Text size="md" font="default" className="text-green-600">
            Unban
          </Text>
        </>
      </Button>
    </Paper>
  );
}
