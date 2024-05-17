import { IconEdit, IconSend2, IconX } from "@tabler/icons-react";
import { useLoadInfo, useSend, useEdit, useInfo } from "../useChat";
import { useLoadRooms } from "../../rooms/useRooms";
import { useQueryJoinRoom } from "../../../../shared/api/api";
import { Button } from "../../../../shared/ui/Button/Button";
import { RoomId } from "../../../../types";
import { Spinner } from "../../../../shared/ui/spinner/spinner";

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
      <Spinner size={16} />
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
          <button
            onClick={joinAction}
            className="px-6 py-2 text-xl font-light tracking-widest uppercase rounded-lg hover:bg-slate-200 duration-300"
          >
            Join
          </button>
        </div>
      )}
      {joinQuery.isLoading && <BottomBarSpinner />}
    </>
  );
}

function BottomBar() {
  const editAction = useEdit();
  const { register, isLoading, onSubmit } = useSend();

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
            <p className="font-light">Edit message</p>
            <p className="w-full truncate">
              {editAction.editable.message.content.text}
            </p>
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
      <form
        onSubmit={onSubmit}
        className="shrink-0 relative h-24 p-4 w-full flex items-center border-x-2 border-slate-100 bg-slate-50"
      >
        <textarea
          {...register("text")}
          rows={2}
          defaultValue={
            editAction.editable?.isExist
              ? editAction.editable.message?.content.text
              : ""
          }
          aria-multiline={true}
          aria-expanded={true}
          autoComplete="off"
          placeholder="Send message..."
          className={`resize-none h-fit grow py-2 pl-4 pr-12 outline-none font-light text-gray-800 text-xl bg-slate-100 ring-2 ring-slate-200 rounded-xl focus:ring-slate-300 focus:bg-slate-50 duration-300 ease-in-out`}
        />
        <div className="absolute right-8">
          <Button
            title={"Send message"}
            type={"submit"}
            rounded={"full"}
            loading={isLoading}
            loaderType={"outside"}
          >
            <IconSend2 className="text-slate-400" size={24} />
          </Button>
        </div>
      </form>
    </>
  );
}
