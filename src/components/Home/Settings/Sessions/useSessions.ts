import { useEffect, useState } from "react";
import {
  useQueryDeleteSession,
  useQueryReadSessions,
} from "../../../../shared/api/api.model";
import { useNotify } from "../../../Notification/Notification";
import { langError, langSession } from "../../../../locales/en";
import { SessionReadResponseType } from "../../../../shared/api/api.schema";
import { useLocation, useNavigate } from "react-router-dom";

export function useSessions() {
  const notify = useNotify();
  const navigate = useNavigate();
  const location = useLocation();

  const queryRead = useQueryReadSessions();
  const queryDelete = useQueryDeleteSession();

  const [currentSession, setCurrentSession] =
    useState<SessionReadResponseType["sessionArr"][0]>();
  const [otherSessions, setOtherSessions] = useState<
    SessionReadResponseType["sessionArr"]
  >([]);

  const read = async () => {
    const { success, response, requestError, responseError } =
      await queryRead.run({});
    if (!success) {
      notify.show.error(
        requestError || responseError || langError.UNKNOWN_MESSAGE,
      );
      return;
    }

    const sessions = {
      current: {} as SessionReadResponseType["sessionArr"][0],
      other: [] as SessionReadResponseType["sessionArr"],
    };
    for (const session of response.sessionArr) {
      if (session.isCurrent) {
        sessions.current = session;
      } else {
        // setOtherSessions((prevState) => [...prevState, session]);
        sessions.other.push(session);
      }
    }
    setCurrentSession(sessions.current);
    setOtherSessions(sessions.other);
  };

  const remove = async (sessionId: string) => {
    const { success, response, requestError, responseError } =
      await queryDelete.run({ sessionId });
    if (!success) {
      notify.show.error(
        requestError || responseError || langError.UNKNOWN_MESSAGE,
      );
      return;
    }
    if (!response.success) {
      notify.show.error(langSession.SESSION_DELETE_FAIL);
    }
    notify.show.info(langSession.SESSION_DELETE_SUCCESS);
    read();
  };

  const returnBack = () => {
    if (!location.state?.prevPath) return;
    navigate(location.state?.prevPath);
  };

  useEffect(() => {
    read();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    currentSession,
    otherSessions,
    isLoaded: currentSession,
    remove,
    isFromAnotherPage: !!location.state?.prevPath,
    returnBack,
  };
}
