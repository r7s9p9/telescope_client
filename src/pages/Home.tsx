import { NotifyStack } from "../widgets/Notification/Notification";
import { PopupStack } from "../widgets/Popup/Popup";
import { Link, Outlet } from "react-router-dom";
import {
  IconMessageCircle,
  IconSettings,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-react";
import { routes } from "../constants";
import { IconButton } from "../shared/ui/IconButton/IconButton";

export default function Home() {
  return (
    <div className="w-full h-full flex bg-slate-200">
      <NotifyStack />
      <PopupStack />
      <LeftPanel />
      <Outlet />
    </div>
  );
}

function LeftPanel() {
  return (
    <div className="shrink-0 h-full bg-slate-600 px-2 flex flex-col items-center gap-2">
      <Link to={routes.profile.path}>
        <IconButton title="Profile" noHover className="pt-2">
          <IconUserCircle strokeWidth="1" className="text-white" size={36} />
        </IconButton>
      </Link>
      <Link to={routes.rooms.path}>
        <IconButton title="Rooms" noHover className="pt-2">
          <IconMessageCircle
            strokeWidth="1"
            className="text-slate-50"
            size={36}
          />
        </IconButton>
      </Link>
      <Link to={routes.friends.path}>
        <IconButton title="Friends" noHover className="pt-2">
          <IconUsersGroup strokeWidth="1" className="text-white" size={36} />
        </IconButton>
      </Link>
      <div className="grow"></div>
      <Link to={routes.settings.path}>
        <IconButton title="Settings" noHover className="pb-2">
          <IconSettings strokeWidth="1" className="text-white" size={36} />
        </IconButton>
      </Link>
    </div>
  );
}
