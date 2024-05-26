import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoadInfo } from "../chat/useChat";
import { routes } from "../../../constants";
import {
  useQueryDeleteRoom,
  useQueryGetMembers,
  useQueryUpdateRoom,
} from "../../../shared/api/api";
import {
  RoomGetMembersType,
  RoomInfoType,
  RoomInfoUpdate,
} from "../../../shared/api/api.schema";
import { RoomId, UserId } from "../../../types";
import { checkUserId } from "../../../shared/lib/uuid";

export function useMain() {
  const { run, roomId, storedInfo } = useLoadInfo();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const isAdmin = storedInfo?.creatorId === "self";

  const exit = useCallback(() => {
    navigate({ pathname: routes.rooms.path + roomId });
  }, [navigate, roomId]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        exit();
      }
    },
    [contentRef, exit],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loadInfo: run,
    roomId,
    contentRef,
    handleCloseClick: exit,
    info: storedInfo,
    isInitialLoading: !storedInfo,
    isAdmin,
  };
}

export function useInfoSection(
  info: RoomInfoType["info"],
  loadInfo: ReturnType<typeof useMain>["loadInfo"],
  roomId: RoomId,
) {
  const defaultInfo = {
    name: info.name,
    creatorId: info.creatorId,
    type: info.type,
    about: info.about ? info.about : "",
  };

  const [isEdit, setIsEdit] = useState(false);
  const [editableInfo, setEditableInfo] = useState(defaultInfo);

  const navigate = useNavigate();
  const queryUpdate = useQueryUpdateRoom();
  const queryDelete = useQueryDeleteRoom();

  function sendHandler() {
    const result: RoomInfoUpdate = Object.create(null);
    let isUpdated = false;
    if (editableInfo.name !== info.name) {
      result.name = editableInfo.name;
      isUpdated = true;
    }
    if (editableInfo.type !== info.type) {
      if (
        editableInfo.type === "public" ||
        editableInfo.type === "private" ||
        editableInfo.type === "single"
      ) {
        result.type = editableInfo.type;
        isUpdated = true;
      }
    }
    if (editableInfo.about !== info.about) {
      result.about = editableInfo.about;
      isUpdated = true;
    }
    if (
      editableInfo.creatorId !== info.creatorId &&
      checkUserId(info.creatorId as string)
    ) {
      result.creatorId = editableInfo.creatorId as UserId;
      isUpdated = true;
    }
    if (!isUpdated) return { isUpdated: false as const };
    return { isUpdated: true as const, result };
  }

  async function handleEditClick(type: "edit" | "cancel" | "send") {
    if (type === "edit") setIsEdit(true);
    if (type === "cancel") {
      setIsEdit(false);
      setEditableInfo(defaultInfo);
    }
    if (type === "send") {
      const { isUpdated, result } = sendHandler();
      if (isUpdated) {
        const { success } = await queryUpdate.run(roomId, result);
        if (success) loadInfo();
      }
      setIsEdit(false);
    }
  }

  async function handleDeleteClick() {
    const { success } = await queryDelete.run(roomId);
    if (success) navigate({ pathname: routes.rooms.path });
  }

  return {
    handleEditClick,
    handleDeleteClick,
    isEdit,
    editable: {
      name: editableInfo.name,
      setName: (val: typeof editableInfo.name) =>
        setEditableInfo((prevInfo) => ({ ...prevInfo, name: val })),
      type: editableInfo.type,
      setType: (val: typeof editableInfo.type) =>
        setEditableInfo((prevInfo) => ({ ...prevInfo, type: val })),
      about: editableInfo.about,
      setAbout: (val: typeof editableInfo.about) =>
        setEditableInfo((prevInfo) => ({ ...prevInfo, about: val })),
    },
  };
}

export function useMembersSection() {
  const { roomId } = useParams();
  const query = useQueryGetMembers();

  const [data, setData] = useState<RoomGetMembersType>();

  const getMembers = async () => {
    const { success, data } = await query.run(roomId as RoomId);
    if (!success) return { success: false as const };
    setData(data);
    return { success: true as const };
  };

  useEffect(() => {
    getMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { getMembers, data, isLoading: query.isLoading };
}
