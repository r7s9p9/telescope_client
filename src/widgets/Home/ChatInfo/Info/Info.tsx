import { ReactNode } from "react";
import { Text } from "../../../../shared/ui/Text/Text";
import { useInfo } from "./useInfo";
import { Paper } from "../../../../shared/ui/Paper/Paper";
import { Input } from "../../../../shared/ui/Input/Input";
import { TextArea } from "../../../../shared/ui/TextArea/TextArea";
import { Select } from "../../../../shared/ui/Select/Select";
import { IconButton } from "../../../../shared/ui/IconButton/IconButton";
import { IconCheck, IconEdit, IconX } from "@tabler/icons-react";
import { formatDate } from "../../../../shared/lib/date";
import { Spinner } from "../../../../shared/ui/Spinner/Spinner";

function InfoLine({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="h-8 flex items-center">
      <Text size="sm" font="default" className="min-w-14">
        {label}:
      </Text>
      {children}
    </div>
  );
}

export function Info() {
  const {
    handleEditClick,
    isEdit,
    editable,
    storedInfo,
    creatorUsername,
    isInitialLoading,
    isAdmin,
  } = useInfo();

  return (
    <Paper
      padding={4}
      className="relative bg-slate-50 border-t-2 border-slate-100"
    >
      {isInitialLoading && <InfoSkeleton />}
      {!isInitialLoading && (
        <>
          <div className="flex flex-col gap-2 items-start w-full pr-24">
            <InfoLine label="Name">
              <Input
                value={editable.name}
                setValue={(val) => editable.setName(val)}
                disabled={!isEdit}
                unstyled={!isEdit}
                size="sm"
                className="bg-slate-50"
              />
            </InfoLine>
            <InfoLine label="About">
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
            <InfoLine label="Type">
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
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="single">Single</option>
              </Select>
            </InfoLine>
            <InfoLine label="Creator">
              {creatorUsername && (
                <Text size="sm" font="light" className="ml-2">
                  {creatorUsername}
                </Text>
              )}
              {!creatorUsername && <Spinner size={16} className="ml-2" />}
            </InfoLine>
            <InfoLine label="Created">
              <Text size="sm" font="light" className="ml-2">
                {formatDate().info(storedInfo?.created as number)}
              </Text>
            </InfoLine>
          </div>
          {isAdmin && (
            <EditGroup handleClick={handleEditClick} isEdit={isEdit} />
          )}
        </>
      )}
    </Paper>
  );
}

function InfoSkeleton() {
  return <div className="w-full h-52 rounded-lg bg-slate-100 animate-pulse" />;
}

function EditGroup({
  handleClick,
  isEdit,
}: {
  handleClick: (str: "edit" | "cancel" | "send") => void;
  isEdit: boolean;
}) {
  return (
    <div className="absolute right-4 top-4">
      <IconButton
        title="Edit"
        onClick={() => handleClick("edit")}
        style={{
          position: "absolute",
          zIndex: isEdit ? 0 : 10,
          opacity: isEdit ? "0" : "1",
        }}
        disabled={isEdit}
      >
        <IconEdit strokeWidth="1" className="text-slate-600" size={24} />
      </IconButton>
      <IconButton
        title="Cancel edit"
        onClick={() => handleClick("cancel")}
        style={{
          opacity: !isEdit ? "0" : "1",
        }}
        disabled={!isEdit}
        className="z-0"
      >
        <IconX strokeWidth="1" className="text-slate-600" size={24} />
      </IconButton>
      <IconButton
        title="Update info"
        onClick={() => handleClick("send")}
        style={{
          opacity: !isEdit ? "0" : "1",
        }}
        disabled={!isEdit}
      >
        <IconCheck strokeWidth="1" className="text-slate-600" size={24} />
      </IconButton>
    </div>
  );
}
