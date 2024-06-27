import {
  IconArrowBadgeDown,
  IconCopy,
  IconDoorExit,
  IconTrash,
} from "@tabler/icons-react";
import { useActions } from "./useActions";
import { Button } from "../../../../shared/ui/Button/Button";
import { Text } from "../../../../shared/ui/Text/Text";
import { useConfirmPopup } from "../../../ConfirmPopup/ConfirmPopup";

export function Actions() {
  const {
    isShow,
    switchIsShow,
    handleLeave,
    handleDelete,
    handleCopy,
    isMember,
    isAdmin,
  } = useActions();
  const confirmPopup = useConfirmPopup();

  const iconProps = {
    className: "text-slate-600 ml-2",
    strokeWidth: "1",
    size: 24,
  };
  const textProps = {
    size: "md" as const,
    font: "light" as const,
    uppercase: true,
    className: "text-slate-600",
  };

  return (
    <>
      <div className="w-full flex flex-col shrink-0 border-t-2 border-slate-100">
        <Button
          title="Show actions"
          size="sm"
          unstyled
          onClick={switchIsShow}
          className="hover:bg-slate-200 justify-center shrink-0"
        >
          <IconArrowBadgeDown
            strokeWidth="1"
            className="text-slate-400"
            size={32}
            style={{ transform: isShow ? "rotate(0deg)" : "rotate(180deg)" }}
          />
        </Button>
        {isShow && (
          <>
            <Button
              title="Copy link"
              size="md"
              unstyled
              onClick={handleCopy}
              className="hover:bg-slate-200 border-t-2 border-slate-100  gap-4"
            >
              <IconCopy {...iconProps} />
              <Text {...textProps}>Copy link</Text>
            </Button>
            {isMember && (
              <Button
                title="Leave room"
                size="md"
                unstyled
                onClick={() => {
                  confirmPopup.show({
                    onAgree: handleLeave,
                    onClose: confirmPopup.hide,
                    text: {
                      question: "Are you sure you want to leave the room?",
                      confirm: "Leave",
                      cancel: "Cancel",
                    },
                  });
                }}
                className="hover:bg-slate-200 gap-4"
              >
                <IconDoorExit {...iconProps} />
                <Text {...textProps}>Leave room</Text>
              </Button>
            )}
            {isMember && isAdmin && (
              <Button
                title="Delete room"
                size="md"
                unstyled
                onClick={() => {
                  confirmPopup.show({
                    onAgree: handleDelete,
                    onClose: confirmPopup.hide,
                    text: {
                      question: "Are you sure you want to delete this room?",
                      confirm: "Delete",
                      cancel: "Cancel",
                    },
                  });
                }}
                className="hover:bg-slate-200 gap-4"
              >
                <IconTrash
                  className="text-red-600 ml-2"
                  strokeWidth="1"
                  size={24}
                />
                <Text size="md" font="light" uppercase className="text-red-600">
                  Delete room
                </Text>
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
