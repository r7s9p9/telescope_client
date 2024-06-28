import { useRouteError } from "react-router-dom";
import { ErrorBoundaryPopup } from "../../../../../shared/ui/ErrorBoundaryPopup/ErrorBoundaryPopup";

export function ErrorInvite() {
  const error = useRouteError();
  console.error(error);

  return <ErrorBoundaryPopup />;
}
