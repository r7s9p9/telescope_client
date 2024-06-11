import { useNavigate, useParams } from "react-router-dom";
import { RoomId, UserId } from "../../../../../types";
import {
  useQueryInviteUser,
  useQuerySearchUsersToInvite,
} from "../../../../../shared/api/api";
import { useNotify } from "../../../../Notification/Notification";
import { useCallback, useEffect, useState } from "react";
import { RoomSearchUsersToInviteType } from "../../../../../shared/api/api.schema";
import { useMenuContext } from "../../../../ContextMenu/ContextMenu";
import { routes } from "../../../../../constants";

export function useInvite() {
  const { roomId } = useParams();
  const querySearch = useQuerySearchUsersToInvite();
  const queryInvite = useQueryInviteUser();
  const notify = useNotify();
  const navigate = useNavigate();
  const { openMenu, closeMenu } = useMenuContext();

  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState<RoomSearchUsersToInviteType>();

  const run = useCallback(async () => {
    const result = await querySearch.run(roomId as RoomId, inputValue);
    if (!result.success) {
      notify.show.error(
        "Invalid response from the server. Please try again later",
      );
    } else {
      setData(result.data);
    }
  }, [inputValue, notify.show, querySearch, roomId]);

  const onClickMenuHandler = () => {
    const invite = async (userId: UserId, username: string) => {
      const { success, data } = await queryInvite.run(roomId as RoomId, userId);
      if (!success) {
        notify.show.error(
          "Invalid response from the server. Please try again later",
        );
      } else if (data.access && data.success) {
        notify.show.info(
          `The user ${username} was successfully invited to this room`,
        );
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
