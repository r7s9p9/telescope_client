import { useEffect, useState } from "react";
import { useLoadInfo } from "../../Chat/useChat";
import {
  useQueryAccount,
  useQueryUpdateRoom,
} from "../../../../shared/api/api.model";
import {
  UpdateRoomRequestType,
  UserId,
} from "../../../../shared/api/api.schema";
import { checkUserId } from "../../../../shared/lib/uuid";
import { useLang } from "../../../../shared/features/LangProvider/LangProvider";

export function useProperties() {
  const { lang } = useLang();
  const { run, roomId, storedInfo } = useLoadInfo();
  const queryAccount = useQueryAccount();

  const [creatorUsername, setCreatorUsername] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editableInfo, setEditableInfo] =
    useState<ReturnType<typeof useLoadInfo>["storedInfo"]>();

  const queryUpdate = useQueryUpdateRoom();

  function sendHandler() {
    if (editableInfo && storedInfo) {
      const result: UpdateRoomRequestType["info"] = Object.create(null);
      let isUpdated = false;
      if (editableInfo.name !== storedInfo.name) {
        result.name = editableInfo.name;
        isUpdated = true;
      }
      if (editableInfo.type !== storedInfo.type) {
        if (
          editableInfo.type === "public" ||
          editableInfo.type === "private" ||
          editableInfo.type === "single"
        ) {
          result.type = editableInfo.type;
          isUpdated = true;
        }
      }
      if (editableInfo.about !== storedInfo.about) {
        result.about = editableInfo.about;
        isUpdated = true;
      }
      if (
        editableInfo.creatorId !== storedInfo.creatorId &&
        checkUserId(storedInfo.creatorId as string)
      ) {
        result.creatorId = editableInfo.creatorId as UserId;
        isUpdated = true;
      }
      if (!isUpdated) return { isUpdated: false as const };
      return { isUpdated: true as const, result };
    }
  }

  async function handleEditClick(type: "edit" | "cancel" | "send") {
    if (type === "edit") setIsEdit(true);
    if (type === "cancel") {
      setIsEdit(false);
      setEditableInfo(storedInfo);
    }
    if (type === "send") {
      const result = sendHandler();
      if (result?.isUpdated) {
        const { success } = await queryUpdate.run({
          roomId: roomId,
          info: result.result,
        });
        if (success) run();
      }
      setIsEdit(false);
    }
  }

  // Initial load
  useEffect(() => {
    if (!storedInfo || !editableInfo) {
      const action = async () => {
        await run();
      };
      action();
    }
  }, [storedInfo, editableInfo, run]);

  // Load creator username
  useEffect(() => {
    const action = async () => {
      if (storedInfo && !creatorUsername) {
        setEditableInfo(storedInfo);
        if (storedInfo?.creatorId === "self") {
          setCreatorUsername(lang.properties.CREATOR_VALUE_YOU);
        } else if (storedInfo?.creatorId === "service") {
          setCreatorUsername(lang.properties.CREATOR_VALUE_SERVICE);
        } else {
          const { success, response } = await queryAccount.run({
            userId: storedInfo.creatorId,
            toRead: { general: ["username"] },
          });
          if (!success) setCreatorUsername("Unknown");
          setCreatorUsername(response?.general?.username as string);
        }
      }
    };
    action();
  }, [lang, storedInfo, creatorUsername, queryAccount]);

  const setName = (val: string) =>
    setEditableInfo(
      (prevInfo) =>
        ({ ...prevInfo, name: val }) as ReturnType<
          typeof useLoadInfo
        >["storedInfo"],
    );
  const setType = (val: "private" | "public" | "single") =>
    setEditableInfo(
      (prevInfo) =>
        ({ ...prevInfo, type: val }) as ReturnType<
          typeof useLoadInfo
        >["storedInfo"],
    );
  const setAbout = (val: string) =>
    setEditableInfo(
      (prevInfo) =>
        ({ ...prevInfo, about: val }) as ReturnType<
          typeof useLoadInfo
        >["storedInfo"],
    );

  return {
    handleEditClick,
    isEdit,
    isInitialLoading: !storedInfo || !editableInfo,
    editable: {
      name: editableInfo?.name as string,
      setName,
      type: editableInfo?.type as string,
      setType,
      about: editableInfo?.about as string,
      setAbout,
    },
    storedInfo,
    creatorUsername,
    isAdmin: storedInfo?.creatorId === "self",
    lang,
  };
}
