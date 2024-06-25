import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useQueryBanMember,
  useQueryGetMembers,
  useQueryKickMember,
} from "../../../../shared/api/api.model";
import { useLoadInfo } from "../../Chat/useChat";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetRoomsMembersResponseType } from "../../../../shared/api/api.schema";
import { debounce } from "../../../../shared/lib/debounce";
import { routes } from "../../../../constants";
import { RoomId, UserId } from "../../../../shared/api/api.schema";
import { useMenuContext } from "../../../ContextMenu/ContextMenu";
import { useNotify } from "../../../Notification/Notification";
import { langError, langRoom } from "../../../../locales/en";

const DEBOUNCE_SCROLL_INTERVAL = 200;

// TODO
// !!! Move members to store !!!
// TODO

export function useMembers() {
  const { roomId } = useParams();
  const query = useQueryGetMembers();
  const info = useLoadInfo();
  const notify = useNotify();
  const navigate = useNavigate();
  const location = useLocation();

  const onClickBlocked = () => {
    navigate(`${location.pathname}/blocked`, {
      state: { prevPath: location.pathname },
    });
  };

  const onClickInvite = () => {
    navigate(`${location.pathname}/invite`, {
      state: { prevPath: location.pathname },
    });
  };

  const listRef = useRef<HTMLUListElement>(null);
  const [data, setData] = useState<GetRoomsMembersResponseType | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const getMembers = async () => {
    const { success, response, requestError, responseError } = await query.run({
      roomId: roomId as RoomId,
    });

    if (!success) {
      notify.show.error(
        requestError || responseError || langError.UNKNOWN_MESSAGE,
      );
      return;
    }

    setData(response);
  };

  const restoreScroll = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = scrollTop;
    }
  }, [listRef, scrollTop]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      if (listRef.current) {
        const target = e.nativeEvent.target as HTMLElement;
        setScrollTop(target.scrollTop);
      }
    },
    [listRef],
  );

  useEffect(() => {
    if (!data?.users) getMembers();
    if (!info.storedInfo) info.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    restoreScroll();
  }, [data, restoreScroll]);

  const debouncedHandleScroll = debounce(
    handleScroll,
    DEBOUNCE_SCROLL_INTERVAL,
  );

  return {
    roomId,
    getMembers,
    listRef,
    debouncedHandleScroll,
    data,
    isLoading: query.isLoading || !data,
    isAdmin: info.storedInfo?.creatorId === "self",
    onClickBlocked,
    onClickInvite,
  };
}

export function useMember({
  getMembers,
}: {
  getMembers: ReturnType<typeof useMembers>["getMembers"];
}) {
  const { openMenu, closeMenu } = useMenuContext();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();

  const kickQuery = useQueryKickMember();
  const banQuery = useQueryBanMember();

  function onClickMenuHandler() {
    const profile = (userId: string) => {
      navigate(routes.profile.pathPart + userId, {
        state: { prevPath: location.pathname },
      });
      closeMenu();
    };
    const copy = (username: string) => {
      navigator.clipboard.writeText(username as string);
      notify.show.info(langRoom.COPY_USERNAME);
      closeMenu();
    };
    const kick = async (userId: string, username: string) => {
      if (userId !== "self") {
        const { success, response, requestError, responseError } =
          await kickQuery.run({
            roomId: roomId as RoomId,
            userIds: [userId as UserId],
          });

        if (!success) {
          notify.show.error(
            requestError || responseError || langError.UNKNOWN_MESSAGE,
          );
          closeMenu();
          return;
        }

        if (!response.access) {
          notify.show.error(langRoom.KICK_NO_RIGHT);
          closeMenu();
          return;
        }
        if (!response.success) {
          notify.show.error(langRoom.KICK_FAIL(username));
          closeMenu();
          return;
        }
        if (response.success) {
          notify.show.info(langRoom.KICK_SUCCESS(username));
          getMembers();
          closeMenu();
          return;
        }
      }
    };
    const ban = async (userId: string, username: string) => {
      // dummy protection
      if (userId !== "self") {
        const { success, response, requestError, responseError } =
          await banQuery.run({
            roomId: roomId as RoomId,
            userIds: [userId as UserId],
          });
        if (!success) {
          notify.show.error(
            requestError || responseError || langError.UNKNOWN_MESSAGE,
          );
          closeMenu();
          return;
        }
        if (!response.access) {
          notify.show.error(langRoom.BAN_NO_RIGHT);
          closeMenu();
          return;
        }
        if (!response.success) {
          notify.show.error(langRoom.BAN_FAIL(username));
          closeMenu();
          return;
        }
        notify.show.info(langRoom.BAN_SUCCESS(username));
        getMembers();
        closeMenu();
        return;
      }
    };
    return { profile, copy, kick, ban };
  }

  return { openMenu, onClickMenuHandler };
}
