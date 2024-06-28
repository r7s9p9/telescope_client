import { useRouteError } from "react-router-dom";
import { ErrorBoundary } from "../../../shared/ui/ErrorBoundary/ErrorBoundary";
import { ErrorBoundaryPopup } from "../../../shared/ui/ErrorBoundaryPopup/ErrorBoundaryPopup";

export function ErrorChat() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <div className="w-full h-full flex justify-center items-center bg-slate-200">
        <ErrorBoundary />
      </div>
      {/* Since on a small screen the main component
      is shown in full screen, this crutch is needed */}
      <div className="visible md:invisible">
        <ErrorBoundaryPopup />
      </div>
    </>
  );
}
