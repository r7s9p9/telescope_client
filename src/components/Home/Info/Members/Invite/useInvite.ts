import { useNavigate, useParams } from "react-router-dom";
import { RoomId, UserId } from "../../../../../shared/api/api.schema";
import {
  useQueryInviteUser,
  useQuerySearchUsersToInvite,
} from "../../../../../shared/api/api.model";
import { useNotify } from "../../../../Notification/Notification";
import { useCallback, useEffect, useState } from "react";
import { RoomSearchUsersToInviteResponseType } from "../../../../../shared/api/api.schema";
import { useMenuContext } from "../../../../ContextMenu/ContextMenu";
import { routes } from "../../../../../constants";
import { langError, langRoom } from "../../../../../locales/en";

export function useInvite() {
  const { roomId } = useParams();
  const querySearch = useQuerySearchUsersToInvite();
  const queryInvite = useQueryInviteUser();
  const notify = useNotify();
  const navigate = useNavigate();
  const { openMenu, closeMenu } = useMenuContext();

  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState<RoomSearchUsersToInviteResponseType>();

  const run = useCallback(async () => {
    const { success, response, requestError, responseError } =
      await querySearch.run({
        roomId: roomId as RoomId,
        limit: 10,
        offset: 0,
        q: inputValue,
      });
    if (!success) {
      // Move request error to UI
      notify.show.error(
        requestError?.q || responseError || langError.UNKNOWN_MESSAGE,
      );
      return;
    }

    if (!response.access) {
      notify.show.error(langRoom.SEARCH_TO_INVITE_NO_RIGHT);
      return;
    }
    if (!response.success) {
      notify.show.error(langError.UNKNOWN_MESSAGE);
      return;
    }
    setData(response);
  }, [inputValue, notify.show, querySearch, roomId]);

  const onClickMenuHandler = () => {
    const invite = async (userId: UserId, username: string) => {
      const { success, response, requestError, responseError } =
        await queryInvite.run({ roomId: roomId as RoomId, userIds: [userId] });
      if (!success) {
        notify.show.error(
          requestError || responseError || langError.UNKNOWN_MESSAGE,
        );
        closeMenu();
        return;
      }

      // TODO Add check if user is already member

      if (!response.access) {
        notify.show.error(langRoom.INVITE_NO_RIGHT);
        closeMenu();
        return;
      }

      if (!response.success) {
        notify.show.error(langRoom.INVITE_FAIL(username));
        closeMenu();
        return;
      }
      notify.show.info(langRoom.INVITE_SUCCESS(username));
      closeMenu();
    };

    const copy = (username: string) => {
      navigator.clipboard.writeText(username);
      notify.show.info(langRoom.COPY_USERNAME);
      closeMenu();
    };

    // TODO Pages for another users
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const profile = (userId: UserId) => {
      navigate(routes.profile.path);
      closeMenu();
    };

    return { invite, copy, profile };
  };

  useEffect(() => {
    if (inputValue) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return {
    roomId: roomId as RoomId,
    inputValue,
    setInputValue,
    users: data?.users,
    isLoading: querySearch.isLoading,
    openMenu,
    onClickMenuHandler,
  };
}
