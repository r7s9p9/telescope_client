import { ReactNode } from "react";
import { Text } from "../../../../shared/ui/Text/Text";
import { useProperties } from "./useProperties";
import { Paper } from "../../../../shared/ui/Paper/Paper";
import { Input } from "../../../../shared/ui/Input/Input";
import { TextArea } from "../../../../shared/ui/TextArea/TextArea";
import { Select } from "../../../../shared/ui/Select/Select";
import { IconButton } from "../../../../shared/ui/IconButton/IconButton";
import { IconCheck, IconEdit, IconX } from "@tabler/icons-react";
import { formatDate } from "../../../../shared/lib/date";
import { Spinner } from "../../../../shared/ui/Spinner/Spinner";
import { langProperties } from "../../../../locales/en";

function InfoLine({
  label,
  isLoading,
  children,
}: {
  label: string;
  isLoading: boolean;
  children: ReactNode;
}) {
  return (
    <div className="h-8 w-full flex items-center">
      <Text size="sm" font="default" className="min-w-14 select-none">
        {label}:
      </Text>
      {isLoading && (
        <div className="h-6 w-full rounded-lg bg-slate-100 animate-pulse" />
      )}
      {!isLoading && children}
    </div>
  );
}

export function Properties() {
  const {
    handleEditClick,
    isEdit,
    editable,
    storedInfo,
    creatorUsername,
    isInitialLoading,
    isAdmin,
  } = useProperties();

  return (
    <Paper
      padding={4}
      className="relative bg-slate-50 border-t-2 border-slate-100"
    >
      <div className="flex flex-col gap-2 items-start w-full pr-[100px]">
        <InfoLine
          isLoading={isInitialLoading}
          label={langProperties.NAME_LABEL}
        >
          <Input
            value={editable.name}
            setValue={(val) => editable.setName(val)}
            disabled={!isEdit}
            unstyled={!isEdit}
            size="sm"
            className="bg-slate-50"
          />
        </InfoLine>
        <InfoLine
          isLoading={isInitialLoading}
          label={langProperties.ABOUT_LABEL}
        >
          <TextArea
            size="sm"
            minRows={1}
            maxRows={4}
            value={editable.about}
            setValue={(val) => editable.setAbout(val)}
            disabled={!isEdit}
            unstyled={!isEdit}
            className="bg-slate-50"
          />
        </InfoLine>
        <InfoLine
          isLoading={isInitialLoading}
          label={langProperties.TYPE_LABEL}
        >
          <Select
            value={editable.type}
            setValue={(val) =>
              editable.setType(val as "public" | "private" | "single")
            }
            disabled={!isEdit}
            unstyled={!isEdit}
            size="sm"
            className="bg-slate-50"
          >
            <option value="public">{langProperties.TYPE_PUBLIC_OPTION}</option>
            <option value="private">
              {langProperties.TYPE_PRIVATE_OPTION}
            </option>
            <option value="single">{langProperties.TYPE_SINGLE_OPTION}</option>
          </Select>
        </InfoLine>
        <InfoLine
          isLoading={isInitialLoading}
          label={langProperties.CREATOR_LABEL}
        >
          {creatorUsername && (
            <Text size="sm" font="light" className="ml-2">
              {creatorUsername}
            </Text>
          )}
          {!creatorUsername && <Spinner size={16} className="ml-2" />}
        </InfoLine>
        <InfoLine
          isLoading={isInitialLoading}
          label={langProperties.CREATED_LABEL}
        >
          <Text size="sm" font="light" className="ml-2">
            {storedInfo?.created &&
              formatDate().info(storedInfo?.created as number)}
          </Text>
        </InfoLine>
      </div>
      {isAdmin && <EditGroup handleClick={handleEditClick} isEdit={isEdit} />}
    </Paper>
  );
}

function EditGroup({
  handleClick,
  isEdit,
}: {
  // eslint-disable-next-line no-unused-vars
  handleClick: (str: "edit" | "cancel" | "send") => void;
  isEdit: boolean;
}) {
  const iconProps = {
    strokeWidth: "1",
    className: "text-slate-600",
    size: 24,
  };

  return (
    <div className="absolute right-4 top-4">
      <IconButton
        title={langProperties.BUTTON_EDIT_LABEL}
        onClick={() => handleClick("edit")}
        style={{
          position: "absolute",
          zIndex: isEdit ? 0 : 1,
          opacity: isEdit ? "0" : "1",
        }}
        disabled={isEdit}
      >
        <IconEdit {...iconProps} />
      </IconButton>
      <IconButton
        title={langProperties.BUTTON_CANCEL_LABEL}
        onClick={() => handleClick("cancel")}
        style={{
          opacity: !isEdit ? "0" : "1",
        }}
        disabled={!isEdit}
        className="z-0"
      >
        <IconX {...iconProps} />
      </IconButton>
      <IconButton
        title={langProperties.BUTTON_UPDATE_LABEL}
        onClick={() => handleClick("send")}
        style={{
          opacity: !isEdit ? "0" : "1",
        }}
        disabled={!isEdit}
      >
        <IconCheck {...iconProps} />
      </IconButton>
    </div>
  );
}
