import { useCallback, useEffect, useRef, useState } from "react";
import { useInfo, useLoadInfo } from "../useChat";
import { useQueryLeaveRoom } from "../../../../shared/api/api";
import { useNavigate } from "react-router-dom";
import { useLoadRooms } from "../../Rooms/useRooms";
import { routes } from "../../../../constants";

export function useTopBar(data: ReturnType<typeof useInfo>) {
  let userCountStr = "";
  if (data.info.userCount === 0) {
    userCountStr = "no members";
  }
  if (data.info.userCount === 1) {
    userCountStr = "1 member";
  }
  if (data.info.userCount && data.info.userCount > 1) {
    userCountStr = `${data.info.userCount} members`;
  }

  const content = {
    isInitialLoading: data.info.isInitialLoading,
    isMember: data.info.isMember,
    name: data.info.name,
    description: `${data.info?.type} room, ${userCountStr}`,
  };

  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const openMenu = () => {
    setIsMenuOpened(true);
  };

  const closeMenu = () => {
    setIsMenuOpened((isMenuOpened) => (isMenuOpened ? false : isMenuOpened));
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        contentRef.current &&
        buttonRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    },
    [contentRef, buttonRef],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryLeave = useQueryLeaveRoom();
  const navigate = useNavigate();

  const loadRooms = useLoadRooms();
  const loadInfo = useLoadInfo();

  async function onClickMenuHandler(type: "info" | "leave") {
    if (type === "info") {
      navigate({ pathname: routes.rooms.path + data.roomId + "/info" });
    }
    if (type === "leave") {
      const { success } = await queryLeave.run(data.roomId);
      if (success) {
        loadRooms.run();
        loadInfo.run();
        navigate({ pathname: routes.rooms.path });
      }
    }
  }

  return {
    content,
    menu: {
      buttonRef,
      contentRef,
      isOpened: isMenuOpened,
      open: openMenu,
      onClickHandler: onClickMenuHandler,
    },
  };
}
