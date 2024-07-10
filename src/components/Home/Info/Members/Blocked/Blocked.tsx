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
import { useLang } from "../../../../../shared/features/LangProvider/LangProvider";

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
    lang,
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
        <NoBlockedUsers lang={lang} />
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
            lang={lang}
          />
        ))}
      </ListWrapper>
    );
  }

  return (
    <Popup
      titleText={lang.blocked.POPUP_TITLE}
      contentRef={contentRef}
      overlayRef={overlayRef}
      onClose={onClose}
      rightSection={
        <IconButton title={lang.blocked.BUTTON_REFRESH_LABEL} onClick={reload}>
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

function NoBlockedUsers({
  lang,
}: {
  lang: ReturnType<typeof useLang>["lang"];
}) {
  return (
    <Text size="md" font="light" className="text-center select-none">
      {lang.blocked.NO_BLOCKED}
    </Text>
  );
}

function BlockedUser({
  data,
  openMenu,
  onClickMenuHandler,
  lang,
}: {
  data: ReadAccountResponseType;
  openMenu: ReturnType<typeof useBlocked>["openMenu"];
  onClickMenuHandler: ReturnType<typeof useBlocked>["onClickMenuHandler"];
  lang: ReturnType<typeof useLang>["lang"];
}) {
  let lastSeenStr;
  let memberState = "";
  if (!data.general?.lastSeen) {
    memberState = lang.blocked.STATUS_INVISIBLE;
  } else {
    const { result, range } = formatDate().member(data.general.lastSeen);
    if (range === "seconds") {
      memberState = lang.blocked.STATUS_ONLINE;
    } else {
      memberState = lang.blocked.STATUS_OFFLINE;
      lastSeenStr = lang.blocked.LAST_SEEN_TEXT(result as string);
    }
  }

  function onContextHandler(e: MouseEvent<HTMLElement>) {
    openMenu(
      e,
      <UserContextMenu
        data={data}
        onClickMenuHandler={onClickMenuHandler}
        lang={lang}
      />,
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
          className="text-slate-600 select-none"
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
  lang,
}: {
  data: ReadAccountResponseType;
  onClickMenuHandler: ReturnType<typeof useBlocked>["onClickMenuHandler"];
  lang: ReturnType<typeof useLang>["lang"];
}) {
  const iconProps = {
    size: 18,
    strokeWidth: "1.5",
    className: "text-slate-600",
  };

  const textProps = {
    size: "md" as const,
    font: "default" as const,
    className: "text-slate-600",
  };

  return (
    <Paper rounded="lg" className="w-fit flex flex-col m-2 shadow-md">
      <Button
        title={lang.blocked.CONTEXT_MENU_PROFILE_ACTION}
        size="md"
        unstyled
        padding={24}
        className="hover:bg-slate-200 rounded-t-lg gap-4"
        onClick={() =>
          onClickMenuHandler().profile(data.targetUserId as UserId)
        }
      >
        <IconUserScan {...iconProps} />
        <Text {...textProps}>{lang.blocked.CONTEXT_MENU_PROFILE_ACTION}</Text>
      </Button>
      <Button
        title={lang.blocked.CONTEXT_MENU_COPY_ACTION}
        size="md"
        unstyled
        padding={24}
        className="hover:bg-slate-200 gap-4"
        onClick={() =>
          onClickMenuHandler().copy(data.general?.username as string)
        }
      >
        <IconCopy {...iconProps} />
        <Text {...textProps}>{lang.blocked.CONTEXT_MENU_COPY_ACTION}</Text>
      </Button>
      <Button
        title={lang.blocked.CONTEXT_MENU_UNBAN_ACTION}
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
        <Text {...textProps} className="text-green-600">
          {lang.blocked.CONTEXT_MENU_UNBAN_ACTION}
        </Text>
      </Button>
    </Paper>
  );
}
