import { Text } from "../../shared/ui/Text/Text";
import { Paper } from "../../shared/ui/Paper/Paper";
import { Link } from "react-router-dom";
import { routes } from "../../constants";

export function NoMatch() {
  return (
    <div className="w-full h-full flex justify-center items-center bg-slate-200">
      <Paper
        padding={4}
        rounded="xl"
        shadow="xl"
        className="w-1/2 min-w-[650px] max-w-[900px]"
      >
        <Text size="xl" font="default" className="mb-4 text-center">
          Error 404 - apparently this page does not exist...
        </Text>
        <div className="flex justify-center">
          <Text size="xl" font="light" className="text-center">
            However, you can always go&nbsp;
          </Text>
          <Link to={routes.home.path}>
            <Text
              size="xl"
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
