import {
  useQueryDeleteRoom,
  useQueryLeaveRoom,
} from "../../../../shared/api/api";
import { RoomId } from "../../../../types";
import { useEffect } from "react";
import { useNotify } from "../../../Notification/Notification";
import { useLoadRooms } from "../../Rooms/useRooms";
import { useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useLoadInfo } from "../../Chat/useChat";
import { routes } from "../../../../constants";

export function useActions() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryDelete = useQueryDeleteRoom();
  const queryLeave = useQueryLeaveRoom();
  const loadInfo = useLoadInfo();
  const loadRooms = useLoadRooms();
  const notify = useNotify();

  async function handleLeave() {
    const { success } = await queryLeave.run(roomId as RoomId);
    if (success) {
      loadRooms.run();
      loadInfo.run();
      notify.show.info("You have successfully left the room");
      navigate({ pathname: routes.rooms.path });
    }
    if (!success) {
      notify.show.error(
        "Invalid response from the server. Please try again later",
      );
    }
  }

  async function handleDelete() {
    const { success } = await queryDelete.run(roomId as RoomId);
    if (success) {
      loadRooms.run();
      loadInfo.run();
      notify.show.info("You have successfully deleted this room");
      navigate({ pathname: routes.rooms.path });
    }
    if (!success) {
      notify.show.error(
        "Invalid response from the server. Please try again later",
      );
    }
  }

  function handleCopy() {
    // TODO Fix
    navigator.clipboard.writeText(location.pathname as string);
    notify.show.info("Room link copied to clipboard");
  }

  useEffect(() => {
    if (!loadInfo.storedInfo) {
      loadInfo.run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    handleLeave,
    handleDelete,
    handleCopy,
    isMember: loadInfo.storedInfo?.isMember,
    isAdmin: loadInfo.storedInfo?.creatorId === "self",
  };
}
