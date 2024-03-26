import { Outlet } from "react-router-dom";
import { RoomList } from "../../room-list/room-list";

export function HomeMain() {
  return (
    <div className="w-full h-full flex flex-row bg-blue-100">
      <RoomList />
      <Outlet />
    </div>
  );
}
