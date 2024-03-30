import { HomeHeader } from "../widgets/home/header/header";
import { NotifyStack } from "../widgets/notification/notification";
import { RoomList } from "../widgets/home/room-list/room-list";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col bg-slate-50">
      <NotifyStack />
      <HomeHeader />
      <RoomList />
    </div>
  );
}
