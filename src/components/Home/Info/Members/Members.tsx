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
import { useLang } from "../../../../shared/features/LangProvider/LangProvider";

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
    lang,
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
        <NoMembers lang={lang} />
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
            lang={lang}
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
          {lang.members.TITLE}
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

function NoMembers({ lang }: { lang: ReturnType<typeof useLang>["lang"] }) {
  return (
    <Text size="md" font="light" className="text-center select-none">
      {lang.members.NO_MEMBERS}
    </Text>
  );
}

function Member({
  data,
  isAdmin,
  getMembers,
  lang,
}: {
  data: ReadAccountResponseType;
  isAdmin: boolean;
  getMembers: ReturnType<typeof useMembers>["getMembers"];
  lang: ReturnType<typeof useLang>["lang"];
}) {
  const { openMenu, onClickMenuHandler } = useMember({
    getMembers,
  });

  let lastSeenStr;
  let memberState = "";
  if (data.targetUserId === "self") {
    memberState = lang.members.STATUS_YOU;
  } else if (!data.general?.lastSeen) {
    memberState = lang.members.STATUS_INVISIBLE;
  } else {
    const { result, range } = formatDate().member(data.general.lastSeen);
    if (range === "seconds") {
      memberState = lang.members.STATUS_ONLINE;
    } else {
      memberState = lang.members.STATUS_OFFLINE;
      lastSeenStr = lang.members.LAST_SEEN_TEXT(result as string);
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
            {lang.members.NAME_HIDDEN}
          </Text>
        )}
      </div>
      <div className="shrink-0 flex flex-col justify-center items-end">
        <Text size="sm" font="light" capitalize className="text-slate-600">
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
  lang,
}: {
  isYou: boolean;
  isAdmin: boolean;
  data: ReadAccountResponseType;
  onClick: ReturnType<typeof useMember>["onClickMenuHandler"];
  lang: ReturnType<typeof useLang>["lang"];
}) {
  const iconProps = {
    size: 18,
    strokeWidth: "1.5",
    className: "text-slate-600 shrink-0",
  };

  const textProps = {
    size: "md" as const,
    font: "default" as const,
    // text-nowrap <- needed to prevent incorrect rendering of the context menu
    // due to incorrect calculation of the width before displaying the menu
    className: "text-slate-600 text-nowrap",
  };

  return (
    <Paper rounded="lg" className="w-fit flex flex-col m-2 shadow-md">
      <Button
        title={lang.members.CONTEXT_MENU_PROFILE_ACTION}
        size="md"
        unstyled
        padding={24}
        className="hover:bg-slate-200 rounded-t-lg gap-4"
        onClick={() => onClick().profile(data.targetUserId)}
      >
        <IconUserScan {...iconProps} />
        <Text {...textProps}>{lang.members.CONTEXT_MENU_PROFILE_ACTION}</Text>
      </Button>
      <Button
        title={lang.members.CONTEXT_MENU_COPY_ACTION}
        size="md"
        unstyled
        padding={24}
        className={`hover:bg-slate-200 ${!isAdmin || isYou ? "rounded-b-lg" : ""} gap-4`}
        onClick={() => onClick().copy(data.general?.username as string)}
      >
        <IconCopy {...iconProps} />
        <Text {...textProps}>{lang.members.CONTEXT_MENU_COPY_ACTION}</Text>
      </Button>
      {isAdmin && !isYou && (
        <>
          <Button
            title={lang.members.CONTEXT_MENU_KICK_ACTION}
            size="md"
            unstyled
            padding={24}
            className="hover:bg-slate-200"
            onClick={() =>
              onClick().kick(
                data.targetUserId,
                data.general?.username as string,
              )
            }
          >
            <IconKarate {...iconProps} className="text-red-600" />
            <Text {...textProps} className="text-red-600">
              {lang.members.CONTEXT_MENU_KICK_ACTION}
            </Text>
          </Button>
          <Button
            title={lang.members.CONTEXT_MENU_BAN_ACTION}
            size="md"
            unstyled
            padding={24}
            className="hover:bg-slate-200 rounded-b-lg"
            onClick={() =>
              onClick().ban(data.targetUserId, data.general?.username as string)
            }
          >
            <IconBan {...iconProps} className="text-red-600" />
            <Text {...textProps} className="text-red-600">
              {lang.members.CONTEXT_MENU_BAN_ACTION}
            </Text>
          </Button>
        </>
      )}
    </Paper>
  );
}
