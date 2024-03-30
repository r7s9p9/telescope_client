import { useNavigate } from "react-router-dom";
import { useQueryLogout, useQuerySelfAccount } from "../../../shared/api/api";
import { routes } from "../../../constants";
import { AccountReadType } from "../../../shared/api/api.schema";
import { useEffect, useState } from "react";
import { useNotify } from "../../notification/notification";
import { Spinner } from "../../auth-container/auth-container";

export const HomeHeader = () => {
  const [selfAccount, setSelfAccount] = useState<AccountReadType>();

  const query = useQuerySelfAccount();
  const queryLogout = useQueryLogout();

  const notify = useNotify();
  const navigate = useNavigate();

  useEffect(() => {
    const action = async () => {
      const { success, data } = await query.run();
      if (!success) notify.show.error("ACCOUNT NO SUCCESS");
      if (success) setSelfAccount(data);
    };
    action();
  }, []);

  async function logoutHandler() {
    const { success } = await queryLogout.run("self");
    if (success) {
      navigate(
        { pathname: routes.login.path },
        { state: { isLoggedOut: true } },
      );
    }
    if (!success) notify.show.error("LOGOUT NO SUCCESS");
  }

  return (
    <div className="w-full flex flex-row items-center justify-between px-2 py-1 border-b-2 border-slate-400 cursor-default select-none">
      <p className="text-xl font-light tracking-widest uppercase ">Telescope</p>
      <div className="flex flex-col items-center font-light">
        {query.isLoading ? (
          <Spinner size={4} />
        ) : (
          <>
            <p className="text-xs ">Logged in as:</p>
            <p className="text-xs">{selfAccount?.general?.username}</p>
          </>
        )}
      </div>
      <button
        disabled={queryLogout.isLoading}
        onClick={() => logoutHandler()}
        className="text-md p-1 font-light hover:text-black hover:bg-slate-300 rounded-lg cursor-pointer transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
};
