import {
  IconCopy,
  IconLockOpen,
  IconRefresh,
  IconUserScan,
} from "@tabler/icons-react";
import { IconButton } from "../../../../../shared/ui/IconButton/IconButton";
import { Paper } from "../../../../../shared/ui/Paper/Paper";
import { Text } from "../../../../../shared/ui/Text/Text";
import { useBlocked } from "./useBlocked";
import { UserId } from "../../../../../shared/api/api.schema";
import { ReactNode, RefObject, JSX, UIEvent, MouseEvent } from "react";
import { Spinner } from "../../../../../shared/ui/Spinner/Spinner";
import { ReadAccountResponseType } from "../../../../../shared/api/api.schema";
import { formatDate } from "../../../../../shared/lib/date";
import { Button } from "../../../../../shared/ui/Button/Button";
import { Popup } from "../../../../../shared/ui/Popup/Popup";
import { langBlocked } from "../../../../../locales/en";

const iconProps = {
  className: "text-slate-600",
  strokeWidth: "1",
  size: 32,
};

export function BlockedUsers() {
  const {
    reload,
    isLoading,
    isEmpty,
    blockedUsers,
    openMenu,
    onClickMenuHandler,
    onClose,
    contentRef,
    overlayRef,
  } = useBlocked();

  let blockedUsersContent: JSX.Element = <></>;

  if (isLoading) {
    blockedUsersContent = (
      <ListWrapper>
        <Spinner size={128} className="m-auto" />
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
    <Popup
      titleText={langBlocked.POPUP_TITLE}
      contentRef={contentRef}
      overlayRef={overlayRef}
      onClose={onClose}
      rightSection={
        <IconButton title={langBlocked.BUTTON_REFRESH_LABEL} onClick={reload}>
          <IconRefresh {...iconProps} />
        </IconButton>
      }
    >
      {blockedUsersContent}
    </Popup>
  );
}

function ListWrapper({
  children,
  listRef,
  onScroll,
}: {
  children: ReactNode;
  listRef?: RefObject<HTMLUListElement>;
  // eslint-disable-next-line no-unused-vars
  onScroll?: (e: UIEvent<HTMLElement>) => void;
}) {
  return (
    <ul
      onScroll={onScroll}
      ref={listRef}
      className="overflow-y-auto overscroll-none flex flex-col gap-2 h-full py-4"
    >
      {children}
    </ul>
  );
}

function NoBlockedUsers() {
  return (
    <Text size="md" font="light" className="text-center select-none">
      {langBlocked.NO_BLOCKED}
    </Text>
  );
}

function BlockedUser({
  data,
  openMenu,
  onClickMenuHandler,
}: {
  data: ReadAccountResponseType;
  openMenu: ReturnType<typeof useBlocked>["openMenu"];
  onClickMenuHandler: ReturnType<typeof useBlocked>["onClickMenuHandler"];
}) {
  let lastSeenStr;
  let memberState: "online" | "offline" | "invisible" | "you";
  if (!data.general?.lastSeen) {
    memberState = langBlocked.STATUS_INVISIBLE;
  } else {
    const { result, range } = formatDate().member(data.general.lastSeen);
    if (range === "seconds") {
      memberState = langBlocked.STATUS_ONLINE;
    } else {
      memberState = langBlocked.STATUS_OFFLINE;
      lastSeenStr = langBlocked.LAST_SEEN_TEXT(result as string);
    }
  }

  function onContextHandler(e: MouseEvent<HTMLElement>) {
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
      className="h-14 shrink-0 border-2 border-slate-200 bg-slate-50 hover:bg-slate-200 duration-300 ease-in-out flex select-none"
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
            memberState === "online"
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
  data: ReadAccountResponseType;
  onClickMenuHandler: ReturnType<typeof useBlocked>["onClickMenuHandler"];
}) {
  const iconProps = {
    size: 24,
    strokeWidth: "1.5",
    className: "text-slate-600",
  };

  return (
    <Paper rounded="lg" className="flex flex-col m-2 w-56 shadow-md">
      <Button
        title={langBlocked.CONTEXT_MENU_PROFILE_ACTION}
        size="md"
        unstyled
        padding={24}
        className="hover:bg-slate-200 rounded-t-lg gap-4"
        onClick={() =>
          onClickMenuHandler().profile(data.targetUserId as UserId)
        }
      >
        <IconUserScan {...iconProps} />
        <Text size="md" font="default" className="text-slate-600">
          {langBlocked.CONTEXT_MENU_PROFILE_ACTION}
        </Text>
      </Button>
      <Button
        title={langBlocked.CONTEXT_MENU_COPY_ACTION}
        size="md"
        unstyled
        padding={24}
        className="hover:bg-slate-200 gap-4"
        onClick={() =>
          onClickMenuHandler().copy(data.general?.username as string)
        }
      >
        <IconCopy {...iconProps} />
        <Text size="md" font="default" className="text-slate-600">
          {langBlocked.CONTEXT_MENU_COPY_ACTION}
        </Text>
      </Button>
      <Button
        title={langBlocked.CONTEXT_MENU_UNBAN_ACTION}
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
        <IconLockOpen {...iconProps} className="text-green-600" />
        <Text size="md" font="default" className="text-green-600">
          {langBlocked.CONTEXT_MENU_UNBAN_ACTION}
        </Text>
      </Button>
    </Paper>
  );
}
