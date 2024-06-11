import { useRouteError } from "react-router-dom";
import { ErrorBoundary } from "../../../shared/ui/ErrorBoundary/ErrorBoundary";

export function ErrorRooms() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="h-full flex flex-col w-1/2 min-w-64 max-w-sm bg-slate-50">
      <ErrorBoundary size="md" />
    </div>
  );
}
