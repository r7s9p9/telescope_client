import { IconButton } from "../../../shared/ui/IconButton/IconButton";
import {
  IconMessageCircle,
  IconSettings,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-react";
import { usePanel } from "./usePanel";
import { langPanel } from "../../../locales/en";

export function Panel() {
  const { onClickHandler } = usePanel();

  const iconProps = {
    strokeWidth: "1",
    size: 32,
    className: "md:text-white text-slate-600",
  };

  return (
    <div className="shrink-0 w-full md:w-fit h-14 md:h-full bg-slate-50 md:bg-slate-600 px-4 md:px-2 py-2 flex md:flex-col items-center gap-4">
      <IconButton
        title={langPanel.PROFILE_LABEL}
        noHover
        className="md:pt-2"
        onClick={onClickHandler().profile}
      >
        <IconUserCircle {...iconProps} />
      </IconButton>
      <IconButton
        title={langPanel.ROOMS_LABEL}
        noHover
        className="md:pt-2"
        onClick={onClickHandler().rooms}
      >
        <IconMessageCircle {...iconProps} />
      </IconButton>
      <IconButton
        title={langPanel.FRIENDS_LABEL}
        noHover
        className="md:pt-2"
        onClick={onClickHandler().friends}
      >
        <IconUsersGroup {...iconProps} />
      </IconButton>
      <div className="grow" />
      <IconButton
        title={langPanel.SETTINGS_LABEL}
        noHover
        className="md:pb-2"
        onClick={onClickHandler().settings}
      >
        <IconSettings {...iconProps} />
      </IconButton>
    </div>
  );
}
