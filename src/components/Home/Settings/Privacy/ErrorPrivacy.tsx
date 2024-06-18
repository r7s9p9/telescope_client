import { useRouteError } from "react-router-dom";
import { ErrorBoundary } from "../../../../shared/ui/ErrorBoundary/ErrorBoundary";

export function ErrorPrivacy() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <ErrorBoundary size="md" />
    </div>
  );
}
