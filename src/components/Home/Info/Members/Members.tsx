import { Spinner } from "../../../../shared/ui/Spinner/Spinner";
import { ReactNode, RefObject, UIEvent, JSX, MouseEvent } from "react";
import { ReadAccountResponseType } from "../../../../shared/api/api.schema";
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
    onClickBlocked,
    onClickInvite,
  } = useMembers();

  let members: JSX.Element = <></>;
  if (isLoading) {
    members = (
      <MembersListWrapper>
        <Spinner size={128} className="mt-16 self-center" />
      </MembersListWrapper>
    );
  } else if (!data?.users) {
    members = (
      <MembersListWrapper>
        <NoMembers />
      </MembersListWrapper>
    );
  } else {
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

  const iconProps = {
    className: "text-slate-600",
    strokeWidth: "1.5",
    size: 24,
  };

  return (
    <>
      <div className="flex items-center gap-2 p-4 border-t-2 border-slate-100">
        <Text size="xl" font="thin" uppercase letterSpacing className="grow">
          Members
        </Text>
        <IconButton title="Refresh members" onClick={() => getMembers()}>
          <IconRefresh {...iconProps} />
        </IconButton>
        {isAdmin && (
          <>
            <IconButton title="Blocked users">
              <IconUserCancel {...iconProps} onClick={onClickBlocked} />
            </IconButton>
            <IconButton title="Invite users" onClick={onClickInvite}>
              <IconPlus {...iconProps} />
            </IconButton>
          </>
        )}
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
  // eslint-disable-next-line no-unused-vars
  onScroll?: (e: UIEvent<HTMLElement>) => void;
}) {
  return (
    <ul
      onScroll={onScroll}
      ref={listRef}
      className="w-full p-4 h-64 md:h-full overflow-y-auto overscroll-none flex flex-col grow gap-2 border-t-2 border-slate-100"
    >
      {children}
    </ul>
  );
}

function NoMembers() {
  return (
    <Text size="md" font="light" className="text-center select-none">
      There are no members in this room yet
    </Text>
  );
}

function Member({
  data,
  isAdmin,
  getMembers,
}: {
  data: ReadAccountResponseType;
  isAdmin: boolean;
  getMembers: ReturnType<typeof useMembers>["getMembers"];
}) {
  const { openMenu, onClickMenuHandler } = useMember({
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

  function onContextHandler(e: MouseEvent<HTMLElement>) {
    openMenu(
      e,
      <MemberContextMenu
        isYou={data.targetUserId === "self"}
        isAdmin={isAdmin}
        data={data}
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
      className="w-full h-14 shrink-0 flex border-2 border-slate-200 bg-slate-50 hover:bg-slate-200 duration-300 ease-in-out select-none"
    >
      <div className="grow flex flex-col justify-center truncate">
        <Text size="sm" font="default" className="truncate">
          @{data.general?.username}
        </Text>
        {data.general?.name ? (
          <Text size="sm" font="light" className="truncate">
            {data.general.name}
          </Text>
        ) : (
          <Text size="sm" font="light" className="text-slate-600 truncate">
            Name hidden
          </Text>
        )}
      </div>
      <div className="shrink-0 flex flex-col justify-center items-end">
        <Text
          size="sm"
          font="light"
          capitalize
          className={
            memberState === "online" || memberState === "you"
              ? "text-green-600"
              : "text-slate-600"
          }
        >
          {memberState}
        </Text>
        {memberState === "offline" && (
          <Text size="sm" font="light">
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
  data,
  onClick,
}: {
  isYou: boolean;
  isAdmin: boolean;
  data: ReadAccountResponseType;
  onClick: ReturnType<typeof useMember>["onClickMenuHandler"];
}) {
  return (
    <Paper rounded="lg" className="flex flex-col m-2 w-56 shadow-md">
      <Button
        title="Go to profile"
        size="md"
        unstyled
        padding={24}
        className="hover:bg-slate-200 rounded-t-lg gap-4"
        onClick={() => onClick().profile(data.targetUserId)}
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
        onClick={() => onClick().copy(data.general?.username as string)}
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
            onClick={() =>
              onClick().kick(
                data.targetUserId,
                data.general?.username as string,
              )
            }
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
            onClick={() =>
              onClick().ban(data.targetUserId, data.general?.username as string)
            }
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
