import { useNavigate } from "react-router-dom";
import { fetchLogout } from "../../shared/api/api";

export const HomeHeader = ({ username }: { username?: string }) => {
  const navigate = useNavigate();

  async function logoutHandler() {
    const { success } = await fetchLogout();
    if (success) navigate("/login", { state: { isLoggedOut: true } });
  }

  return (
    <div className="flex flex-row items-center justify-between px-4 py-2 text-slate-800 bg-slate-400 cursor-default select-none">
      <p className="text-2xl font-light tracking-widest uppercase ">
        Telescope
      </p>
      <div className="flex flex-col items-center">
        <p className="text-xs text-slate-600">Logged in as:</p>
        <p className="text-xs">{username}</p>
      </div>
      <button
        onClick={() => logoutHandler()}
        className="text-md p-1 font-light hover:text-black hover:bg-slate-300 rounded-lg cursor-pointer transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
};

function Notification() {}
