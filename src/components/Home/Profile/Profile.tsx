import {
  IconAbc,
  IconAt,
  IconCircleArrowLeft,
  IconFileUpload,
  IconUser,
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
    isFromAnotherPage,
    returnBack,
    lang,
  } = useProfile();

  if (!isLoaded) return <Loader />;

  let title = "";
  if (data.isYourProfile) {
    title = lang.profile.TITLE_SELF;
  } else if (data.isExist) {
    title = lang.profile.TITLE_USER(data.username);
  } else {
    title = lang.profile.TITLE_NOT_FOUND;
  }

  const inputIconProps = {
    className: "text-slate-500",
    strokeWidth: "1",
    size: 28,
  };

  const buttonIconProps = {
    size: 24,
    className: "text-slate-500",
    strokeWidth: "1.5",
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
        {data.isExist && (
          <div className="flex flex-col justify-center">
            {data.isYourProfile && (
              <InputField
                label={lang.profile.USERNAME_LABEL}
                size="md"
                value={data.username}
                error={error.username}
                setValue={setUsername}
                disabled={isUploading}
                className={`${isUploading ? "animate-pulse" : ""}`}
                rightSection={<IconAt {...inputIconProps} />}
              />
            )}
            <InputField
              label={lang.profile.NAME_LABEL}
              size="md"
              value={data.name}
              error={error.name}
              setValue={setName}
              disabled={isUploading || !data.isYourProfile}
              unstyled={!data.isYourProfile}
              className={`${isUploading ? "animate-pulse" : ""}`}
              rightSection={<IconUser {...inputIconProps} />}
            />
            <TextAreaField
              maxRows={6}
              label={lang.profile.BIO_LABEL}
              size="md"
              value={data.bio}
              error={error.bio}
              setValue={setBio}
              disabled={isUploading || !data.isYourProfile}
              unstyled={!data.isYourProfile}
              className={`${isUploading ? "animate-pulse" : ""}`}
              rightSection={<IconAbc {...inputIconProps} />}
            />
          </div>
        )}
        {!data.isExist && (
          <>
            <IconUserCancel
              className="text-red-400 self-center m-auto"
              strokeWidth="1"
              size={128}
            />
            <Text size="md" font="light" className="text-center mt-4">
              {lang.profile.DETAILS_NOT_FOUND}
            </Text>
          </>
        )}
        <div className="mt-auto md:mt-4" />
        <div className="flex flex-col md:flex-row-reverse justify-between items-end gap-4">
          {data.isYourProfile && (
            <Button
              title={lang.profile.UPDATE_ACTION}
              size="md"
              onClick={handleUpdate}
              disabled={isUploading}
              className="w-full md:w-36 justify-center"
            >
              <IconFileUpload {...buttonIconProps} />
              <Text size="md" font="light">
                {lang.profile.UPDATE_ACTION}
              </Text>
            </Button>
          )}
          {isFromAnotherPage && (
            <Button
              title={lang.profile.GO_BACK_ACTION}
              size="md"
              onClick={returnBack}
              disabled={!isFromAnotherPage}
              className="w-full md:w-36 justify-center"
            >
              <IconCircleArrowLeft {...buttonIconProps} />
              <Text size="md" font="light">
                {lang.profile.GO_BACK_ACTION}
              </Text>
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
