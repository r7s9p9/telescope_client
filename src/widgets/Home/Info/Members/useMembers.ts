import { useNavigate, useParams } from "react-router-dom";
import {
  useQueryBanMember,
  useQueryGetMembers,
  useQueryKickMember,
} from "../../../../shared/api/api";
import { useLoadInfo } from "../../Chat/useChat";
import { useCallback, useEffect, useRef, useState } from "react";
import { RoomGetMembersType } from "../../../../shared/api/api.schema";
import { debounce } from "../../../../shared/lib/debounce";
import { routes } from "../../../../constants";
import { RoomId, UserId } from "../../../../types";
import { useMenuContext } from "../../../ContextMenu/ContextMenu";
import { useNotify } from "../../../Notification/Notification";

const DEBOUNCE_SCROLL_INTERVAL = 200;

// TODO
// !!! Move members to store !!!
// TODO

export function useMembers() {
  const { roomId } = useParams();
  const query = useQueryGetMembers();
  const info = useLoadInfo();

  const listRef = useRef<HTMLUListElement>(null);
  const [data, setData] = useState<RoomGetMembersType | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const getMembers = async () => {
    const { success, data } = await query.run(roomId as RoomId);
    if (!success) return { success: false as const };
    setData(data);
    return { success: true as const };
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
    isLoading: query.isLoading,
    isAdmin: info.storedInfo?.creatorId === "self",
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
  const notify = useNotify();

  const kickQuery = useQueryKickMember();
  const banQuery = useQueryBanMember();

  function onClickMenuHandler() {
    const profile = (userId: string) => {
      // TODO Pages for another users
      if (userId === "self") navigate(routes.profile.path);
      closeMenu();
    };
    const copy = (username: string) => {
      navigator.clipboard.writeText(username as string);
      notify.show.info("Username copied to clipboard");
      closeMenu();
    };
    const kick = async (userId: string, username: string) => {
      if (userId !== "self") {
        const result = await kickQuery.run(roomId as RoomId, userId as UserId);
        if (!result.success) {
          notify.show.error(
            "Invalid response from the server. Please try again later",
          );
          closeMenu();
          return;
        }
        if (!result.data.access) {
          notify.show.error("You don't have enough rights");
          closeMenu();
          return;
        }
        if (!result.data.success) {
          notify.show.error(
            `User ${username} cannot be kicked. Perhaps he is no longer a member of the room`,
          );
          closeMenu();
          return;
        }
        if (result.data.success) {
          notify.show.info(
            `User ${username} successfully kicked out of the room`,
          );
          getMembers();
          closeMenu();
          return;
        }
      }
    };
    const ban = async (userId: string, username: string) => {
      if (userId !== "self") {
        const result = await banQuery.run(roomId as RoomId, userId as UserId);
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
            `User ${username} cannot be banned. Perhaps he is no longer a member of the room`,
          );
          return;
        }
        if (result.data.success) {
          notify.show.info(
            `User ${username} successfully banned from this room`,
          );
          getMembers();
          return;
        }
      }
      closeMenu();
    };
    return { profile, copy, kick, ban };
  }

  return { openMenu, onClickMenuHandler };
}
