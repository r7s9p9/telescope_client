import { useEffect, useState } from "react";
import {
  useQueryAccount,
  useQueryUpdateAccount,
} from "../../../shared/api/api.model";
import { useNotify } from "../../../shared/features/Notification/Notification";
import {
  langError,
  langProfile,
  langProfileNotification,
} from "../../../locales/en";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { checkUserId } from "../../../shared/lib/uuid";

export function useProfile() {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const notify = useNotify();
  const queryRead = useQueryAccount();
  const queryUpdate = useQueryUpdateAccount();

  const [data, setData] = useState({
    username: "",
    name: "",
    bio: "",
    isLoaded: false,
    isExist: false,
    isYourProfile: false,
  });

  const [error, setError] = useState({
    username: "",
    name: "",
    bio: "",
  });

  const read = async () => {
    if (userId !== "self" && !checkUserId(userId)) {
      notify.show.error(langProfileNotification.INCORRECT_USERID);
      setData((prevData) => ({ ...prevData, isLoaded: true }));
      return;
    }

    const { response, requestError, responseError } = await queryRead.run({
      userId,
      toRead: { general: ["username", "name", "bio"] },
    });

    if (requestError || responseError) {
      notify.show.error(
        requestError ||
          responseError ||
          langProfileNotification.INCORRECT_USERID,
      );
      return;
    }

    if (response?.general?.username) {
      setData({
        username: response.general.username,
        name: response.general?.name || langProfile.INFO_HIDDEN,
        bio: response.general?.bio || langProfile.INFO_HIDDEN,
        isLoaded: true,
        isExist: true,
        isYourProfile: response.targetUserId === "self",
      });
    } else {
      setData((prevData) => ({ ...prevData, isLoaded: true, isExist: false }));
    }
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

    if (!success) {
      if (requestError) {
        setError({
          username: requestError.username || "",
          name: requestError.name || "",
          bio: requestError.bio || "",
        });
        return;
      }

      notify.show.error(responseError || langError.UNKNOWN_MESSAGE);
      return;
    }

    if (response?.general?.success) {
      notify.show.info(langProfileNotification.SUCCESS);
      read();
    } else {
      notify.show.error(langError.RESPONSE_COMMON_MESSAGE);
    }
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
    data,
    error,
    setName,
    setUsername,
    setBio,
    handleUpdate,
    isFromAnotherPage: !!location.state?.prevPath,
    returnBack,
    isLoaded: data.isLoaded,
    isUploading: queryUpdate.isLoading,
  };
}
