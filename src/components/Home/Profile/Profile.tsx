import {
  IconArrowBackUp,
  IconUpload,
  IconUserCancel,
} from "@tabler/icons-react";
import { Button } from "../../../shared/ui/Button/Button";
import { InputField } from "../../../shared/ui/InputField/InputField";
import { Paper } from "../../../shared/ui/Paper/Paper";
import { Text } from "../../../shared/ui/Text/Text";
import { TextAreaField } from "../../../shared/ui/TextAreaField/TextAreaField";
import { Spinner } from "../../../shared/ui/Spinner/Spinner";
import { useProfile } from "./useProfile";
import { ReactNode } from "react";

export function Profile() {
  const {
    data,
    error,
    setName,
    setUsername,
    setBio,
    isLoaded,
    isUploading,
    handleUpdate,
    isExist,
    isYourProfile,
    isFromAnotherPage,
    returnBack,
  } = useProfile();

  if (!isLoaded) {
    return <Loader />;
  }

  let title = " ";
  if (isYourProfile) {
    title = "Your profile";
  } else if (isExist) {
    title = `@${data.username} profile`;
  } else {
    title = "This profile does not exist or this account has been deleted...";
  }

  return (
    <Wrapper>
      <Paper
        padding={4}
        rounded="xl"
        shadow="xl"
        className="w-full h-full flex flex-col bg-slate-50"
      >
        <div className="flex justify-between items-center">
          <Text size="xl" font="light" className="select-none text-center">
            {title}
          </Text>
          {isUploading && <Spinner size={32} />}
        </div>
        {isExist && (
          <div className="flex flex-col h-full justify-center">
            {isYourProfile && (
              <InputField
                label="Username"
                size="md"
                value={data.username}
                error={error.username}
                setValue={setUsername}
                disabled={isUploading}
                className={`${isUploading ? "animate-pulse" : ""}`}
              />
            )}
            <InputField
              label="Name"
              size="md"
              value={data.name}
              error={error.name}
              setValue={setName}
              disabled={isUploading || !isYourProfile}
              unstyled={!isYourProfile}
              className={`${isUploading ? "animate-pulse" : ""}`}
            />
            <TextAreaField
              maxRows={6}
              label="Bio"
              size="md"
              value={data.bio}
              error={error.bio}
              setValue={setBio}
              disabled={isUploading || !isYourProfile}
              unstyled={!isYourProfile}
              className={`${isUploading ? "animate-pulse" : ""}`}
            />
          </div>
        )}
        {!isExist && (
          <IconUserCancel
            className="text-red-400 self-center m-14"
            strokeWidth="1"
            size={128}
          />
        )}

        <div className="mt-4 flex flex-row-reverse justify-between items-end">
          {isYourProfile && (
            <Button
              title="Update profile"
              size="md"
              onClick={handleUpdate}
              disabled={isUploading}
              className="w-32 self-end justify-center"
            >
              <>
                <IconUpload
                  className="text-slate-500"
                  strokeWidth="1.5"
                  size={24}
                />
                <Text size="md" font="light">
                  Update
                </Text>
              </>
            </Button>
          )}
          {isFromAnotherPage && (
            <Button
              title="Go back"
              size="md"
              onClick={returnBack}
              disabled={!isFromAnotherPage}
              className="w-32 justify-center"
            >
              <>
                <IconArrowBackUp
                  className="text-slate-500"
                  strokeWidth="1.5"
                  size={24}
                />
                <Text size="md" font="light">
                  Go back
                </Text>
              </>
            </Button>
          )}
        </div>
      </Paper>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 min-h-[400px] min-w-[350px] max-w-[650px]">
        {children}
      </div>
    </div>
  );
}

function Loader() {
  return (
    <Wrapper>
      <div className="w-full h-full p-4 rounded-xl animate-pulse bg-slate-50" />
    </Wrapper>
  );
}
