import { useRouteError } from "react-router-dom";
import { ErrorBoundary } from "../../shared/ui/ErrorBoundary/ErrorBoundary";

export function ErrorHome() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="w-full h-full flex justify-center items-center bg-slate-200">
      <ErrorBoundary size="xl" />
    </div>
  );
}
