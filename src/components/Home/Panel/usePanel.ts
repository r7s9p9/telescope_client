import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../../constants";
import { useLang } from "../../../shared/features/LangProvider/LangProvider";

export function usePanel() {
  const { lang } = useLang();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function onClickHandler() {
    const profile = () => {
      navigate(`${routes.profile.pathPart}/self`, {
        state: { prevPath: pathname },
      });
    };

    const rooms = () => {
      navigate(routes.rooms.path, {
        state: { prevPath: pathname },
      });
    };

    const friends = () => {
      navigate(routes.friends.path, {
        state: { prevPath: pathname },
      });
    };

    const settings = () => {
      navigate(routes.settings.path, {
        state: { prevPath: pathname },
      });
    };

    return { profile, rooms, friends, settings };
  }

  return { onClickHandler, lang };
}
