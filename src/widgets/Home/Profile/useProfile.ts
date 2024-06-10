import { useEffect, useState } from "react";
import {
  useQueryAccount,
  useQueryUpdateAccount,
} from "../../../shared/api/api";
import { useNotify } from "../../Notification/Notification";
import {
  bioSchema,
  nameSchema,
  usernameSchema,
} from "../../../shared/api/api.schema";
import { env } from "../../../shared/lib/env";

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
    const result = await queryRead.run("self");
    if (!result.success)
      notify.show.error(
        "Invalid response from the server. Please try again later",
      );
    setData(result.data?.general as typeof data);
  };

  const schemaValidator = () => {
    const username = usernameSchema.safeParse(data.username);
    if (!username.success) {
      setError((prevError) => ({
        ...prevError,
        username: `The username must be at least ${env.usernameRange.min} and no more than ${env.usernameRange.max} characters`,
      }));
    } else {
      setError((prevError) => ({
        ...prevError,
        username: "",
      }));
    }
    const name = nameSchema.safeParse(data.name);
    if (!name.success) {
      setError((prevError) => ({
        ...prevError,
        name: `The name must be no more than ${env.nameLengthMax} characters`,
      }));
    } else {
      setError((prevError) => ({
        ...prevError,
        name: "",
      }));
    }
    const bio = bioSchema.safeParse(data.bio);
    if (!bio.success) {
      setError((prevError) => ({
        ...prevError,
        bio: `The bio must be no more than ${env.bioLengthMax} characters`,
      }));
    } else {
      setError((prevError) => ({
        ...prevError,
        nambioe: "",
      }));
    }
    if (!username.success || !name.success || !bio.success) return false;
    return true;
  };

  const setUsername = (username: string) => {
    setData((prevData) => ({ ...prevData, username }));
  };
  const setName = (name: string) => {
    setData((prevData) => ({ ...prevData, name }));
  };
  const setBio = (bio: string) => {
    setData((prevData) => ({ ...prevData, bio }));
  };

  const handleUpdate = async () => {
    const validation = schemaValidator();
    if (!validation) return;
    const result = await queryUpdate.run(data);
    if (!result.success) {
      notify.show.error(
        "Invalid response from the server. Please try again later",
      );
    } else {
      notify.show.info("Profile information updated successfully");
      read();
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
