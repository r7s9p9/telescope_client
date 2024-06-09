import { useNavigate, useParams } from "react-router-dom";
import { RoomId, UserId } from "../../../../../types";
import {
  useQueryGetBlockedUsersInRoom,
  useQueryUnbanUserInRoom,
} from "../../../../../shared/api/api";
import { useEffect, useState } from "react";
import { useNotify } from "../../../../Notification/Notification";
import { RoomBlockedUsersType } from "../../../../../shared/api/api.schema";
import { routes } from "../../../../../constants";
import { useMenuContext } from "../../../../ContextMenu/ContextMenu";

export function useBlocked() {
  const { roomId } = useParams();
  const queryRead = useQueryGetBlockedUsersInRoom();
  const queryUnban = useQueryUnbanUserInRoom();
  const notify = useNotify();
  const navigate = useNavigate();
  const { openMenu, closeMenu } = useMenuContext();

  const [blocked, setBlocked] = useState<RoomBlockedUsersType>();

  const read = async () => {
    const { success, data } = await queryRead.run(roomId as RoomId);
    if (!success) {
      notify.show.error(
        "Invalid response from the server. Please try again later",
      );
    } else {
      setBlocked(data);
    }
  };

  const onClickMenuHandler = () => {
    const unban = async (userId: UserId, username: string) => {
      const { success, data } = await queryUnban.run(roomId as RoomId, userId);
      if (!success) {
        notify.show.error(
          "Invalid response from the server. Please try again later",
        );
      } else if (data.access && data.success) {
        notify.show.info(`The user ${username} was successfully unbanned`);
        read();
      } else {
        notify.show.error(
          "Invalid response from the server. Please try again later",
        );
      }
      closeMenu();
    };

    const copy = (username: string) => {
      navigator.clipboard.writeText(username);
      notify.show.info("Username copied to clipboard");
      closeMenu();
    };

    // TODO Pages for another users
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const profile = (userId: UserId) => {
      navigate(routes.profile.path);
      closeMenu();
    };

    return { unban, copy, profile };
  };

  useEffect(() => {
    if (!blocked) read();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    roomId: roomId as RoomId,
    reload: read,
    isLoading: queryRead.isLoading,
    isEmpty: blocked?.isEmpty || !blocked?.users,
    blockedUsers: blocked?.users,
    openMenu,
    onClickMenuHandler,
  };
}
