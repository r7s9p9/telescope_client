import { useRouteError } from "react-router-dom";
import { Text } from "../../../shared/ui/Text/Text";
import { Paper } from "../../../shared/ui/Paper/Paper";
import { IconAlertCircle } from "@tabler/icons-react";

export function ErrorRooms() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="h-full flex flex-col justify-center w-1/2 min-w-64 max-w-sm bg-slate-50">
      <Paper padding={4} className="flex flex-col items-center bg-slate-50">
        <div className="w-full flex justify-between items-center mb-4">
          <IconAlertCircle
            className="text-red-600"
            strokeWidth="1.5"
            size={24}
          />
          <Text size="md" font="default">
            Oops, something went wrong...
          </Text>
          <IconAlertCircle
            className="text-red-600"
            strokeWidth="1.5"
            size={24}
          />
        </div>

        <Text size="md" font="light" className="text-justify">
          Refresh the page, and if this does not help and the problem persists,
          write to us by email -{" "}
          <b className="text-green-600">void@email.com</b>
        </Text>
      </Paper>
    </div>
  );
}
