import { NotifyStack } from "../widgets/notification/notification";
import { RoomList } from "../widgets/home/room-list/room-list";
import { IconSearch } from "@tabler/icons-react";
import { Chat } from "../widgets/home/chat/chat";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-row bg-slate-50">
      <NotifyStack />
      {/* <HomeHeader /> */}
      <LeftPanel />
      <Chat />
    </div>
  );
}

function LeftPanel() {
  return (
    <div className="h-full flex flex-col w-1/2 min-w-52 max-w-xs border-r-2 border-slate-400">
      <RoomList />
      <Search />
    </div>
  );
}

function Search() {
  return (
    <div className="relative shrink-0 h-16 w-full flex items-center">
      <input
        placeholder="Search rooms..."
        className="h-full w-full pl-4 pr-16 outline-none font-light text-gray-800 text-xl bg-slate-100 border-t-2 border-slate-200 focus:bg-slate-50 focus:border-slate-400 duration-300 ease-in-out"
      ></input>
      <Button />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute right-4 flex items-center">
      <button className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 duration-300 ease-in-out">
        <IconSearch className="text-slate-400" size={24} />
      </button>
    </div>
  );
}
