import { useRouteError } from "react-router-dom";
import { ErrorBoundary } from "../../../shared/ui/ErrorBoundary/ErrorBoundary";

export function ErrorRooms() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="h-full flex justify-center items-center md:items-start md:w-1/2 md:min-w-64 md:max-w-sm md:bg-slate-50">
      <ErrorBoundary />
    </div>
  );
}
