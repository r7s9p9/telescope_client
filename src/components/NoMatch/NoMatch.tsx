import { Text } from "../../shared/ui/Text/Text";
import { Paper } from "../../shared/ui/Paper/Paper";
import { Link } from "react-router-dom";
import { routes } from "../../constants";

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
          Error 404
        </Text>
        <div className="w-full my-2 border-2 border-slate-100" />
        <Text size="md" font="light">
          Apparently this page does not exist
        </Text>
        <div className="flex">
          <Text size="md" font="light">
            However, you can always go&nbsp;
          </Text>
          <Link to={routes.home.path}>
            <Text
              size="md"
              font="light"
              className="underline cursor-pointer text-blue-600"
            >
              home
            </Text>
          </Link>
        </div>
      </Paper>
    </div>
  );
}
