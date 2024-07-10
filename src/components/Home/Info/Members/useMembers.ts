import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useQueryBanMember,
  useQueryGetMembers,
  useQueryKickMember,
} from "../../../../shared/api/api.model";
import { useLoadInfo } from "../../Chat/useChat";
import { useCallback, useEffect, useRef, useState, UIEvent } from "react";
import { GetRoomsMembersResponseType } from "../../../../shared/api/api.schema";
import { debounce } from "../../../../shared/lib/debounce";
import { routes } from "../../../../constants";
import { RoomId, UserId } from "../../../../shared/api/api.schema";
import { useMenuContext } from "../../../../shared/features/ContextMenu/ContextMenu";
import { useNotify } from "../../../../shared/features/Notification/Notification";
import { useLang } from "../../../../shared/features/LangProvider/LangProvider";

const DEBOUNCE_SCROLL_INTERVAL = 200;

// TODO
// !!! Move members to store !!!
// TODO

export function useMembers() {
  const { lang } = useLang();
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
        requestError || responseError || lang.error.UNKNOWN_MESSAGE,
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
    (e: UIEvent<HTMLElement>) => {
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
    lang,
  };
}

export function useMember({
  getMembers,
}: {
  getMembers: ReturnType<typeof useMembers>["getMembers"];
}) {
  const { lang } = useLang();
  const { openMenu, closeMenu } = useMenuContext();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();

  const kickQuery = useQueryKickMember();
  const banQuery = useQueryBanMember();

  function onClickMenuHandler() {
    const profile = (userId: string) => {
      navigate(`${routes.profile.pathPart}/${userId}`, {
        state: { prevPath: location.pathname },
      });
      closeMenu();
    };

    const copy = (username: string) => {
      navigator.clipboard.writeText(username as string);
      notify.show.info(lang.membersNotification.COPY_SUCCESS);
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
            requestError || responseError || lang.error.UNKNOWN_MESSAGE,
          );
          closeMenu();
          return;
        }

        if (!response.access) {
          notify.show.error(lang.membersNotification.KICK_NO_RIGHT);
          closeMenu();
          return;
        }
        if (!response.success) {
          notify.show.error(lang.membersNotification.KICK_FAIL(username));
          closeMenu();
          return;
        }
        if (response.success) {
          notify.show.info(lang.membersNotification.KICK_SUCCESS(username));
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
            requestError || responseError || lang.error.UNKNOWN_MESSAGE,
          );
          closeMenu();
          return;
        }
        if (!response.access) {
          notify.show.error(lang.membersNotification.BAN_NO_RIGHT);
          closeMenu();
          return;
        }
        if (!response.success) {
          notify.show.error(lang.membersNotification.BAN_FAIL(username));
          closeMenu();
          return;
        }
        notify.show.info(lang.membersNotification.BAN_SUCCESS(username));
        getMembers();
        closeMenu();
        return;
      }
    };

    return { profile, copy, kick, ban };
  }

  return { openMenu, onClickMenuHandler };
}
