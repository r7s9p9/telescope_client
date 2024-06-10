import { IconUpload } from "@tabler/icons-react";
import { Button } from "../../../shared/ui/Button/Button";
import { InputField } from "../../../shared/ui/InputField/InputField";
import { Paper } from "../../../shared/ui/Paper/Paper";
import { Text } from "../../../shared/ui/Text/Text";
import { TextAreaField } from "../../../shared/ui/TextAreaField/TextAreaField";
import { Spinner } from "../../../shared/ui/Spinner/Spinner";
import { useProfile } from "./useProfile";

export function Profile() {
  const { data, error, setName, setUsername, setBio, isLoading, handleUpdate } =
    useProfile();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Paper
        padding={4}
        rounded="xl"
        shadow="xl"
        className="w-3/4 min-w-[350px] max-w-[650px] flex flex-col bg-slate-50"
      >
        <div className="flex justify-between items-center">
          <Text size="xl" font="light" letterSpacing className="select-none">
            Your profile
          </Text>
          <Spinner
            size={32}
            className={`${isLoading ? "opacity-100" : "opacity-0"}`}
          />
        </div>
        <InputField
          label="Username"
          size="md"
          value={data.username}
          error={error.username}
          setValue={setUsername}
          disabled={isLoading}
          className={`${isLoading ? "animate-pulse" : ""}`}
        />
        <InputField
          label="Name"
          size="md"
          value={data.name}
          error={error.name}
          setValue={setName}
          disabled={isLoading}
          className={`${isLoading ? "animate-pulse" : ""}`}
        />
        <TextAreaField
          maxRows={6}
          label="Bio"
          size="md"
          value={data.bio}
          error={error.bio}
          setValue={setBio}
          disabled={isLoading}
          className={`${isLoading ? "animate-pulse" : ""}`}
        />
        <Button
          title="Update profile"
          size="md"
          onClick={handleUpdate}
          disabled={isLoading}
          className="w-32 self-end mt-4 justify-center"
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
      </Paper>
    </div>
  );
}
