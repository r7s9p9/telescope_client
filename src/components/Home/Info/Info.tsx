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
      <Paper className="flex flex-col border-l-2 border-slate-100 bg-slate-50">
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
      className="h-16 w-96 bg-slate-50 flex items-center justify-between border-slate-100"
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
