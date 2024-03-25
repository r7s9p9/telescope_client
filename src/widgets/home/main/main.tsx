import { Outlet } from "react-router-dom";
import { RoomList } from "../../room-list/room-list";

export function HomeMain() {
  return (
    <div className="h-full flex flex-row bg-slate-300 m-2 rounded-xl">
      <RoomList />
      <Outlet />
    </div>
  );
}
