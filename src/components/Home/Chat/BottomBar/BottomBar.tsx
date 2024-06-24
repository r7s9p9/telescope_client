import { IconEdit, IconSend2, IconX } from "@tabler/icons-react";
import { IconButton } from "../../../../shared/ui/IconButton/IconButton";
import { RoomId } from "../../../../shared/api/api.schema";
import { Spinner } from "../../../../shared/ui/Spinner/Spinner";
import { Text } from "../../../../shared/ui/Text/Text";
import { TextArea } from "../../../../shared/ui/TextArea/TextArea";
import { useEdit, useInfo } from "../useChat";
import { useJoin, useSend } from "./useBottomBar";
import { Button } from "../../../../shared/ui/Button/Button";

export function BottomBarWrapper({
  data,
}: {
  data: ReturnType<typeof useInfo>;
}) {
  if (data.info?.isInitialLoading) return <BottomBarSpinner />;
  if (data.info?.isMember) return <BottomBar roomId={data.roomId} />;
  return <BottomBarNoMember roomId={data.roomId} />;
}

function BottomBarSpinner() {
  return (
    <div className="shrink-0 h-16 md:h-24 w-full flex items-center justify-center border-l-2 border-slate-100 bg-slate-100 md:bg-slate-50">
      <Spinner size={48} />
    </div>
  );
}

function BottomBarNoMember({ roomId }: { roomId: RoomId }) {
  const join = useJoin(roomId);

  return (
    <>
      {!join.isLoading && (
        <div className="shrink-0 relative h-24 w-full flex items-center justify-center border-l-2 border-slate-100 bg-slate-50">
          <Button
            title="Join room"
            size="md"
            unstyled
            onClick={() => join.run()}
          >
            <Text size="xl" font="light" uppercase>
              Join
            </Text>
          </Button>
        </div>
      )}
      {join.isLoading && <BottomBarSpinner />}
    </>
  );
}

function BottomBar({ roomId }: { roomId: RoomId }) {
  const editAction = useEdit();
  const { formData, setFormData, isLoading, onSubmit } = useSend(roomId);

  return (
    <>
      {editAction.editable?.isExist && (
        <div className="w-full px-4 border-l-2 border-b-2 border-slate-100 bg-slate-50 flex flex-row items-center">
          <IconEdit
            className="shrink-0 text-slate-400"
            strokeWidth="1"
            size={24}
          />
          <div className="grow w-0 pl-4 h-12 flex flex-col justify-center text-sm">
            <Text size="sm" font="light">
              Edit message
            </Text>
            <Text size="sm" font="default" className="truncate">
              {editAction.editable.message.content.text}
            </Text>
          </div>
          <IconButton
            onClick={() => editAction.closeEdit()}
            title="Close editing"
          >
            <IconX className="text-slate-600" strokeWidth="1" size={24} />
          </IconButton>
        </div>
      )}
      <div className="relative md:p-4 flex items-center md:border-l-2 border-slate-100 bg-slate-50">
        <TextArea
          value={formData.text}
          setValue={(val) =>
            setFormData((prevInfo) => ({ ...prevInfo, text: val }))
          }
          minRows={1}
          maxRows={6}
          size="xl"
          className="ring-0 md:ring-2"
          rightSection={
            <IconButton
              title={"Send message"}
              loading={isLoading}
              loaderType={"outside"}
              loaderSize={42}
              onClick={onSubmit}
            >
              <IconSend2 className="text-slate-600" strokeWidth="1" size={32} />
            </IconButton>
          }
        />
      </div>
    </>
  );
}
