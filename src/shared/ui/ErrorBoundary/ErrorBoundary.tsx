import { IconRefresh } from "@tabler/icons-react";
import { Text } from "../../../shared/ui/Text/Text";
import { IconButton } from "../IconButton/IconButton";
import { Paper } from "../Paper/Paper";
import { useLang } from "../../features/LangProvider/LangProvider";

export function ErrorBoundary({ className }: { className?: string }) {
  const { lang } = useLang();

  const iconProps = {
    className: "text-slate-600",
    strokeWidth: "1",
    size: 32,
  };

  return (
    <Paper
      padding={4}
      rounded="xl"
      className={`md:max-w-[600px] m-4 shadow-md border-2 border-red-400 bg-slate-50 ${className || ""}`}
    >
      <div className="shrink-0 flex items-center gap-2">
        <Text
          size="xl"
          font="thin"
          uppercase
          letterSpacing
          className="select-none grow"
        >
          {lang.errorBoundary.TITLE}
        </Text>
        <IconButton title="Refresh" onClick={() => window.location.reload()}>
          <IconRefresh {...iconProps} />
        </IconButton>
      </div>
      <div className="w-full my-2 border-2 border-slate-100" />
      <Text size="md" font="light">
        {lang.errorBoundary.MESSAGE}&nbsp;
        <b className="text-green-600">void@email.com</b>
      </Text>
    </Paper>
  );
}
