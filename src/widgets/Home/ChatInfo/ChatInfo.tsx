import {
  IconCheck,
  IconEdit,
  IconPlus,
  IconRefresh,
  IconX,
} from "@tabler/icons-react";
import { ReactNode, memo } from "react";
import {
  AccountReadType,
  RoomGetMembersType,
  RoomInfoType,
} from "../../../shared/api/api.schema";
import { formatDate } from "../../../shared/lib/date";
import { RoomId } from "../../../types";
import { useInfoSection, useMain, useMembersSection } from "./useChatInfo";
import { Input } from "../../../shared/ui/Input/Input";
import { Select } from "../../../shared/ui/Select/Select";
import { Button } from "../../../shared/ui/Button/Button";
import { Text } from "../../../shared/ui/Text/Text";
import { Paper } from "../../../shared/ui/Paper/Paper";
import { getRandomInt } from "../../../shared/lib/random";
import { TextArea } from "../../../shared/ui/TextArea/TextArea";

export function ChatInfo() {
  const {
    roomId,
    info,
    isInitialLoading,
    isAdmin,
    contentRef,
    handleCloseClick,
    loadInfo,
  } = useMain();

  return (
    <Overlay>
      <Paper ref={contentRef} rounded="xl" padding={4} shadow="md">
        <div className="flex justify-between items-center mb-2">
          <Text size="xl" font="light" letterSpacing uppercase>
            Info
          </Text>
          <Button title="Exit" rounded="full" onClick={handleCloseClick}>
            <IconX className="text-slate-600" strokeWidth="2" size={24} />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {!isInitialLoading && (
            <Info
              roomId={roomId}
              info={info as RoomInfoType["info"]}
              // info is defined above
              isAdmin={isAdmin}
              loadInfo={loadInfo}
            />
          )}
          {isInitialLoading && <InfoSkeleton />}
          <Members isAdmin={isAdmin} />
        </div>
      </Paper>
    </Overlay>
  );
}

function Overlay({ children }: { children: ReactNode }) {
  return (
    <div className="absolute w-full h-full flex justify-center items-center backdrop-blur-sm bg-opacity-50 bg-gray-600">
      {children}
    </div>
  );
}

function Info({
  roomId,
  info,
  isAdmin,
  loadInfo,
}: {
  roomId: RoomId;
  info: RoomInfoType["info"];
  isAdmin: boolean;
  loadInfo: ReturnType<typeof useMain>["loadInfo"];
}) {
  const { handleDeleteClick, handleEditClick, isEdit, editable } =
    useInfoSection(info, loadInfo, roomId);

  return (
    <div className="flex h-48">
      <div className="flex flex-col gap-2 items-start w-full pr-20">
        <div className="flex flex-row pt-1 items-center justify-between gap-2">
          <Text size="sm" font="default" className="min-w-14">
            Name:
          </Text>
          <Input
            value={editable.name}
            setValue={(val) => editable.setName(val)}
            disabled={!isEdit}
            unstyled={!isEdit}
            size="sm"
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <Text size="sm" font="default" className="min-w-14">
            About:
          </Text>
          <TextArea
            size="sm"
            minRows={1}
            maxRows={4}
            value={editable.about}
            setValue={(val) => editable.setAbout(val)}
            disabled={!isEdit}
            unstyled={!isEdit}
          />
          {/* <Input
            value={editable.about}
            setValue={(val) => editable.setAbout(val)}
            disabled={!isEdit}
            unstyled={!isEdit}
            size="sm"
          /> */}
        </div>
        <div className="flex flex-row items-center gap-2">
          <Text size="sm" font="default" className="min-w-14">
            Type:
          </Text>
          <Select
            value={editable.type}
            setValue={(val) =>
              editable.setType(val as "public" | "private" | "single")
            }
            disabled={!isEdit}
            unstyled={!isEdit}
            size="sm"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="single">Single</option>
          </Select>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Text size="sm" font="default" className="min-w-16">
            Created:
          </Text>
          <Text size="sm" font="light">
            {formatDate().info(info.created)}
          </Text>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Text size="sm" font="default" className="min-w-16">
            Creator:
          </Text>
          <Text size="sm" font="light">
            {info.creatorId === "self" ? "You" : info.creatorId}
          </Text>
        </div>
        {isAdmin && (
          <Button
            title="Delete room"
            rounded="default"
            onClick={handleDeleteClick}
            noHover
          >
            <Text size="sm" font="bold" className="text-red-600">
              Delete room
            </Text>
          </Button>
        )}
      </div>
      {isAdmin && <EditGroup handleClick={handleEditClick} isEdit={isEdit} />}
    </div>
  );
}

