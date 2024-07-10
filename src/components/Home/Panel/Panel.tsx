import { IconButton } from "../../../shared/ui/IconButton/IconButton";
import {
  IconMessageCircle,
  IconSettings,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-react";
import { usePanel } from "./usePanel";

const iconButtonProps = {
  noHover: true,
  className: "md:pt-2",
};

const iconProps = {
  strokeWidth: "1",
  size: 32,
  className: "md:text-white text-slate-600",
};

export function Panel() {
  const { onClickHandler, lang } = usePanel();

  return (
    <div className="shrink-0 w-full md:w-fit h-14 md:h-full bg-slate-50 md:bg-slate-600 px-4 md:px-2 py-2 flex md:flex-col items-center gap-4">
      <IconButton
        {...iconButtonProps}
        title={lang.panel.PROFILE_LABEL}
        onClick={onClickHandler().profile}
      >
        <IconUserCircle {...iconProps} />
      </IconButton>
      <IconButton
        {...iconButtonProps}
        title={lang.panel.ROOMS_LABEL}
        onClick={onClickHandler().rooms}
      >
        <IconMessageCircle {...iconProps} />
      </IconButton>
      <IconButton
        {...iconButtonProps}
        title={lang.panel.FRIENDS_LABEL}
        onClick={onClickHandler().friends}
      >
        <IconUsersGroup {...iconProps} />
      </IconButton>
      <div className="grow" />
      <IconButton
        {...iconButtonProps}
        title={lang.panel.SETTINGS_LABEL}
        onClick={onClickHandler().settings}
      >
        <IconSettings {...iconProps} />
      </IconButton>
    </div>
  );
}
