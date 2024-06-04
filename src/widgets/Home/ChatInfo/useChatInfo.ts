import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoadInfo } from "../chat/useChat";
import { routes } from "../../../constants";
import {
  useQueryBanMember,
  useQueryDeleteRoom,
  useQueryGetMembers,
  useQueryKickMember,
  useQueryUpdateRoom,
} from "../../../shared/api/api";
import {
  AccountReadType,
  RoomGetMembersType,
  RoomInfoType,
  RoomInfoUpdate,
} from "../../../shared/api/api.schema";
import { RoomId, UserId } from "../../../types";
import { checkUserId } from "../../../shared/lib/uuid";
import { useMenuContext } from "../../ContextMenu/ContextMenu";
import { useNotify } from "../../Notification/Notification";

export function useMain() {
  const { run, roomId, storedInfo } = useLoadInfo();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement | null>(null);
  // To prevent a member's context menu from being hidden when its content is clicked
  const contextMenu = useMenuContext();

  const isAdmin = storedInfo?.creatorId === "self";

  const exit = useCallback(() => {
    navigate({ pathname: routes.rooms.path + roomId });
  }, [navigate, roomId]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        !contextMenu.data.isOpen &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        exit();
      }
    },
    [contextMenu, contentRef, exit],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // Dependency is needed in order for the callback to see changes in data.isOpen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextMenu.data.isOpen]);

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

  // const removeMember = (userId: UserId) => {
  //   if (data?.users) {
  //    const usersResult: RoomGetMembersType["users"] = [];
  //    for (const user of data.users) {
  //     if (user.targetUserId !== userId) usersResult.push(user)
  //   }
  //   setData((prevData) => ({ ...prevData, users: usersResult }))
  // }
  // }

  useEffect(() => {
    getMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { getMembers, data, isLoading: query.isLoading };
}

export function useMember({ data }: { data: AccountReadType }) {
  const { openMenu, closeMenu } = useMenuContext();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();

  const kickQuery = useQueryKickMember();
  const banQuery = useQueryBanMember();

  async function onClickMenuHandler(type: "profile" | "copy" | "kick" | "ban") {
    if (type === "profile") {
      // TODO Pages for another users
      if (data.targetUserId === "self") navigate(routes.profile.path);
    }
    if (type === "copy") {
      navigator.clipboard.writeText(data?.general?.username as string);
      notify.show.info("Username copied to clipboard");
    }
    if (type === "kick" && data.targetUserId !== "self") {
      const result = await kickQuery.run(roomId as RoomId, data.targetUserId);
      if (!result.success) {
        notify.show.error(
          "Invalid response from the server. Please try again later",
        );
        return;
      }
      if (!result.data.access) {
        notify.show.error("You don't have enough rights");
        return;
      }
      if (!result.data.success) {
        notify.show.error(
          `User ${data.general?.username} cannot be kicked. Perhaps he is no longer a member of the room`,
        );
        return;
      }
      if (result.data.success) {
        notify.show.info(
          `User ${data.general?.username} successfully kicked out of the room`,
        );
        return;
      }
    }
    if (type === "ban" && data.targetUserId !== "self") {
      //
    }
    closeMenu();
  }

  return { openMenu, onClickMenuHandler };
}
