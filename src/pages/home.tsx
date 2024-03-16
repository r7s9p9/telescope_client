import { Outlet, useRouteLoaderData } from "react-router-dom";
import { RoomList } from "../widgets/room-list/room-list";
import { AccountReadType } from "../shared/api/api.schema";
import { HomeHeader } from "../widgets/room-list/homeHeader";

export default function Home() {
  const { selfAccount } = useRouteLoaderData("home") as {
    selfAccount: AccountReadType;
  };

  return (
    <div className="flex flex-col w-screen h-screen">
      <HomeHeader username={selfAccount.general?.username} />
      <div className="h-full flex flex-row bg-slate-300 m-2 rounded-xl">
        <RoomList />

        <Outlet />
      </div>
    </div>
  );
}
