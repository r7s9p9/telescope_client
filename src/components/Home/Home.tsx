import { Outlet } from "react-router-dom";
import { NotifyStack } from "../../shared/features/Notification/Notification";
import { PopupStack } from "../../shared/features/ConfirmPopup/ConfirmPopup";
import { Panel } from "./Panel/Panel";
import { useHome } from "./useHome";
import { ContextMenuStack } from "../../shared/features/ContextMenu/ContextMenu";

export function Home() {
  useHome();

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-slate-200">
      <NotifyStack />
      <PopupStack />
      <ContextMenuStack />
      <Panel />
      <Outlet />
    </div>
  );
}
