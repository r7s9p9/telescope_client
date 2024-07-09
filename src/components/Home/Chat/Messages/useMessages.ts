import { useEdit } from "../useChat";
import { useMenuContext } from "../../../../shared/features/ContextMenu/ContextMenu";
import { RoomId } from "../../../../shared/api/api.schema";
import { useStore } from "../../../../shared/store/store";
import { useQueryDeleteMessage } from "../../../../shared/api/api.model";
import { MessageType } from "../../../../shared/api/api.schema";
import { formatDate } from "../../../../shared/lib/date";
import { useNotify } from "../../../../shared/features/Notification/Notification";
import { langError, langMessagesNotification } from "../../../../locales/en";

function useDelete(roomId: RoomId) {
  const storeAction = useStore().chat(roomId);
  const storedMessages = storeAction.read()?.messages;

  const query = useQueryDeleteMessage();
  const notify = useNotify();

  const onDelete = async (created: MessageType["created"]) => {
    const { success, response, requestError, responseError } = await query.run({
      roomId,
      created,
    });

    if (!success) {
      notify.show.error(
        requestError || responseError || langError.UNKNOWN_MESSAGE,
      );
      return;
    }

    if (!response.access) {
      notify.show.error(langMessagesNotification.DELETE_NO_RIGHT);
      return;
    }

    if (!response.success) {
      notify.show.error(langMessagesNotification.DELETE_FAIL);
      return;
    }

    if (storedMessages) {
      const messages = storedMessages?.filter(
        (message) => message.created !== created,
      );
      storeAction.update().data({
        messages,
      });
    }
  };
  return { onDelete, isLoading: query.isLoading };
}

export function useMessage({
  roomId,
  message,
}: {
  roomId: RoomId;
  message: MessageType;
}) {
  const editAction = useEdit();
  const deleteAction = useDelete(roomId);
  const { openMenu, closeMenu } = useMenuContext();

  let type: "service" | "self" | "foreign";
  if (message.authorId === "service") {
    type = "service";
  } else if (message.authorId === "self") {
    type = "self";
  } else {
    type = "foreign";
  }

  const content = {
    type,
    username: message.username,
    text: message.content.text,
    date: formatDate().message(message.created, message.modified),
  };

  async function onClickMenuHandler(
    type: "reply" | "edit" | "copy" | "delete",
  ) {
    // TODO
    // if (type === "reply") {}
    if (type === "edit") {
      editAction.onEdit(message);
      closeMenu();
    }
    if (type === "copy") {
      navigator.clipboard.writeText(message.content.text);
      closeMenu();
    }
    if (type === "delete") {
      await deleteAction.onDelete(message.created);
      closeMenu();
    }
  }

  return { content, onClickMenuHandler, openMenu };
}
