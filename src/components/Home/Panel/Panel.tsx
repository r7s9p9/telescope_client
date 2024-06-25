import { Link } from "react-router-dom";
import { IconButton } from "../../../shared/ui/IconButton/IconButton";
import {
  IconMessageCircle,
  IconSettings,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-react";
import { routes } from "../../../constants";

export function Panel() {
  const iconProps = {
    strokeWidth: "1",
    size: 32,
  };

  return (
    <div className="shrink-0 w-full md:w-fit h-14 md:h-full bg-slate-50 md:bg-slate-600 px-4 md:px-2 py-2 flex md:flex-col items-center gap-4">
      <Link to={routes.profile.pathPart + "/self"}>
        <IconButton title="Profile" noHover className="md:pt-2">
          <IconUserCircle
            {...iconProps}
            className="md:text-white text-slate-600"
          />
        </IconButton>
      </Link>
      <Link to={routes.rooms.path}>
        <IconButton title="Rooms" noHover className="md:pt-2">
          <IconMessageCircle
            {...iconProps}
            className="md:text-white text-slate-600"
          />
        </IconButton>
      </Link>
      <Link to={routes.friends.path}>
        <IconButton title="Friends" noHover className="md:pt-2">
          <IconUsersGroup
            {...iconProps}
            className="md:text-white text-slate-600"
          />
        </IconButton>
      </Link>
      <div className="grow" />
      <Link to={routes.settings.path}>
        <IconButton title="Settings" noHover className="md:pb-2">
          <IconSettings
            {...iconProps}
            className="md:text-white text-slate-600"
          />
        </IconButton>
      </Link>
    </div>
  );
}
