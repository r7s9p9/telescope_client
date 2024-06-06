import { Spinner } from "../../../../shared/ui/Spinner/Spinner";
import { ReactNode, RefObject } from "react";
import { AccountReadType } from "../../../../shared/api/api.schema";
import { formatDate } from "../../../../shared/lib/date";
import { useMembers, useMember } from "./useMembers";
import { IconButton } from "../../../../shared/ui/IconButton/IconButton";
import { Text } from "../../../../shared/ui/Text/Text";
import {
  IconBan,
  IconCopy,
  IconKarate,
  IconPlus,
  IconRefresh,
  IconUserCancel,
  IconUserScan,
} from "@tabler/icons-react";
import { Paper } from "../../../../shared/ui/Paper/Paper";
import { Button } from "../../../../shared/ui/Button/Button";

export function Members() {
  const {
    getMembers,
    listRef,
    debouncedHandleScroll,
    data,
    isLoading,
    isAdmin,
  } = useMembers();

  let members: JSX.Element = <></>;
  if (isLoading && !data?.users) {
    members = (
      <MembersListWrapper>
        <Spinner size={128} className="self-center mt-8" />
      </MembersListWrapper>
    );
  } else if (data?.isEmpty || !data?.users) {
    members = (
      <MembersListWrapper>
        <NoMembers />
      </MembersListWrapper>
    );
  } else if (data.users) {
    members = (
      <MembersListWrapper listRef={listRef} onScroll={debouncedHandleScroll}>
        {data.users.map((user) => (
          <Member
            key={user.targetUserId}
            data={user}
            isAdmin={isAdmin}
            getMembers={getMembers}
          />
        ))}
      </MembersListWrapper>
    );
  }

  return (
    <>
      <div className="flex flex-col p-4 border-y-2 border-slate-100">
        <div className="flex items-center gap-2">
          <Text size="xl" font="thin" uppercase letterSpacing className="grow">
            Members
          </Text>
          <IconButton title="Refresh members" onClick={() => getMembers()}>
            <IconRefresh className="text-slate-600" strokeWidth="2" size={24} />
          </IconButton>
          {isAdmin && <BlockedUsers />}
          {isAdmin && <InviteButton />}
        </div>
      </div>
      {members}
    </>
  );
}

function MembersListWrapper({
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
      className="w-full p-4 overflow-scroll overscroll-none flex flex-col gap-2"
    >
      {children}
    </ul>
  );
}

function NoMembers() {
  return (
    <Text size="md" font="light" className="text-center">
      There are no members in this room yet
    </Text>
  );
}

function Member({
  data,
  isAdmin,
  getMembers,
}: {
  data: AccountReadType;
  isAdmin: boolean;
  getMembers: ReturnType<typeof useMembers>["getMembers"];
}) {
  const { openMenu, onClickMenuHandler } = useMember({
    data,
    getMembers,
  });

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
      <MemberContextMenu
        isYou={data.targetUserId === "self"}
        isAdmin={isAdmin}
        onClick={onClickMenuHandler}
      />,
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

function MemberContextMenu({
  isYou,
  isAdmin,
  onClick,
}: {
  isYou: boolean;
  isAdmin: boolean;
  onClick: ReturnType<typeof useMember>["onClickMenuHandler"];
}) {
  return (
    <Paper rounded="lg" shadow="md" className="flex flex-col m-2 w-56">
      <Button
        title="Go to profile"
        size="md"
        unstyled
        padding={24}
        className="hover:bg-slate-200 rounded-t-lg gap-4"
        onClick={() => onClick("profile")}
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
        className={`hover:bg-slate-200 ${!isAdmin || isYou ? "rounded-b-lg" : ""} gap-4`}
        onClick={() => onClick("copy")}
      >
        <>
          <IconCopy className="text-slate-600" strokeWidth="1.5" size={24} />
          <Text size="md" font="default" className="text-slate-600">
            Copy username
          </Text>
        </>
      </Button>
      {isAdmin && !isYou && (
        <>
          <Button
            title="Kick"
            size="md"
            unstyled
            padding={24}
            className="w-54 hover:bg-slate-200"
            onClick={() => onClick("kick")}
          >
            <>
              <IconKarate
                className="text-red-600"
                strokeWidth="1.5"
                size={24}
              />
              <Text size="md" font="default" className="text-red-600">
                Kick
              </Text>
            </>
          </Button>

          <Button
            title="Ban"
            size="md"
            unstyled
            padding={24}
            className="w-54 hover:bg-slate-200 rounded-b-lg"
            onClick={() => onClick("ban")}
          >
            <>
              <IconBan className="text-red-600" strokeWidth="1.5" size={24} />
              <Text size="md" font="default" className="text-red-600">
                Ban
              </Text>
            </>
          </Button>
        </>
      )}
    </Paper>
  );
}

function BlockedUsers() {
  return (
    <IconButton title="Blocked users">
      <IconUserCancel className="text-slate-600" strokeWidth="2" size={24} />
    </IconButton>
  );
}

function InviteButton() {
  return (
    <IconButton title="Invite users">
      <IconPlus className="text-slate-600" strokeWidth="2" size={24} />
    </IconButton>
  );
}
