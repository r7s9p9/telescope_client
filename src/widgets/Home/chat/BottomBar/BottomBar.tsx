import { IconEdit, IconSend2, IconX } from "@tabler/icons-react";
import { useSend, useEdit, useLoadInfo, useInfo } from "../useChat";
import { useLoadRooms } from "../../Rooms/useRooms";
import { useQueryJoinRoom } from "../../../../shared/api/api";
import { Button } from "../../../../shared/ui/Button/Button";
import { RoomId } from "../../../../types";
import { Spinner } from "../../../../shared/ui/Spinner/Spinner";
import { Text } from "../../../../shared/ui/Text/Text";
import { TextArea } from "../../../../shared/ui/TextArea/TextArea";

export function BottomBarWrapper({
  data,
}: {
  data: ReturnType<typeof useInfo>;
}) {
  if (data.info?.isInitialLoading) return <BottomBarSpinner />;
  if (data.info?.isMember) return <BottomBar />;
  return <BottomBarNoMember roomId={data.roomId} />;
}

function BottomBarSpinner() {
  return (
    <div className="shrink-0 h-24 w-full flex border-x-2 border-slate-100 bg-slate-50">
      <Spinner size={64} />
    </div>
  );
}

function BottomBarNoMember({ roomId }: { roomId: RoomId }) {
  const joinQuery = useQueryJoinRoom();
  const loadInfo = useLoadInfo();
  const loadRooms = useLoadRooms();
  const joinAction = async () => {
    const { success } = await joinQuery.run(roomId);
    if (success) {
      loadRooms.run();
      loadInfo.run();
    }
  };

  return (
    <>
      {!joinQuery.isLoading && (
        <div className="shrink-0 relative h-24 w-full flex items-center justify-center border-x-2 border-slate-100 bg-slate-50">
          <Button title="Join room" rounded="default" onClick={joinAction}>
            <Text size="xl" font="default" uppercase className="py-2 px-6">
              Join
            </Text>
          </Button>
        </div>
      )}
      {joinQuery.isLoading && <BottomBarSpinner />}
    </>
  );
}

function BottomBar() {
  const editAction = useEdit();
  const { formData, setFormData, isLoading, onSubmit } = useSend();

  return (
    <>
      {editAction.editable?.isExist && (
        <div className="w-full px-4 border-x-2 border-b-2 border-slate-100 bg-slate-50 flex flex-row items-center">
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
          <Button
            onClick={() => editAction.closeEdit()}
            rounded="full"
            title="Close editing"
          >
            <IconX className="text-slate-600" strokeWidth="1" size={24} />
          </Button>
        </div>
      )}
      <div className="shrink-0 relative min-h-24 p-4 w-full flex items-center border-x-2 border-slate-100 bg-slate-50">
        <TextArea
          value={formData.text}
          setValue={(val) =>
            setFormData((prevInfo) => ({ ...prevInfo, text: val }))
          }
          minRows={2}
          maxRows={6}
          size="xl"
          rightSection={
            <Button
              title={"Send message"}
              rounded={"full"}
              loading={isLoading}
              loaderType={"outside"}
              onClick={onSubmit}
            >
              <IconSend2 className="text-slate-400" size={24} />
            </Button>
          }
        />
      </div>
    </>
  );
}
