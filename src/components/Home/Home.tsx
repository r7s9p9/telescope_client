import { Outlet } from "react-router-dom";
import { NotifyStack } from "../Notification/Notification";
import { PopupStack } from "../Popup/Popup";
import { Panel } from "./Panel/Panel";
import { useHome } from "./useHome";

export function Home() {
  useHome();

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-slate-200">
      <NotifyStack />
      <PopupStack />
      <Panel />
      <Outlet />
    </div>
  );
}
