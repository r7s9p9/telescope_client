import { useRouteLoaderData } from "react-router-dom";
import { AccountReadType } from "../shared/api/api.schema";
import { HomeHeader } from "../widgets/home/header/header";
import { routes } from "../constants";
import { HomeMain } from "../widgets/home/main/main";

export default function Home() {
  const { selfAccount } = useRouteLoaderData(routes.home.id) as {
    selfAccount: AccountReadType;
  };

  return (
    <div className="flex flex-col w-screen h-screen">
      <HomeHeader username={selfAccount.general?.username} />
      <HomeMain />
    </div>
  );
}
