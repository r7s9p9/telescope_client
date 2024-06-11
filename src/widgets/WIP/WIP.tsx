import { IconAlertTriangle } from "@tabler/icons-react";
import { Paper } from "../../shared/ui/Paper/Paper";
import { Text } from "../../shared/ui/Text/Text";

export function WIP() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Paper
        padding={4}
        rounded="xl"
        shadow="xl"
        className="flex gap-2 items-center"
      >
        <IconAlertTriangle
          className="text-red-600"
          strokeWidth="1.5"
          size={32}
        />
        <Text size="xl" font="light">
          This content is still in development
        </Text>
        <IconAlertTriangle
          className="text-red-600"
          strokeWidth="1.5"
          size={32}
        />
      </Paper>
    </div>
  );
}
