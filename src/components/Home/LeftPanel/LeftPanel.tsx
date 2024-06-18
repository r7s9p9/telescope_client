import { Link } from "react-router-dom";
import { IconButton } from "../../../shared/ui/IconButton/IconButton";
import {
  IconMessageCircle,
  IconSettings,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-react";
import { routes } from "../../../constants";

export function LeftPanel() {
  const iconProps = {
    strokeWidth: "1",
    className: "text-white",
    size: 36,
  };

  return (
    <div className="shrink-0 h-full bg-slate-600 px-2 flex flex-col items-center gap-2">
      <Link to={routes.profile.pathPart + "self"}>
        <IconButton title="Profile" noHover className="pt-2">
          <IconUserCircle {...iconProps} />
        </IconButton>
      </Link>
      <Link to={routes.rooms.path}>
        <IconButton title="Rooms" noHover className="pt-2">
          <IconMessageCircle {...iconProps} />
        </IconButton>
      </Link>
      <Link to={routes.friends.path}>
        <IconButton title="Friends" noHover className="pt-2">
          <IconUsersGroup {...iconProps} />
        </IconButton>
      </Link>
      <div className="grow" />
      <Link to={routes.settings.path}>
        <IconButton title="Settings" noHover className="pb-2">
          <IconSettings {...iconProps} />
        </IconButton>
      </Link>
    </div>
  );
}
