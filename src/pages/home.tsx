import { NotifyStack } from "../widgets/notification/notification";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  IconMessageCircle,
  IconSettings,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-react";
import { routes } from "../constants";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-row bg-slate-200">
      <NotifyStack />
      {/* <HomeHeader /> */}
      <LeftPanel />
      <Outlet />
    </div>
  );
}

function LeftPanel() {
  return (
    <div className="shrink-0 h-full p-2 bg-slate-600 flex flex-col items-center gap-2">
      <button
        title="Account"
        className="size-12 p-2 rounded-full hover:bg-slate-500 duration-200"
      >
        <IconUserCircle strokeWidth="1" className="text-slate-50" size={32} />
      </button>
      <Link
        to={routes.rooms.path}
        title="Rooms"
        className="size-12 p-2 rounded-full hover:bg-slate-500 duration-200"
      >
        <IconMessageCircle
          strokeWidth="1"
          className="text-slate-50"
          size={32}
        />
      </Link>
      <Link
        to={routes.friends.path}
        title="Friends"
        className="size-12 p-2 rounded-full hover:bg-slate-500 duration-200"
      >
        <IconUsersGroup strokeWidth="1" className="text-slate-50" size={32} />
      </Link>
      <div className="grow"></div>
      <Link
        to={routes.settings.path}
        title="Settings"
        className="size-12 p-2 rounded-full hover:bg-slate-500 duration-200 justify-self-end"
      >
        <IconSettings strokeWidth="1" className="text-slate-50" size={32} />
      </Link>
    </div>
  );
}
