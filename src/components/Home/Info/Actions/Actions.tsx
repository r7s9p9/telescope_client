import {
  IconArrowBadgeDown,
  IconCopy,
  IconDoorExit,
  IconTrash,
} from "@tabler/icons-react";
import { useActions } from "./useActions";
import { Button } from "../../../../shared/ui/Button/Button";
import { Text } from "../../../../shared/ui/Text/Text";
import { useConfirmPopup } from "../../../../shared/features/ConfirmPopup/ConfirmPopup";

export function Actions() {
  const {
    isShow,
    switchIsShow,
    handleLeave,
    handleDelete,
    handleCopy,
    isMember,
    isAdmin,
    lang,
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
          title={lang.actions.SHOW_LABEL}
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
              title={lang.actions.ITEM_COPY_ACTION}
              size="md"
              unstyled
              onClick={handleCopy}
              className="hover:bg-slate-200 border-t-2 border-slate-100  gap-4"
            >
              <IconCopy {...iconProps} />
              <Text {...textProps}>{lang.actions.ITEM_COPY_ACTION}</Text>
            </Button>
            {isMember && (
              <Button
                title={lang.actions.ITEM_LEAVE_ROOM_ACTION}
                size="md"
                unstyled
                onClick={() => {
                  confirmPopup.show({
                    onAgree: handleLeave,
                    onClose: confirmPopup.hide,
                    text: {
                      title: lang.actions.LEAVE_POPUP_TITLE,
                      question: lang.actions.LEAVE_POPUP_QUESTION,
                      confirm: lang.actions.LEAVE_POPUP_CONFIRM,
                      cancel: lang.actions.LEAVE_POPUP_CANCEL,
                    },
                  });
                }}
                className="hover:bg-slate-200 gap-4"
              >
                <IconDoorExit {...iconProps} />
                <Text {...textProps}>
                  {lang.actions.ITEM_LEAVE_ROOM_ACTION}
                </Text>
              </Button>
            )}
            {isMember && isAdmin && (
              <Button
                title={lang.actions.ITEM_DELETE_ROOM_ACTION}
                size="md"
                unstyled
                onClick={() => {
                  confirmPopup.show({
                    onAgree: handleDelete,
                    onClose: confirmPopup.hide,
                    text: {
                      title: lang.actions.DELETE_POPUP_TITLE,
                      question: lang.actions.DELETE_POPUP_QUESTION,
                      confirm: lang.actions.DELETE_POPUP_CONFIRM,
                      cancel: lang.actions.DELETE_POPUP_CANCEL,
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
                  {lang.actions.ITEM_DELETE_ROOM_ACTION}
                </Text>
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
