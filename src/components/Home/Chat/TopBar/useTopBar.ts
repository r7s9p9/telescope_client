import { useInfo } from "../useChat";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../../../constants";
import { langTopBar } from "../../../../locales/en";

export function useTopBar(data: ReturnType<typeof useInfo>) {
  let userCountStr = "";
  if (data.info.userCount === 0) {
    userCountStr = langTopBar.NO_MEMBERS_TEXT;
  }
  if (data.info.userCount === 1) {
    userCountStr = langTopBar.ONE_MEMBER_TEXT;
  }
  if (data.info.userCount && data.info.userCount > 1) {
    userCountStr = `${data.info.userCount} ${langTopBar.MEMBERS_TEXT}`;
  }

  const content = {
    isInitialLoading: data.info.isInitialLoading,
    isMember: data.info.isMember,
    name: data.info.name,
    description: `${data.info?.type} ${langTopBar.ROOM_TEXT}, ${userCountStr}`,
  };

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const openSideBar = () => {
    navigate({ pathname: `${routes.rooms.path}/${data.roomId}/info` });
  };

  const closeSideBar = () => {
    navigate({ pathname: `${routes.rooms.path}/${data.roomId}` });
  };

  const closeChat = () => {
    navigate({ pathname: routes.rooms.path });
  };

  return {
    content,
    openSideBar,
    closeSideBar,
    closeChat,
    isSideBarExpanded: pathname.includes("/info"),
  };
}
