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
    lang,
  } = useCreateRoom();

  return (
    <Popup
      titleText={lang.createRoom.POPUP_TITLE}
      contentRef={contentRef}
      overlayRef={overlayRef}
      onClose={onClose}
    >
      <InputField
        size="md"
        label={lang.createRoom.NAME_LABEL}
        value={form.name.value}
        setValue={setName}
        error={form.name.error}
        rightSection={
          <IconAbc className="text-slate-500" strokeWidth="1" size={28} />
        }
      />
      <SegmentedButton
        label={lang.createRoom.TYPE_LABEL}
        size="md"
        type="auto"
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
                  {lang.createRoom.TYPE_PUBLIC_ITEM}
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
                  {lang.createRoom.TYPE_PRIVATE_ITEM}
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
                  {lang.createRoom.TYPE_SINGLE_ITEM}
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
        label={lang.createRoom.ABOUT_LABEL}
        value={form.about.value}
        setValue={setAbout}
        error={form.about.error}
        rightSection={<IconBlockquote {...iconProps} />}
      />
      <div className="grow" />
      <Button
        title={lang.createRoom.CREATE_ACTION}
        size="md"
        onClick={run}
        className="mt-4 md:w-36 w-full md:self-end justify-center"
      >
        <>
          <IconCirclePlus {...iconProps} />
          <Text size="md" font="light">
            {lang.createRoom.CREATE_ACTION}
          </Text>
        </>
      </Button>
    </Popup>
  );
}
