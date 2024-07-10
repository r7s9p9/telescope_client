import { useRouteError } from "react-router-dom";
import { ErrorBoundaryPopup } from "../../../../shared/ui/ErrorBoundaryPopup/ErrorBoundaryPopup";

export function ErrorLanguage() {
  const error = useRouteError();
  console.error(error);

  return <ErrorBoundaryPopup />;
}
