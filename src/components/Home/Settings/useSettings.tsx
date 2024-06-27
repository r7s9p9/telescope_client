import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../../constants";
import { useQueryDeleteSession } from "../../../shared/api/api.model";
import { useNotify } from "../../Notification/Notification";
import { langError, langSession } from "../../../locales/en";

export function useSettings() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const notify = useNotify();

  const queryLogout = useQueryDeleteSession();

  function onClickHandler() {
    const profile = () => {
      navigate(`${routes.profile.pathPart}/self`, {
        state: { prevPath: pathname },
      });
    };
    const privacy = () => {
      navigate(`${pathname}/privacy`, {
        state: { prevPath: pathname },
      });
    };
    const sessions = () => {
      navigate(`${pathname}/sessions`, {
        state: { prevPath: pathname },
      });
    };
    const logout = async () => {
      const { success, response, requestError, responseError } =
        await queryLogout.run({ sessionId: "self" });
      if (!success) {
        notify.show.error(
          requestError || responseError || langError.UNKNOWN_MESSAGE,
        );
        return;
      }

      if (!response.success) {
        if (!response.isExist) {
          // This is of course impossible case, but it is worth considering
          navigate(routes.login.path, { state: { loggedOut: true } });
          return;
        }
        notify.show.error(langSession.SESSION_DELETE_FAIL);
        return;
      }

      navigate(routes.login.path, { state: { loggedOut: true } });
    };

    return { profile, privacy, sessions, logout };
  }

  return { onClickHandler };
}
