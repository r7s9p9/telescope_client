import {
  IconAbc,
  IconBlockquote,
  IconCirclePlus,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { Text } from "../../../shared/ui/Text/Text";
import { Button } from "../../../shared/ui/Button/Button";
import { SegmentedButton } from "../../../shared/ui/SegmentedButton/SegmentedButton";
import { InputField } from "../../../shared/ui/InputField/InputField";
import { useCreateRoom } from "./useCreateRoom";
import { TextAreaField } from "../../../shared/ui/TextAreaField/TextAreaField";
import { Popup } from "../../../shared/ui/Popup/Popup";

const iconProps = {
  className: "text-slate-600",
  strokeWidth: "1",
  size: 24,
};

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

  return (
    <Popup
      titleText="Create a room"
      contentRef={contentRef}
      overlayRef={overlayRef}
      onClose={onClose}
    >
      <InputField
        size="md"
        label={"Name"}
        value={form.name.value}
        setValue={setName}
        error={form.name.error}
        rightSection={
          <IconAbc className="text-slate-500" strokeWidth="1" size={28} />
        }
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
        maxRows={4}
        label="About"
        value={form.about.value}
        setValue={setAbout}
        error={form.about.error}
        rightSection={<IconBlockquote {...iconProps} />}
      />
      <div className="grow" />
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
    </Popup>
  );
}
