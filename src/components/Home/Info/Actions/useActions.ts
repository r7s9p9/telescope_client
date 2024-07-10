import {
  useQueryDeleteRoom,
  useQueryLeaveRoom,
} from "../../../../shared/api/api.model";
import { RoomId } from "../../../../shared/api/api.schema";
import { useEffect, useState } from "react";
import { useNotify } from "../../../../shared/features/Notification/Notification";
import { useLoadRooms } from "../../Rooms/useRooms";
import { useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useLoadInfo } from "../../Chat/useChat";
import { routes } from "../../../../constants";
import { useLang } from "../../../../shared/features/LangProvider/LangProvider";

export function useActions() {
  const { lang } = useLang();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryDelete = useQueryDeleteRoom();
  const queryLeave = useQueryLeaveRoom();
  const loadInfo = useLoadInfo();
  const loadRooms = useLoadRooms();
  const notify = useNotify();

  const [isShow, setIsShow] = useState(false);

  const switchIsShow = () => {
    setIsShow(!isShow);
  };

  async function handleLeave() {
    const { success, response, requestError, responseError } =
      await queryLeave.run({ roomId: roomId as RoomId });
    if (!success) {
      notify.show.error(
        requestError || responseError || lang.error.UNKNOWN_MESSAGE,
      );
      return;
    }

    if (response.success) {
      await loadRooms.run();
      await loadInfo.run();
      notify.show.info(lang.actionsNotification.LEAVE_SUCCESS);
      navigate({ pathname: routes.rooms.path });
    } else {
      notify.show.error(lang.error.UNKNOWN_MESSAGE);
    }
  }

  async function handleDelete() {
    const { success, response, requestError, responseError } =
      await queryDelete.run({ roomId: roomId as RoomId });
    if (!success) {
      notify.show.error(
        requestError || responseError || lang.error.UNKNOWN_MESSAGE,
      );
      return;
    }

    if (response.success) {
      await loadRooms.run();
      await loadInfo.run();
      notify.show.info(lang.actionsNotification.DELETE_SUCCESS);
      navigate({ pathname: routes.rooms.path });
    } else {
      notify.show.error(lang.error.UNKNOWN_MESSAGE);
    }
  }

  function handleCopy() {
    // TODO Fix
    navigator.clipboard.writeText(location.pathname as string);
    notify.show.info(lang.actionsNotification.COPY_SUCCESS);
  }

  useEffect(() => {
    if (!loadInfo.storedInfo) {
      loadInfo.run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isShow,
    switchIsShow,
    handleLeave,
    handleDelete,
    handleCopy,
    isMember: loadInfo.storedInfo?.isMember,
    isAdmin: loadInfo.storedInfo?.creatorId === "self",
    lang,
  };
}
