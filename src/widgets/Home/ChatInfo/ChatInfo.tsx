import {
  IconCheck,
  IconEdit,
  IconPlus,
  IconRefresh,
  IconX,
} from "@tabler/icons-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AccountReadType,
  RoomInfoUpdate,
  RoomType,
} from "../../../shared/api/api.schema";
import { useStore } from "../../../shared/store/store";
import { routes } from "../../../constants";
import { formatDate } from "../../../shared/lib/date";
import {
  useQueryDeleteRoom,
  useQueryUpdateRoom,
} from "../../../shared/api/api";
import { RoomId, UserId } from "../../../types";
import { checkUserId } from "../../../shared/lib/uuid";
import { useLoadInfo, useMembers } from "../chat/useChat";
import { Input } from "../../../shared/ui/Input/Input";
import { Select } from "../../../shared/ui/Select/Select";
import { Button } from "../../../shared/ui/Button/Button";
import { Text } from "../../../shared/ui/Text/Text";

export function ChatInfo() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  let storedInfo: RoomType | undefined;

  const roomsInfo = useStore().rooms().read()?.items;
  if (roomsInfo) {
    for (const info of roomsInfo) {
      if (info.roomId === roomId) {
        storedInfo = info;
        break;
      }
    }
  }

  const isAdmin = storedInfo?.creatorId === "self";

  const close = useCallback(() => {
    navigate({ pathname: routes.rooms.path + roomId });
  }, [navigate, roomId]);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        close();
      }
    },
    [contentRef, close],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Overlay>
      <div
        ref={contentRef}
        className="bg-slate-100 rounded-xl p-4 flex flex-col shadow-md"
      >
        <div className="flex justify-between items-center mb-2">
          <Text size="xl" font="light" letterSpacing uppercase>
            Info
          </Text>
          <Button title="Exit" rounded="full" onClick={close}>
            <IconX className="text-slate-600" strokeWidth="2" size={24} />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {storedInfo && (
            <Info
              roomId={roomId as RoomId}
              data={storedInfo}
              isAdmin={isAdmin}
            />
          )}
          <Members isAdmin={isAdmin} />
        </div>
      </div>
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
  data,
  isAdmin,
}: {
  roomId: RoomId;
  data: RoomType;
  isAdmin: boolean;
}) {
  const defaultInfo = {
    name: data.name,
    creatorId: data.creatorId,
    type: data.type,
    about: data.about ? data.about : "",
  };

  const [isEdit, setIsEdit] = useState(false);
  const [info, setInfo] = useState(defaultInfo);

  const navigate = useNavigate();
  const loadInfo = useLoadInfo();
  const queryUpdate = useQueryUpdateRoom();
  const queryDelete = useQueryDeleteRoom();

  function sendHandler() {
    const result: RoomInfoUpdate = Object.create(null);
    let isUpdated = false;
    if (info.name !== data.name) {
      result.name = info.name;
      isUpdated = true;
    }
    if (info.type !== data.type) {
      if (
        info.type === "public" ||
        info.type === "private" ||
        info.type === "single"
      ) {
        result.type = info.type;
        isUpdated = true;
      }
    }
    if (info.about !== data.about) {
      result.about = info.about;
      isUpdated = true;
    }
    if (info.creatorId !== data.creatorId && checkUserId(data.creatorId)) {
      result.creatorId = info.creatorId as UserId;
      isUpdated = true;
    }
    if (!isUpdated) return { isUpdated: false as const };
    return { isUpdated: true as const, info: result };
  }

  async function handleClick(type: "edit" | "cancel" | "send") {
    if (type === "edit") setIsEdit(true);
    if (type === "cancel") {
      setIsEdit(false);
      setInfo(defaultInfo);
    }
    if (type === "send") {
      const { isUpdated, info } = sendHandler();
      if (isUpdated) {
        const { success } = await queryUpdate.run(roomId, info);
        if (success) loadInfo.run();
      }
      setIsEdit(false);
    }
  }

  async function handleDeleteClick() {
    const { success } = await queryDelete.run(roomId);
    if (success) navigate({ pathname: routes.rooms.path });
  }

  return (
    <div className="flex">
      <div className="size-10 flex items-center justify-center text-2xl uppercase font-light rounded-full border-2 border-slate-400">
        {data.name.at(0)}
      </div>
      <div className="flex flex-col ml-4 gap-2 items-start w-64 pr-20">
        <div className="flex flex-row pt-1 items-center justify-between gap-2">
          <Text size="sm" font="default" className="min-w-14">
            Name:
          </Text>
          <Input
            value={info.name}
            setValue={(val) =>
              setInfo((prevInfo) => ({ ...prevInfo, name: val }))
            }
            disabled={!isEdit}
            unstyled={!isEdit}
            size="sm"
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <Text size="sm" font="default" className="min-w-14">
            About:
          </Text>
          <Input
            value={info.about}
            setValue={(val) =>
              setInfo((prevInfo) => ({ ...prevInfo, about: val }))
            }
            disabled={!isEdit}
            unstyled={!isEdit}
            size="sm"
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <Text size="sm" font="default" className="min-w-14">
            Type:
          </Text>
          <Select
            value={info.type}
            setValue={(val) =>
              setInfo((prevInfo) => ({
                ...prevInfo,
                type: val as "public" | "private" | "single",
              }))
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
            {formatDate().info(data.created)}
          </Text>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Text size="sm" font="default" className="min-w-16">
            Creator:
          </Text>
          <Text size="sm" font="light">
            {data.creatorId === "self" ? "You" : data.creatorId}
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
      {isAdmin && <EditGroup handleClick={handleClick} isEdit={isEdit} />}
    </div>
  );
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
  const { getMembers, data, isLoading } = useMembers();

  if (data?.isEmpty || !data?.users || isLoading) {
    return <p>Loading</p>;
  }

  const users = data.users.map((user) => (
    <li key={user.targetUserId}>
      <Member data={user} />
    </li>
  ));

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
      <div className="w-full h-64">
        <ul>{users}</ul>
      </div>
    </div>
  );
}

function Member({ data }: { data: AccountReadType }) {
  let lastSeenStr;
  let lastSeenColor;
  if (!data.general?.lastSeen) {
    lastSeenStr = "invisible";
    lastSeenColor = "text-slate-400";
  } else {
    const { result, range } = formatDate().member(data.general.lastSeen);
    if (range === "seconds") {
      lastSeenStr = "online";
      lastSeenColor = "text-green-600";
    }
    if (range !== "seconds") {
      lastSeenStr = `Last seen: ${result}`;
      lastSeenColor = "text-slate-600";
    }
  }

  return (
    <div className="mt-2 p-2 bg-slate-50 border-2 border-slate-200 rounded-lg shadow-md flex">
      <div className="mr-2 size-10 self-center flex items-center justify-center text-2xl uppercase font-light rounded-full border-2 border-slate-400">
        {data.general?.username?.at(0)}
      </div>
      <div className="grow">
        <Text size="sm" font="bold">
          @{data.general?.username}
        </Text>
        <div className="flex justify-between w-full">
          <Text size="sm" font="light">
            Name: {data.general?.name}
          </Text>
          {data.general?.lastSeen && (
            <Text size="sm" font="light" className={lastSeenColor}>
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
