import { useEffect } from "react";
import { fetchSelfAccount } from "../shared/api/api";
import { HomeHeader } from "../widgets/home/header/header";
import { HomeMain } from "../widgets/home/main/main";
import { useNavigate } from "react-router-dom";
import { NotifyStack, useNotify } from "../widgets/notification/notification";
import { routes } from "../constants";

export default function Home() {
  const navigate = useNavigate();
  const notify = useNotify();

  // const [account, setAccount] = useState({

  // })

  // useEffect(() => {
  //   async function fetch() {
  //     const account = await fetchSelfAccount();
  //     if (!account.success) notify.show.error("Server Error");
  //     if (account.success) notify.show.info("Good");
  //     if (!account.isLogged) navigate(routes.login.path)
  //   }

  //   fetch();
  // }, []);

  return (
    <div className="w-screen h-screen bg-slate-50">
      <NotifyStack />
      <HomeHeader />
      <HomeMain />
    </div>
  );
}
