import { IconCheck, IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomInfoUpdate, RoomType } from "../../../shared/api/api.schema";
import { useStore } from "../../../shared/store/store";
import { routes } from "../../../constants";
import { formatDate } from "../../../shared/lib/date";
import {
  useQueryDeleteRoom,
  useQueryUpdateRoom,
} from "../../../shared/api/api";
import { RoomId, UserId } from "../../../types";
import { checkUserId } from "../../../shared/lib/uuid";
import { useLoadInfo } from "../chat/useChat";

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
          <p className="font-light text-2xl uppercase">Info</p>
          <ExitButton onClickHandler={close} />
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
      <div className="flex flex-col ml-4 gap-2">
        <p>Name:</p>
        <p>Type:</p>
        <p>About:</p>
        <p>Created:</p>
        <p>Creator:</p>
        {isAdmin && (
          <button onClick={handleDeleteClick} className="text-red-600 ">
            Delete room
          </button>
        )}
      </div>
      <div className="flex flex-col mx-4 gap-2">
        <InfoInput
          value={info.name}
          setValue={(val) =>
            setInfo((prevInfo) => ({ ...prevInfo, name: val }))
          }
          isEdit={isEdit}
        />
        <TypeInput
          value={info.type}
          setValue={(val) =>
            setInfo((prevInfo) => ({ ...prevInfo, type: val }))
          }
          isEdit={isEdit}
        />
        <InfoInput
          setValue={(val) =>
            setInfo((prevInfo) => ({ ...prevInfo, about: val }))
          }
          value={info.about}
          isEdit={isEdit}
        />
        <p>{formatDate().info(data.created)}</p>
        <p>{data.creatorId === "self" ? "You" : data.creatorId}</p>
      </div>
      {isAdmin && <EditGroup handleClick={handleClick} isEdit={isEdit} />}
    </div>
  );
}

function InfoInput({
  value,
  setValue,
  isEdit,
}: {
  value?: string;
  setValue: (val: string) => void;
  isEdit: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      disabled={!isEdit}
      className={`${isEdit ? "ring-slate-200 bg-slate-50" : "ring-slate-100 "} appearance-none bg-slate-100 w-32 focus:ring-slate-400 outline-none ring-2 rounded-md focus:bg-slate-50 focus:border-slate-50 duration-300`}
    />
  );
}

function TypeInput({
  value,
  setValue,
  isEdit,
}: {
  value: string;
  setValue: (val: "public" | "private" | "single") => void;
  isEdit: boolean;
}) {
  const selector = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    const isCorrect =
      value === "public" || value === "private" || value === "single";
    if (isCorrect) setValue(value);
  };

  return (
    <select
      disabled={!isEdit}
      value={value}
      onChange={(e) => selector(e)}
      className={`${isEdit ? "ring-slate-200 bg-slate-50 select-pointer" : "ring-slate-100 select-none"} capitalize appearance-none bg-slate-100 w-32 focus:ring-slate-400 outline-none ring-2 rounded-md focus:bg-slate-50 focus:border-slate-50 duration-300`}
    >
      <option value="public">public</option>
      <option value="private">private</option>
      <option value="single">single</option>
    </select>
  );
}

function Members({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="flex flex-col ">
      <div className="flex justify-between items-center gap-4">
        <p className="font-light text-2xl uppercase">Members</p>
        {isAdmin && <InviteButton />}
      </div>
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
    <div className="relative size-8">
      <button
        onClick={() => handleClick("edit")}
        style={{
          transform: isEdit ? "scale(0)" : "",
          opacity: isEdit ? "0" : "1",
        }}
        className={`${isEdit ? "z-0" : "z-10"} absolute size-8 flex items-center justify-center rounded-full hover:bg-slate-200 duration-300 ease-in-out"`}
      >
        <IconEdit strokeWidth="1" className="text-slate-600" size={24} />
      </button>
      <button
        onClick={() => handleClick("cancel")}
        style={{
          transform: isEdit ? "" : "scale(0)",
          opacity: isEdit ? "1" : "0",
        }}
        className="absolute size-8 flex items-center justify-center rounded-full hover:bg-slate-200 duration-300 ease-in-out"
      >
        <IconX strokeWidth="1" className="text-slate-600" size={24} />
      </button>
      <button
        onClick={() => handleClick("send")}
        style={{
          transform: isEdit ? "" : "scale(0)",
          opacity: isEdit ? "1" : "0",
        }}
        className="absolute top-8 size-8 flex items-center justify-center rounded-full hover:bg-slate-200 duration-300 ease-in-out"
      >
        <IconCheck strokeWidth="1" className="text-slate-600" size={24} />
      </button>
    </div>
  );
}

function InviteButton() {
  return (
    <button className="size-8 flex items-center justify-center rounded-full hover:bg-slate-200 duration-300 ease-in-out">
      <IconPlus className="text-slate-600" strokeWidth="2" size={24} />
    </button>
  );
}

function ExitButton({ onClickHandler }: { onClickHandler: () => void }) {
  return (
    <div
      onClick={onClickHandler}
      className="size-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-slate-200 duration-300 ease-in-out"
    >
      <IconX className="text-slate-600" strokeWidth="2" size={24} />
    </div>
  );
}
