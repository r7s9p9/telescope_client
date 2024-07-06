import {
  IconCircleArrowLeft,
  IconFileUpload,
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

  const iconProps = {
    className: "text-slate-600",
    strokeWidth: "1",
    size: 24,
  };

  return (
    <Wrapper>
      <Paper
        padding={4}
        className="w-full h-full flex flex-col md:shadow-md md:rounded-xl bg-slate-50"
      >
        <div className="flex justify-between items-center">
          <Text size="xl" font="light" className="select-none">
            {title}
          </Text>
          {isUploading && <Spinner size={32} />}
        </div>
        {isExist && (
          <div className="flex flex-col justify-center">
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
              value={data.name || "Hidden by user privacy settings"}
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
              value={data.bio || "Hidden by user privacy settings"}
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

        <div className="mt-4 flex flex-row-reverse justify-between items-end grow">
          {isExist && isYourProfile && (
            <Button
              title="Update profile"
              size="md"
              onClick={handleUpdate}
              disabled={isUploading}
              className="w-36 self-end justify-center"
            >
              <>
                <IconFileUpload {...iconProps} />
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
              className="w-36 justify-center"
            >
              <>
                <IconCircleArrowLeft {...iconProps} />
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
    <div className="w-full h-full flex items-center justify-center border-t-2 border-slate-100 md:border-0">
      <div className="w-full h-full md:h-fit md:w-3/4 md:min-h-[400px] md:min-w-[350px] md:max-w-[650px]">
        {children}
      </div>
    </div>
  );
}

function Loader() {
  return (
    <Wrapper>
      <div className="w-full h-full p-4 flex flex-col md:shadow-md md:rounded-xl bg-slate-50">
        <div className="w-32 h-8 mb-2 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-24 h-6 mb-1 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-full h-12 mb-1 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-24 h-6 mb-1 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-full h-12 mb-1 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-24 h-6 mb-1 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-full h-12 mb-4 rounded-lg bg-slate-200 animate-pulse" />
        <div className="w-full h-12 mb-2 rounded-lg bg-slate-200 animate-pulse" />
      </div>
    </Wrapper>
  );
}
