import { useRouteError } from "react-router-dom";
import { ErrorBoundary } from "../../../shared/ui/ErrorBoundary/ErrorBoundary";

export function ErrorInfo() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="h-full flex justify-center items-center bg-slate-50">
      <ErrorBoundary size="md" />
    </div>
  );
}
