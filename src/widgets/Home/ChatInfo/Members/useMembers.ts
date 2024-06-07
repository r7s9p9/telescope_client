import { useNavigate, useParams } from "react-router-dom";
import {
  useQueryBanMember,
  useQueryGetMembers,
  useQueryKickMember,
} from "../../../../shared/api/api";
import { useLoadInfo } from "../../Chat/useChat";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AccountReadType,
  RoomGetMembersType,
} from "../../../../shared/api/api.schema";
import { debounce } from "../../../../shared/lib/debounce";
import { routes } from "../../../../constants";
import { RoomId } from "../../../../types";
import { useMenuContext } from "../../../ContextMenu/ContextMenu";
import { useNotify } from "../../../Notification/Notification";

const DEBOUNCE_SCROLL_INTERVAL = 200;

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
    getMembers();
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
    getMembers,
    listRef,
    debouncedHandleScroll,
    data,
    isLoading: query.isLoading,
    isAdmin: info.storedInfo?.creatorId === "self",
  };
}

export function useMember({
  data,
  getMembers,
}: {
  data: AccountReadType;
  getMembers: ReturnType<typeof useMembers>["getMembers"];
}) {
  const { openMenu, closeMenu } = useMenuContext();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();

  const kickQuery = useQueryKickMember();
  const banQuery = useQueryBanMember();

  async function onClickMenuHandler(type: "profile" | "copy" | "kick" | "ban") {
    if (type === "profile") {
      // TODO Pages for another users
      if (data.targetUserId === "self") navigate(routes.profile.path);
    }
    if (type === "copy") {
      navigator.clipboard.writeText(data?.general?.username as string);
      notify.show.info("Username copied to clipboard");
    }
    if (type === "kick" && data.targetUserId !== "self") {
      const result = await kickQuery.run(roomId as RoomId, data.targetUserId);
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
          `User ${data.general?.username} cannot be kicked. Perhaps he is no longer a member of the room`,
        );
        return;
      }
      if (result.data.success) {
        notify.show.info(
          `User ${data.general?.username} successfully kicked out of the room`,
        );
        getMembers();
        return;
      }
    }
    if (type === "ban" && data.targetUserId !== "self") {
      const result = await banQuery.run(roomId as RoomId, data.targetUserId);
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
          `User ${data.general?.username} cannot be banned. Perhaps he is no longer a member of the room`,
        );
        return;
      }
      if (result.data.success) {
        notify.show.info(
          `User ${data.general?.username} successfully banned from this room`,
        );
        getMembers();
        return;
      }
    }
    closeMenu();
  }

  return { openMenu, onClickMenuHandler };
}
