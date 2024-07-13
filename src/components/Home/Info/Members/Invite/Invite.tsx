import {
  IconCopy,
  IconSearch,
  IconUserPlus,
  IconUserScan,
} from "@tabler/icons-react";
import { Paper } from "../../../../../shared/ui/Paper/Paper";
import { Text } from "../../../../../shared/ui/Text/Text";
import { UserId } from "../../../../../shared/api/api.schema";
import { ReactNode, RefObject, JSX, MouseEvent, UIEvent } from "react";
import { Spinner } from "../../../../../shared/ui/Spinner/Spinner";
import { ReadAccountResponseType } from "../../../../../shared/api/api.schema";
import { formatDate } from "../../../../../shared/lib/date";
import { Button } from "../../../../../shared/ui/Button/Button";
import { useInvite } from "./useInvite";
import { Input } from "../../../../../shared/ui/Input/Input";
import { Popup } from "../../../../../shared/ui/Popup/Popup";
import { useLang } from "../../../../../shared/features/LangProvider/LangProvider";

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
    lang,
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
        <NoUsers lang={lang} />
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
            lang={lang}
          />
        ))}
      </ListWrapper>
    );
  }

  return (
    <Popup
      titleText={lang.invite.POPUP_TITLE}
      overlayRef={overlayRef}
      contentRef={contentRef}
      onClose={onClose}
    >
      <Input
        size="md"
        value={inputValue}
        setValue={setInputValue}
        placeholder={lang.invite.SEARCH_PLACEHOLDER}
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
  // eslint-disable-next-line no-unused-vars
  onScroll?: (e: UIEvent<HTMLElement>) => void;
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

function NoUsers({ lang }: { lang: ReturnType<typeof useLang>["lang"] }) {
  return (
    <Text size="md" font="light" className="text-center select-none">
      {lang.invite.NO_USERS}
    </Text>
  );
}

function User({
  data,
  openMenu,
  onClickMenuHandler,
  lang,
}: {
  data: ReadAccountResponseType;
  openMenu: ReturnType<typeof useInvite>["openMenu"];
  onClickMenuHandler: ReturnType<typeof useInvite>["onClickMenuHandler"];
  lang: ReturnType<typeof useLang>["lang"];
}) {
  let lastSeenStr;
  let memberState = "";

  if (!data.general?.lastSeen) {
    memberState = lang.invite.STATUS_INVISIBLE;
  } else {
    const { result, range } = formatDate().member(data.general.lastSeen);
    if (range === "seconds") {
      memberState = lang.invite.STATUS_ONLINE;
    } else {
      memberState = lang.invite.STATUS_OFFLINE;
      lastSeenStr = lang.invite.LAST_SEEN_TEXT(result as string);
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
            {lang.invite.NAME_HIDDEN}
          </Text>
        )}
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
  onClickMenuHandler: ReturnType<typeof useInvite>["onClickMenuHandler"];
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
        title={lang.invite.CONTEXT_MENU_PROFILE_ACTION}
        size="md"
        unstyled
        padding={24}
        className="hover:bg-slate-200 rounded-t-lg gap-4"
        onClick={() =>
          onClickMenuHandler().profile(data.targetUserId as UserId)
        }
      >
        <IconUserScan {...iconProps} />
        <Text {...textProps}>{lang.invite.CONTEXT_MENU_PROFILE_ACTION}</Text>
      </Button>
      <Button
        title={lang.invite.CONTEXT_MENU_COPY_ACTION}
        size="md"
        unstyled
        padding={24}
        className="hover:bg-slate-200 gap-4"
        onClick={() =>
          onClickMenuHandler().copy(data.general?.username as string)
        }
      >
        <IconCopy {...iconProps} />
        <Text {...textProps}>{lang.invite.CONTEXT_MENU_COPY_ACTION}</Text>
      </Button>
      <Button
        title={lang.invite.CONTEXT_MENU_INVITE_ACTION}
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
        <IconUserPlus {...iconProps} className="text-green-600" />
        <Text {...textProps} className="text-green-600">
          {lang.invite.CONTEXT_MENU_INVITE_ACTION}
        </Text>
      </Button>
    </Paper>
  );
}
