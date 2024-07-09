import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../../constants";
import { useQueryDeleteSession } from "../../../shared/api/api.model";
import { useNotify } from "../../../shared/features/Notification/Notification";
import { langError } from "../../../locales/en";

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
        notify.show.error(langError.RESPONSE_COMMON_MESSAGE);
        return;
      }

      navigate(routes.login.path, { state: { loggedOut: true } });
    };

    return { profile, privacy, sessions, logout };
  }

  return { onClickHandler };
}
