import { Text } from "../../shared/ui/Text/Text";
import { Paper } from "../../shared/ui/Paper/Paper";
import { Link } from "react-router-dom";
import { routes } from "../../constants";
import { langNoMatch } from "../../locales/en";

export function NoMatch() {
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
          {langNoMatch.TITLE}
        </Text>
        <div className="w-full my-2 border-2 border-slate-100" />
        <Text size="md" font="light">
          {langNoMatch.SUBTITLE}
        </Text>
        <div className="flex">
          <Text size="md" font="light">
            {langNoMatch.MESSAGE_HEAD}&nbsp;
          </Text>
          <Link to={routes.home.path}>
            <Text
              size="md"
              font="light"
              className="underline cursor-pointer text-blue-600"
            >
              {langNoMatch.MESSAGE_TAIL}
            </Text>
          </Link>
        </div>
      </Paper>
    </div>
  );
}
