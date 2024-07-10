import { useInfo } from "../useChat";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../../../constants";
import { useLang } from "../../../../shared/features/LangProvider/LangProvider";

export function useTopBar(data: ReturnType<typeof useInfo>) {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  let userCountStr = "";
  if (data.info.userCount === 0) {
    userCountStr = lang.topBar.NO_MEMBERS_TEXT;
  }
  if (data.info.userCount === 1) {
    userCountStr = lang.topBar.ONE_MEMBER_TEXT;
  }
  if (data.info.userCount && data.info.userCount > 1) {
    userCountStr = `${data.info.userCount} ${lang.topBar.MEMBERS_TEXT}`;
  }

  let description = "";
  switch (data.info.type) {
    case "private":
      description = lang.topBar.PRIVATE_TYPE;
      break;
    case "public":
      description = lang.topBar.PUBLIC_TYPE;
      break;
    case "single":
      description = lang.topBar.SINGLE_TYPE;
      break;
    case "service":
      description = lang.topBar.SERVICE_TYPE;
      break;
  }

  description = `${description} ${lang.topBar.ROOM_TEXT}, ${userCountStr}`;

  const content = {
    isInitialLoading: data.info.isInitialLoading,
    isMember: data.info.isMember,
    name: data.info.name,
    description,
  };

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
