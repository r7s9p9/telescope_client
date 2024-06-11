import { useRouteError } from "react-router-dom";
import { Text } from "../../../shared/ui/Text/Text";
import { Paper } from "../../../shared/ui/Paper/Paper";
import { IconAlertCircle } from "@tabler/icons-react";

export function ErrorProfile() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="w-full h-full flex justify-center items-center bg-slate-200">
      <Paper
        padding={4}
        rounded="xl"
        shadow="xl"
        className="w-3/4 min-w-[350px] max-w-[650px] flex flex-col bg-slate-50"
      >
        <div className="flex justify-between items-center mb-4">
          <IconAlertCircle
            className="text-red-600"
            strokeWidth="1.5"
            size={32}
          />
          <Text size="xl" font="default">
            Oops, something went wrong...
          </Text>
          <IconAlertCircle
            className="text-red-600"
            strokeWidth="1.5"
            size={32}
          />
        </div>

        <Text size="xl" font="light" className="text-justify">
          Refresh the page, and if this does not help and the problem persists,
          write to us by email -{" "}
          <b className="text-green-600">void@email.com</b>
        </Text>
      </Paper>
    </div>
  );
}
