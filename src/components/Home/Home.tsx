import { Outlet } from "react-router-dom";
import { NotifyStack } from "../Notification/Notification";
import { PopupStack } from "../ConfirmPopup/ConfirmPopup";
import { Panel } from "./Panel/Panel";
import { useHome } from "./useHome";

export function Home() {
  useHome();

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-slate-200">
      <NotifyStack />
      <PopupStack />
      <Panel />
      <Outlet />
    </div>
  );
}
