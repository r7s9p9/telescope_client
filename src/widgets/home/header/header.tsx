import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { fetchLogout } from "../../../shared/api/api";
import { routes } from "../../../constants";
import { AccountReadType } from "../../../shared/api/api.schema";

export const HomeHeader = () => {
  const { selfAccount } = useRouteLoaderData(routes.home.id) as {
    selfAccount: AccountReadType;
  };

  const navigate = useNavigate();

  async function logoutHandler() {
    const { success } = await fetchLogout();
    if (success) {
      navigate(
        { pathname: routes.login.path },
        { state: { isLoggedOut: true } },
      );
    }
  }

  return (
    <div className="relative w-full flex justify-center items-center border-b-2 border-slate-400 bg-slate-200">
      <div className="w-full flex flex-row items-center justify-between px-4 py-2 cursor-default select-none">
        <p className="text-xl font-light tracking-widest uppercase ">
          Telescope
        </p>
        <div className="flex flex-col items-center font-light">
          <p className="text-xs ">Logged in as:</p>
          <p className="text-xs">{selfAccount.general?.username}</p>
        </div>
        <button
          onClick={() => logoutHandler()}
          className="text-md p-1 font-light hover:text-black hover:bg-slate-300 rounded-lg cursor-pointer transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
