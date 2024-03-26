import { HomeHeader } from "../widgets/home/header/header";
import { HomeMain } from "../widgets/home/main/main";

export default function Home() {
  return (
    <div className="flex flex-col w-screen h-screen bg-blue-100">
      <HomeHeader />
      <HomeMain />
    </div>
  );
}
