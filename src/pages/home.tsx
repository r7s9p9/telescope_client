import { HomeHeader } from "../widgets/home/header/header";
import { HomeMain } from "../widgets/home/main/main";
import { NotifyStack } from "../widgets/notification/notification";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col bg-slate-50">
      <NotifyStack />
      <HomeHeader />
      <HomeMain />
    </div>
  );
}
