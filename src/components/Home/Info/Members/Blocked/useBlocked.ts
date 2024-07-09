import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RoomId, UserId } from "../../../../../shared/api/api.schema";
import {
  useQueryGetBlockedUsersInRoom,
  useQueryUnbanUserInRoom,
} from "../../../../../shared/api/api.model";
import { useEffect, useState } from "react";
import { useNotify } from "../../../../../shared/features/Notification/Notification";
import { GetRoomBlockedUsersResponseType } from "../../../../../shared/api/api.schema";
import { routes } from "../../../../../constants";
import { useMenuContext } from "../../../../../shared/features/ContextMenu/ContextMenu";
import { langError, langBlockedNotification } from "../../../../../locales/en";
import { useOnClickOutside } from "../../../../../shared/hooks/useOnClickOutside";

export function useBlocked() {
  const { roomId } = useParams();
  const queryRead = useQueryGetBlockedUsersInRoom();
  const queryUnban = useQueryUnbanUserInRoom();
  const notify = useNotify();
  const navigate = useNavigate();
  const location = useLocation();
  const { openMenu, closeMenu } = useMenuContext();

  const onClose = () => {
    if (!location.state?.prevPath) {
      navigate(routes.home.path);
      return;
    }
    navigate(location.state?.prevPath);
  };

  const { contentRef, overlayRef } = useOnClickOutside({
    onClickOutside: onClose,
  });

  const [blocked, setBlocked] =
    useState<GetRoomBlockedUsersResponseType["users"]>();

  const read = async () => {
    const { success, response, requestError, responseError } =
      await queryRead.run({ roomId: roomId as RoomId });
    if (!success) {
      notify.show.error(
        requestError || responseError || langError.UNKNOWN_MESSAGE,
      );
      return;
    }
    setBlocked(response.users);
  };

  const onClickMenuHandler = () => {
    const unban = async (userId: UserId, username: string) => {
      const { success, response, requestError, responseError } =
        await queryUnban.run({ roomId: roomId as RoomId, userIds: [userId] });
      if (!success) {
        notify.show.error(
          requestError || responseError || langError.UNKNOWN_MESSAGE,
        );
        closeMenu();
        return;
      }
      if (!response.access) {
        notify.show.error(langBlockedNotification.UNBAN_NO_RIGHT);
        closeMenu();
        return;
      }
      if (!response.success) {
        notify.show.error(langBlockedNotification.UNBAN_FAIL(username));
        closeMenu();
        return;
      }
      notify.show.info(langBlockedNotification.UNBAN_SUCCESS(username));
      read();
      closeMenu();
      return;
    };

    const copy = (username: string) => {
      navigator.clipboard.writeText(username);
      notify.show.info(langBlockedNotification.COPY_SUCCESS);
      closeMenu();
    };

    const profile = (userId: UserId) => {
      navigate(routes.profile.pathPart + userId, {
        state: { prevPath: location.pathname },
      });
      closeMenu();
    };

    return { unban, copy, profile };
  };

  useEffect(() => {
    if (!blocked) read();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    reload: read,
    isLoading: queryRead.isLoading,
    isEmpty: !blocked,
    blockedUsers: blocked,
    openMenu,
    onClickMenuHandler,
    onClose,
    contentRef,
    overlayRef,
  };
}
