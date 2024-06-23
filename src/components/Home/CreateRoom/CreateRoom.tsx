import {
  IconAbc,
  IconArrowBackUp,
  IconBlockquote,
  IconStar,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Text } from "../../../shared/ui/Text/Text";
import { Paper } from "../../../shared/ui/Paper/Paper";
import { Button } from "../../../shared/ui/Button/Button";
import { SegmentedButton } from "../../../shared/ui/SegmentedButton/SegmentedButton";
import { InputField } from "../../../shared/ui/InputField/InputField";
import { useCreateRoom } from "./useCreateRoom";
import { Spinner } from "../../../shared/ui/Spinner/Spinner";
import { TextAreaField } from "../../../shared/ui/TextAreaField/TextAreaField";

export function CreateRoom() {
  const { form, setName, setAbout, handleSelectType, run, cancel, isLoading } =
    useCreateRoom();

  return (
    <div className="absolute left-0 right-0 md:relative w-full h-full flex items-center justify-center">
      <Paper
        padding={4}
        shadow="xl"
        className="w-full h-full md:h-fit md:w-3/4 md:min-w-[350px] md:max-w-[650px] md:rounded-xl flex flex-col bg-slate-50"
      >
        <div className="flex justify-between items-center">
          <Text size="xl" font="light" letterSpacing className="self-center">
            Create a room
          </Text>
          <Spinner
            size={32}
            className={`${isLoading ? "opacity-100" : "opacity-0"}`}
          />
        </div>
        <InputField
          size="md"
          label={"Name"}
          value={form.name.value}
          setValue={setName}
          error={form.name.error}
          rightSection={
            <IconAbc className="text-slate-500" strokeWidth="1" size={28} />
          }
          className="w-full"
        />
        <SegmentedButton
          label="Type"
          size="md"
          type="horizontal"
          defaultValue={form.type}
          onSelected={(value) =>
            handleSelectType(value as "private" | "public" | "single")
          }
          elements={[
            {
              label: (
                <>
                  <IconUsersGroup
                    className="text-slate-600"
                    strokeWidth="1"
                    size={24}
                  />
                  <Text size="md" font="light">
                    Public
                  </Text>
                </>
              ),
              value: "public",
            },
            {
              label: (
                <>
                  <IconUsers
                    className="text-slate-600"
                    strokeWidth="1"
                    size={24}
                  />
                  <Text size="md" font="light">
                    Private
                  </Text>
                </>
              ),
              value: "private",
            },
            {
              label: (
                <>
                  <IconUser
                    className="text-slate-600"
                    strokeWidth="1"
                    size={24}
                  />
                  <Text size="md" font="light">
                    Single
                  </Text>
                </>
              ),
              value: "single",
            },
          ]}
        />
        <TextAreaField
          size="md"
          minRows={1}
          maxRows={8}
          label="About"
          value={form.about.value}
          setValue={setAbout}
          error={form.about.error}
          rightSection={
            <IconBlockquote
              className="text-slate-500"
              strokeWidth="1"
              size={28}
            />
          }
        />
        <div className="mt-4 flex items-center justify-between">
          <Button
            title="Cancel"
            size="md"
            onClick={cancel}
            className="w-32 justify-center"
          >
            <>
              <IconArrowBackUp
                className="text-slate-500"
                strokeWidth="1.5"
                size={24}
              />
              <Text size="md" font="light">
                Cancel
              </Text>
            </>
          </Button>
          <Button
            title="Create room"
            size="md"
            onClick={run}
            className="w-32 justify-center"
          >
            <>
              <IconStar
                className="text-slate-500"
                strokeWidth="1.5"
                size={24}
              />
              <Text size="md" font="light">
                Create
              </Text>
            </>
          </Button>
        </div>
      </Paper>
    </div>
  );
}

//className="md:invisible md:hidden mr-4"
