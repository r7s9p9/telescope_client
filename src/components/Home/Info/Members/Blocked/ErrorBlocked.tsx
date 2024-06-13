import { useRouteError } from "react-router-dom";
import { Overlay } from "../../../../../shared/ui/Overlay/Overlay";
import { ErrorBoundary } from "../../../../../shared/ui/ErrorBoundary/ErrorBoundary";

export function ErrorBlocked() {
  const error = useRouteError();
  console.error(error);

  return (
    <Overlay>
      <ErrorBoundary size="xl" />
    </Overlay>
  );
}
