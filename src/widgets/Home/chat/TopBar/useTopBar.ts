import { useInfo } from "../useChat";
import { useLocation, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const openSideBar = () => {
    navigate({ pathname: routes.rooms.path + data.roomId + "/info" });
  };

  const closeSideBar = () => {
    navigate({ pathname: routes.rooms.path + data.roomId });
  };

  return {
    content,
    openSideBar,
    closeSideBar,
    isSideBarExpanded: pathname.includes("/info"),
  };
}
