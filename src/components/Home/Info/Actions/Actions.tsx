import { IconCopy, IconDoorExit, IconTrash } from "@tabler/icons-react";
import { useActions } from "./useActions";
import { Button } from "../../../../shared/ui/Button/Button";
import { Text } from "../../../../shared/ui/Text/Text";
import { ConfirmPopup } from "../../../../shared/ui/ConfirmPopup/ConfirmPopup";
import { usePopup } from "../../../Popup/Popup";

export function Actions() {
  const { handleLeave, handleDelete, handleCopy, isMember, isAdmin } =
    useActions();
  const popup = usePopup();

  return (
    <div className="flex flex-col shrink-0 justify-end border-t-2 border-slate-100">
      <Button
        title="Copy link"
        size="md"
        unstyled
        onClick={handleCopy}
        className="hover:bg-slate-200 gap-4"
      >
        <IconCopy className="text-slate-600 ml-28" strokeWidth="1" size={24} />
        <Text size="md" font="light" className="text-slate-600">
          Copy link
        </Text>
      </Button>
      {isMember && (
        <Button
          title="Leave room"
          size="md"
          unstyled
          onClick={() => {
            popup.show(
              ConfirmPopup({
                onAgree: handleLeave,
                onClose: popup.hide,
                text: "Are you sure you want to leave the room?",
              }),
            );
          }}
          className="hover:bg-slate-200 gap-4"
        >
          <IconDoorExit
            className="text-slate-600 ml-28"
            strokeWidth="1"
            size={24}
          />
          <Text size="md" font="light" className="text-slate-600">
            Leave room
          </Text>
        </Button>
      )}
      {isMember && isAdmin && (
        <Button
          title="Delete room"
          size="md"
          unstyled
          onClick={() => {
            popup.show(
              ConfirmPopup({
                onAgree: handleDelete,
                onClose: popup.hide,
                text: "Are you sure you want to delete this room?",
              }),
            );
          }}
          className="hover:bg-slate-200 gap-4"
        >
          <IconTrash className="text-red-600 ml-28" strokeWidth="1" size={24} />
          <Text size="md" font="light" className="text-red-600">
            Delete room
          </Text>
        </Button>
      )}
    </div>
  );
}
