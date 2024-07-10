import { Text } from "../../shared/ui/Text/Text";
import { Paper } from "../../shared/ui/Paper/Paper";
import { Link } from "react-router-dom";
import { routes } from "../../constants";
import { useLang } from "../../shared/features/LangProvider/LangProvider";

export function NoMatch() {
  const { lang } = useLang();

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-200">
      <Paper
        padding={4}
        rounded="xl"
        className="flex flex-col m-4 shadow-md border-2 border-slate-400 bg-slate-50 "
      >
        <Text
          size="xl"
          font="thin"
          uppercase
          letterSpacing
          className="select-none"
        >
          {lang.noMatch.TITLE}
        </Text>
        <div className="w-full my-2 border-2 border-slate-100" />
        <Text size="md" font="light">
          {lang.noMatch.SUBTITLE}
        </Text>
        <Text size="md" font="light">
          {lang.noMatch.MESSAGE_HEAD}&nbsp;
          <Link
            to={routes.home.path}
            className="underline cursor-pointer text-blue-600"
          >
            {lang.noMatch.MESSAGE_TAIL}
          </Link>
        </Text>
      </Paper>
    </div>
  );
}