function InfoSkeleton() {
  return <div className="w-full h-48 rounded-lg bg-slate-200 animate-pulse" />;
}

function EditGroup({
  handleClick,
  isEdit,
}: {
  handleClick: (str: "edit" | "cancel" | "send") => void;
  isEdit: boolean;
}) {
  return (
    <div className="relative">
      <Button
        title="Edit"
        rounded="full"
        onClick={() => handleClick("edit")}
        style={{
          position: "absolute",
          zIndex: isEdit ? 0 : 10,
          opacity: isEdit ? "0" : "1",
        }}
        disabled={isEdit}
      >
        <IconEdit strokeWidth="1" className="text-slate-600" size={24} />
      </Button>
      <Button
        title="Cancel edit"
        rounded="full"
        onClick={() => handleClick("cancel")}
        style={{
          opacity: !isEdit ? "0" : "1",
        }}
        disabled={!isEdit}
      >
        <IconX strokeWidth="1" className="text-slate-600" size={24} />
      </Button>
      <Button
        title="Update info"
        rounded="full"
        onClick={() => handleClick("send")}
        style={{
          opacity: !isEdit ? "0" : "1",
        }}
        disabled={!isEdit}
      >
        <IconCheck strokeWidth="1" className="text-slate-600" size={24} />
      </Button>
    </div>
  );
}

function Members({ isAdmin }: { isAdmin: boolean }) {
  const { getMembers, data, isLoading } = useMembersSection();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Text size="xl" font="light" letterSpacing uppercase className="w-full">
          Members
        </Text>
        <Button title="Find user" rounded="full" onClick={() => getMembers()}>
          <IconRefresh className="text-slate-600" strokeWidth="2" size={24} />
        </Button>
        {isAdmin && <InviteButton />}
      </div>
      <MembersList isLoading={isLoading} data={data} />
    </div>
  );
}

function MembersList({
  isLoading,
  data,
}: {
  isLoading: boolean;
  data?: RoomGetMembersType;
}) {
  if (isLoading) {
    return (
      <MembersListWrapper>
        <MembersListSkeleton />
      </MembersListWrapper>
    );
  }

  if (data?.isEmpty || !data?.users) {
    return (
      <MembersListWrapper>
        <NoMembers />
      </MembersListWrapper>
    );
  }

  const users = data.users.map((user) => (
    <li key={user.targetUserId}>
      <Member data={user} />
    </li>
  ));

  return <MembersListWrapper>{users}</MembersListWrapper>;
}

const MembersListSkeleton = memo(() => {
  const count = getRandomInt(2, 4);

  return Array(count)
    .fill(1)
    .map((_, i) => (
      <li key={i}>
        <MemberSkeleton />
      </li>
    ));
});

function MemberSkeleton() {
  return (
    <div className="my-2 p-2 h-14 w-full bg-slate-200 rounded-lg flex animate-pulse">
      <div className="size-10 mr-2 bg-slate-300 rounded-full"></div>
      <div className="grow flex">
        <div className="grow flex flex-col justify-between">
          <div className="w-24 h-4 bg-slate-300 rounded-full"></div>
          <div className="w-32 h-4 bg-slate-300 rounded-full"></div>
        </div>
        <div className="flex flex-col justify-between items-end">
          <div className="w-12 h-4 bg-slate-300 rounded-full"></div>
          <div className="w-24 h-4 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function MembersListWrapper({ children }: { children: ReactNode }) {
  return (
    <ul className="w-full h-72 overflow-auto overscroll-none">{children}</ul>
  );
}

function NoMembers() {
  return (
    <Text size="md" font="light" className="text-center">
      There are no members in this room yet
    </Text>
  );
}

function Member({ data }: { data: AccountReadType }) {
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

  return (
    <div className="my-2 p-2 h-14 border-2 border-slate-200 bg-slate-50 rounded-lg shadow-md flex">
      <div className="mr-2 size-10 self-center flex items-center justify-center text-2xl uppercase font-light rounded-full border-2 border-slate-400">
        {data.general?.username?.at(0)}
      </div>
      <div className="grow flex">
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
      </div>
    </div>
  );
}

function InviteButton() {
  return (
    <Button title="Invite users" rounded="full">
      <IconPlus className="text-slate-600" strokeWidth="2" size={24} />
    </Button>
  );
}
