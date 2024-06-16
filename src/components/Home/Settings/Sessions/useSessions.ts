import { useEffect, useState } from "react";
import { useQueryReadSessions } from "../../../../shared/api/api.model";
import { useNotify } from "../../../Notification/Notification";
import { langError } from "../../../../locales/en";
import { SessionReadResponseType } from "../../../../shared/api/api.schema";

export function useSessions() {
  const notify = useNotify();

  const queryRead = useQueryReadSessions();

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

  useEffect(() => {
    read();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { currentSession, otherSessions, isLoaded: currentSession };
}
