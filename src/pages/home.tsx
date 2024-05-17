import { NotifyStack } from "../widgets/notification/notification";
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
    <div className="shrink-0 h-full p-2 bg-slate-600 flex flex-col items-center gap-2">
      <Link to={routes.profile.path}>
        <Button title="Profile" rounded="full" noHover>
          <IconUserCircle strokeWidth="1" className="text-slate-50" size={32} />
        </Button>
      </Link>
      <Link to={routes.rooms.path}>
        <Button title="Rooms" rounded="full" noHover>
          <IconMessageCircle
            strokeWidth="1"
            className="text-slate-50"
            size={32}
          />
        </Button>
      </Link>
      <Link to={routes.friends.path}>
        <Button title="Friends" rounded="full" noHover>
          <IconUsersGroup strokeWidth="1" className="text-slate-50" size={32} />
        </Button>
      </Link>
      <div className="grow"></div>
      <Link to={routes.settings.path}>
        <Button title="Settings" rounded="full" noHover>
          <IconSettings strokeWidth="1" className="text-slate-50" size={32} />
        </Button>
      </Link>
    </div>
  );
}
