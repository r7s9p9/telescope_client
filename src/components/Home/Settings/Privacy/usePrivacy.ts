import { useEffect, useState } from "react";
import {
  useQueryAccount,
  useQueryUpdateAccount,
} from "../../../../shared/api/api.model";
import { useNotify } from "../../../../shared/features/Notification/Notification";
import { langError, langProfile } from "../../../../locales/en";
import { useLocation, useNavigate } from "react-router-dom";
import { ReadAccountResponseType } from "../../../../shared/api/api.schema";

export function usePrivacy() {
  const location = useLocation();
  const navigate = useNavigate();
  const notify = useNotify();
  const queryRead = useQueryAccount();
  const queryUpdate = useQueryUpdateAccount();

  const [isLoaded, setIsLoaded] = useState(false);

  const [data, setData] = useState<ReadAccountResponseType["privacy"]>();

  const read = async () => {
    const { success, response, requestError, responseError } =
      await queryRead.run({
        userId: "self",
        toRead: {
          privacy: [
            "name",
            "bio",
            "lastSeen",
            "seeProfilePhotos",
            "inviteToRoom",
            "seeFriends",
          ],
        },
      });

    if (!success) {
      notify.show.error(
        requestError || responseError || langError.UNKNOWN_MESSAGE,
      );
      return;
    }

    if (response?.privacy) {
      setData(response?.privacy as typeof data);
    } else {
      notify.show.error(langError.UNKNOWN_MESSAGE);
    }
    setIsLoaded(true);
  };

  const handleUpdate = async () => {
    const { success, response, responseError } = await queryUpdate.run({
      toUpdate: { privacy: data },
    });

    if (!success) {
      notify.show.error(responseError || langError.UNKNOWN_MESSAGE);
      return;
    }

    if (response?.privacy?.success) {
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
    setData,
    handleUpdate,
    isFromAnotherPage: !!location.state?.prevPath,
    returnBack,
    isLoaded,
    isUploading: queryUpdate.isLoading,
  };
}
