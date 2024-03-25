import { useNavigate } from "react-router-dom";
import { fetchLogout } from "../../../shared/api/api";
import { Notification } from "../../notification/notification";
import { NotificationState } from "../../notification/types";
import { useState } from "react";
import { routes } from "../../../constants";

export const HomeHeader = ({ username }: { username?: string }) => {
  const [notification, setNotification] = useState<
    NotificationState["notification"]
  >({ isShow: false, type: "info", text: "" });
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
    <div className="relative w-full flex justify-center items-center">
      <Notification
        notification={notification}
        setNotification={setNotification}
      />
      <div className="w-full flex flex-row items-center justify-between px-4 py-2 text-slate-800 bg-slate-400 cursor-default select-none">
        <p className="text-2xl font-light tracking-widest uppercase ">
          Telescope
        </p>
        <div className="flex flex-col items-center">
          <p className="text-md font-light">Logged in as:</p>
          <p className="text-xs">{username}</p>
        </div>
        <button
          onClick={() => logoutHandler()}
          className="text-lg p-1 font-light hover:text-black hover:bg-slate-300 rounded-lg cursor-pointer transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
