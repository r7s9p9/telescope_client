import { useEffect, useState } from "react";
import {
  useQueryAccount,
  useQueryUpdateAccount,
} from "../../../shared/api/api.model";
import { useNotify } from "../../Notification/Notification";
import { langError, langProfile } from "../../../locales/en";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { checkUserId } from "../../../shared/lib/uuid";

export function useProfile() {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const notify = useNotify();
  const queryRead = useQueryAccount();
  const queryUpdate = useQueryUpdateAccount();

  const [isLoaded, setIsLoaded] = useState(false);

  const [data, setData] = useState({
    username: "",
    name: "",
    bio: "",
    isExist: false,
  });

  const [error, setError] = useState({
    username: "",
    name: "",
    bio: "",
  });

  const read = async () => {
    // Checking the validity of the request
    if (userId !== "self" && !checkUserId(userId)) {
      notify.show.error(langProfile.INCORRECT_USERID);
      setIsLoaded(true);
      return;
    }

    const { response, requestError, responseError } = await queryRead.run({
      userId,
      toRead: { general: ["username", "name", "bio"] },
    });

    if (requestError || responseError) {
      notify.show.error(
        requestError || responseError || langProfile.INCORRECT_USERID,
      );
      return;
    }

    if (response?.general?.username) {
      setData(response?.general as typeof data);
      setData((prevData) => ({ ...prevData, isExist: true }));
    } else {
      setData((prevData) => ({ ...prevData, isExist: false }));
    }
    setIsLoaded(true);
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
    isExist: data.isExist,
    isYourProfile: userId === "self",
    isFromAnotherPage: !!location.state?.prevPath,
    returnBack,
    isLoaded,
    isUploading: queryUpdate.isLoading,
  };
}
