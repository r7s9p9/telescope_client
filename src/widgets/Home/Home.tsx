import { Outlet } from "react-router-dom";
import { NotifyStack } from "../Notification/Notification";
import { PopupStack } from "../Popup/Popup";
import { LeftPanel } from "./LeftPanel/LeftPanel";

export function Home() {
  return (
    <div className="w-full h-full flex bg-slate-200">
      <NotifyStack />
      <PopupStack />
      <LeftPanel />
      <Outlet />
    </div>
  );
}
