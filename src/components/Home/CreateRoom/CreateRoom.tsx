import {
  IconAbc,
  IconBlockquote,
  IconCirclePlus,
  IconUser,
  IconUsers,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react";
import { Text } from "../../../shared/ui/Text/Text";
import { Paper } from "../../../shared/ui/Paper/Paper";
import { Button } from "../../../shared/ui/Button/Button";
import { SegmentedButton } from "../../../shared/ui/SegmentedButton/SegmentedButton";
import { InputField } from "../../../shared/ui/InputField/InputField";
import { useCreateRoom } from "./useCreateRoom";
import { TextAreaField } from "../../../shared/ui/TextAreaField/TextAreaField";
import { IconButton } from "../../../shared/ui/IconButton/IconButton";
import { Overlay } from "../../../shared/ui/Overlay/Overlay";

export function CreateRoom() {
  const {
    form,
    setName,
    setAbout,
    handleSelectType,
    run,
    onClose,
    contentRef,
    overlayRef,
  } = useCreateRoom();

  const iconProps = {
    className: "text-slate-600",
    strokeWidth: "1",
    size: 24,
  };

  return (
    <Overlay contentRef={contentRef} overlayRef={overlayRef}>
      <Paper
        padding={4}
        shadow="xl"
        className="w-screen absolute bottom-0 left-0 md:relative md:w-3/4 md:min-w-[400px] md:max-w-[650px] rounded-t-xl md:rounded-xl flex flex-col bg-slate-50"
      >
        <div className="flex justify-between items-center">
          <Text
            size="xl"
            font="thin"
            uppercase
            letterSpacing
            className="select-none"
          >
            Create a room
          </Text>
          <IconButton title="Exit" onClick={onClose}>
            <IconX {...iconProps} size={32} />
          </IconButton>
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
          className="w-full mt-2 border-t-2 border-slate-100"
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
                  <IconUsersGroup {...iconProps} />
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
                  <IconUsers {...iconProps} />
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
                  <IconUser {...iconProps} />
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
          rightSection={<IconBlockquote {...iconProps} />}
        />
        <Button
          title="Create room"
          size="md"
          onClick={run}
          className="mt-4 md:w-36 w-full md:self-end justify-center"
        >
          <>
            <IconCirclePlus {...iconProps} />
            <Text size="md" font="light">
              Create
            </Text>
          </>
        </Button>
      </Paper>
    </Overlay>
  );
}
