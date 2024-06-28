import { useRouteError } from "react-router-dom";
import { ErrorBoundary } from "../../shared/ui/ErrorBoundary/ErrorBoundary";

export function ErrorAuth() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-200">
      <ErrorBoundary />
    </div>
  );
}
