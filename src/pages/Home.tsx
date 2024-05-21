import { NotifyStack } from "../widgets/Notification/Notification";
import { Link, Outlet } from "react-router-dom";
import {
  IconMessageCircle,
  IconSettings,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-react";
import { routes } from "../constants";
import { Button } from "../shared/ui/Button/Button";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-row bg-slate-200">
      <NotifyStack />
      <LeftPanel />
      <Outlet />
    </div>
  );
}

function LeftPanel() {
  return (
    <div className="shrink-0 h-full bg-slate-600 px-2 flex flex-col items-center gap-2">
      <Link to={routes.profile.path}>
        <Button title="Profile" rounded="full" noHover className="pt-2">
          <IconUserCircle strokeWidth="1" className="text-slate-50" size={36} />
        </Button>
      </Link>
      <Link to={routes.rooms.path}>
        <Button title="Rooms" rounded="full" noHover className="pt-2">
          <IconMessageCircle
            strokeWidth="1"
            className="text-slate-50"
            size={36}
          />
        </Button>
      </Link>
      <Link to={routes.friends.path}>
        <Button title="Friends" rounded="full" noHover className="pt-2">
          <IconUsersGroup strokeWidth="1" className="text-slate-50" size={36} />
        </Button>
      </Link>
      <div className="grow"></div>
      <Link to={routes.settings.path}>
        <Button title="Settings" rounded="full" noHover className="pb-2">
          <IconSettings strokeWidth="1" className="text-slate-50" size={36} />
        </Button>
      </Link>
    </div>
  );
}
