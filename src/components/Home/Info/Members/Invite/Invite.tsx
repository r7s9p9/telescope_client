import {
  IconCopy,
  IconSearch,
  IconUserPlus,
  IconUserScan,
} from "@tabler/icons-react";
import { Paper } from "../../../../../shared/ui/Paper/Paper";
import { Text } from "../../../../../shared/ui/Text/Text";
import { UserId } from "../../../../../shared/api/api.schema";
import { ReactNode, RefObject } from "react";
import { Spinner } from "../../../../../shared/ui/Spinner/Spinner";
import { ReadAccountResponseType } from "../../../../../shared/api/api.schema";
import { formatDate } from "../../../../../shared/lib/date";
import { Button } from "../../../../../shared/ui/Button/Button";
import { useInvite } from "./useInvite";
import { Input } from "../../../../../shared/ui/Input/Input";
import { Popup } from "../../../../../shared/ui/Popup/Popup";

export function InviteUsers() {
  const {
    overlayRef,
    contentRef,
    onClose,
    inputValue,
    setInputValue,
    users,
    isLoading,
    openMenu,
    onClickMenuHandler,
  } = useInvite();

  let usersContent: JSX.Element = <></>;

  if (isLoading) {
    usersContent = (
      <ListWrapper>
        <Spinner size={128} className="self-center" />
      </ListWrapper>
    );
  } else if (!users) {
    usersContent = (
      <ListWrapper>
        <NoUsers />
      </ListWrapper>
    );
  } else {
    usersContent = (
      <ListWrapper>
        {users.map((user) => (
          <User
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
      titleText="Invite users"
      overlayRef={overlayRef}
      contentRef={contentRef}
      onClose={onClose}
    >
      <Input
        size="md"
        value={inputValue}
        setValue={setInputValue}
        placeholder="Enter user nickname..."
        className="mt-4"
        rightSection={
          <IconSearch className="text-slate-400" strokeWidth="1" size={24} />
        }
      />
      {inputValue && usersContent}
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
  onScroll?: (e: React.UIEvent<HTMLElement>) => void;
}) {
  return (
    <ul
      onScroll={onScroll}
      ref={listRef}
      className="overflow-y-auto overscroll-none flex flex-col gap-2 grow pt-4"
    >
      {children}
    </ul>
  );
}

function NoUsers() {
  return (
    <Text size="md" font="light" className="text-center select-none">
      There are no users for this request
    </Text>
  );
}

function User({
  data,
  openMenu,
  onClickMenuHandler,
}: {
  data: ReadAccountResponseType;
  openMenu: ReturnType<typeof useInvite>["openMenu"];
  onClickMenuHandler: ReturnType<typeof useInvite>["onClickMenuHandler"];
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
        {data.general?.name && (
          <Text size="sm" font="light">
            Name: {data.general?.name}
          </Text>
        )}
        {!data.general?.name && (
          <Text size="sm" font="light" className="text-slate-600">
            Name hidden
          </Text>
        )}
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
  data: ReadAccountResponseType;
  onClickMenuHandler: ReturnType<typeof useInvite>["onClickMenuHandler"];
}) {
  return (
    <Paper rounded="lg" className="flex flex-col m-2 w-56 shadow-md">
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
        title="Invite"
        size="md"
        unstyled
        padding={24}
        className="w-54 hover:bg-slate-200 rounded-b-lg gap-4"
        onClick={() =>
          onClickMenuHandler().invite(
            data.targetUserId as UserId,
            data.general?.username as string,
          )
        }
      >
        <>
          <IconUserPlus
            className="text-green-600"
            strokeWidth="1.5"
            size={24}
          />
          <Text size="md" font="default" className="text-green-600">
            Invite
          </Text>
        </>
      </Button>
    </Paper>
  );
}
