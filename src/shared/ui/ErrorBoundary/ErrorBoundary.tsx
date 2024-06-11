import { Text } from "../../../shared/ui/Text/Text";
import { Paper } from "../../../shared/ui/Paper/Paper";

export function ErrorBoundary({
  size,
  className,
}: {
  size: "sm" | "md" | "xl";
  className?: string;
}) {
  return (
    <Paper
      padding={4}
      rounded={size}
      shadow={size}
      className={`${className || ""} m-4 bg-slate-50`}
    >
      <Text size={size} font="default">
        Something went wrong...
      </Text>
      <Text size={size} font="light" className="text-justify">
        Refresh the page, and if this does not help and the problem persists,
        write to us by email <b className="text-green-600">void@email.com</b>
      </Text>
    </Paper>
  );
}
