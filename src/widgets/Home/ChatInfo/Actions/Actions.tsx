import { IconCopy, IconDoorExit, IconTrash } from "@tabler/icons-react";
import { useActions } from "./useActions";
import { Button } from "../../../../shared/ui/Button/Button";
import { Text } from "../../../../shared/ui/Text/Text";

export function Actions() {
  const {
    handleLeaveClick,
    handleDeleteClick,
    handleCopyClick,
    isMember,
    isAdmin,
  } = useActions();

  return (
    <div className="flex flex-col shrink-0 grow justify-end">
      <Button
        title="Copy link"
        size="md"
        unstyled
        onClick={handleCopyClick}
        className="hover:bg-slate-200 gap-4"
      >
        <IconCopy className="text-slate-600 ml-24" strokeWidth="1" size={24} />
        <Text size="md" font="light" className="text-slate-600">
          Copy link
        </Text>
      </Button>
      {isMember && (
        <Button
          title="Leave room"
          size="md"
          unstyled
          onClick={handleLeaveClick}
          className="hover:bg-slate-200 gap-4"
        >
          <IconDoorExit
            className="text-slate-600 ml-24"
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
          onClick={handleDeleteClick}
          className="hover:bg-slate-200 gap-4"
        >
          <IconTrash className="text-red-600 ml-24" strokeWidth="1" size={24} />
          <Text size="md" font="light" className="text-red-600">
            Delete room
          </Text>
        </Button>
      )}
    </div>
  );
}
