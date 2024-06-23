import { IconX } from "@tabler/icons-react";
import { useInfo } from "./useInfo";
import { IconButton } from "../../../shared/ui/IconButton/IconButton";
import { Text } from "../../../shared/ui/Text/Text";
import { Paper } from "../../../shared/ui/Paper/Paper";
import { Properties } from "./Properties/Properties";
import { Members } from "./Members/Members";
import { Actions } from "./Actions/Actions";
import { Outlet } from "react-router-dom";

export function ChatInfo() {
  return (
    <>
      <Paper className="absolute top-0 left-0 md:relative h-full w-full md:w-fit flex flex-col bg-slate-50">
        <Title />
        <Properties />
        <Members />
        <Actions />
      </Paper>
      <Outlet />
    </>
  );
}

function Title() {
  const { handleCloseClick } = useInfo();

  return (
    <Paper
      padding={4}
      className="h-14 md:h-16 w-screen md:w-72 bg-slate-50 flex items-center justify-between"
    >
      <Text size="xl" font="thin" uppercase letterSpacing>
        Info
      </Text>
      <IconButton title="Close info" onClick={handleCloseClick}>
        <IconX className="text-slate-600" strokeWidth="1" size={32} />
      </IconButton>
    </Paper>
  );
}
