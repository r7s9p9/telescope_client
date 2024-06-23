import { IconAlertTriangle } from "@tabler/icons-react";
import { Paper } from "../../shared/ui/Paper/Paper";
import { Text } from "../../shared/ui/Text/Text";

export function WIP() {
  return (
    <div className="p-4 w-full h-full flex items-center justify-center">
      <Paper
        padding={4}
        rounded="xl"
        shadow="xl"
        className="flex flex-col md:flex-row justify-center gap-4 items-center"
      >
        <IconAlertTriangle
          className="text-red-600"
          strokeWidth="1.5"
          size={32}
        />
        <Text size="xl" font="light" className="text-center">
          This content is still in development
        </Text>
        <IconAlertTriangle
          className="text-red-600 hidden md:block"
          strokeWidth="1.5"
          size={32}
        />
      </Paper>
    </div>
  );
}
