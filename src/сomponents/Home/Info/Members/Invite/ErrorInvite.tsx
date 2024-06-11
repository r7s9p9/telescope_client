import { useRouteError } from "react-router-dom";
import { Text } from "../../../../../shared/ui/Text/Text";
import { Paper } from "../../../../../shared/ui/Paper/Paper";
import { IconAlertCircle } from "@tabler/icons-react";
import { Overlay } from "../../../../../shared/ui/Overlay/Overlay";

export function ErrorInvite() {
  const error = useRouteError();
  console.error(error);

  return (
    <Overlay>
      <Paper
        padding={4}
        rounded="xl"
        shadow="xl"
        className="min-w-[550px] max-w-[900px]"
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
    </Overlay>
  );
}
