import { useEffect, useState } from "react";
import {
  useQueryAccount,
  useQueryUpdateAccount,
} from "../../../shared/api/api.model";
import { useNotify } from "../../Notification/Notification";
import { langError, langProfile } from "../../../locales/en";

export function useProfile() {
  const notify = useNotify();
  const queryRead = useQueryAccount();
  const queryUpdate = useQueryUpdateAccount();

  const [data, setData] = useState({
    username: "",
    name: "",
    bio: "",
  });

  const [error, setError] = useState({
    username: "",
    name: "",
    bio: "",
  });

  const read = async () => {
    const { success, response, requestError, responseError } =
      await queryRead.run({
        userId: "self",
        toRead: { general: ["username", "name", "bio"] },
      });

    if (!success && requestError) {
      notify.show.error(requestError);
      return;
    }
    if (!success && responseError) {
      notify.show.error(responseError);
      return;
    }

    if (!success) {
      notify.show.error(langError.UNKNOWN_MESSAGE);
    }

    setData(response?.general as typeof data);
  };

  const setUsername = (username: string) => {
    setData((prevData) => ({ ...prevData, username, error: "" }));
  };
  const setName = (name: string) => {
    setData((prevData) => ({ ...prevData, name, error: "" }));
  };
  const setBio = (bio: string) => {
    setData((prevData) => ({ ...prevData, bio, error: "" }));
  };

  const handleUpdate = async () => {
    const { success, response, requestError, responseError } =
      await queryUpdate.run({
        toUpdate: { general: data },
      });

    if (!success && requestError) {
      setError({
        username: requestError.username || "",
        name: requestError.name || "",
        bio: requestError.bio || "",
      });
      return;
    }
    if (!success && responseError) {
      notify.show.error(responseError);
      return;
    }

    if (!success) {
      notify.show.error(langError.UNKNOWN_MESSAGE);
      return;
    }

    if (response?.general?.success) {
      notify.show.info(langProfile.SUCCESS);
      read();
    } else {
      notify.show.error(langError.RESPONSE_COMMON_MESSAGE);
    }
  };

  useEffect(() => {
    read();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    error,
    setName,
    setUsername,
    setBio,
    handleUpdate,
    isLoading: queryRead.isLoading || queryUpdate.isLoading,
  };
}
