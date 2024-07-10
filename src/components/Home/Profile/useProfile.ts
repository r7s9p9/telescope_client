import { useEffect, useState } from "react";
import {
  useQueryAccount,
  useQueryUpdateAccount,
} from "../../../shared/api/api.model";
import { useNotify } from "../../../shared/features/Notification/Notification";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { checkUserId } from "../../../shared/lib/uuid";
import { useLang } from "../../../shared/features/LangProvider/LangProvider";

export function useProfile() {
  const { lang } = useLang();
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
      notify.show.error(lang.profileNotification.INCORRECT_USERID);
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
          lang.profileNotification.INCORRECT_USERID,
      );
      return;
    }

    if (response?.general?.username) {
      setData({
        username: response.general.username,
        name: response.general?.name || lang.profile.INFO_HIDDEN,
        bio: response.general?.bio || lang.profile.INFO_HIDDEN,
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

      notify.show.error(responseError || lang.error.UNKNOWN_MESSAGE);
      return;
    }

    if (response?.general?.success) {
      notify.show.info(lang.profileNotification.SUCCESS);
      read();
    } else {
      notify.show.error(lang.error.RESPONSE_COMMON_MESSAGE);
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
    lang,
  };
}
