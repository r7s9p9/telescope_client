import { useEdit } from "../useChat";
import { useMenuContext } from "../../../ContextMenu/ContextMenu";
import { RoomId } from "../../../../types";
import { useStore } from "../../../../shared/store/store";
import { useQueryDeleteMessage } from "../../../../shared/api/api";
import { MessageType } from "../../../../shared/api/api.schema";
import { formatDate } from "../../../../shared/lib/date";

function useDelete(roomId: RoomId) {
  const storeAction = useStore().chat(roomId as RoomId);
  const storedMessages = storeAction.read()?.messages;

  const query = useQueryDeleteMessage();

  const onDelete = async (created: MessageType["created"]) => {
    const { success } = await query.run(roomId as RoomId, created);
    if (success && storedMessages) {
      const messages = storedMessages?.filter(
        (message) => message.created !== created,
      );
      storeAction.update().data({
        messages,
      });
    }
    return { success };
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
    //
    // if (type === "reply") {
    // }
    if (type === "edit") {
      editAction.onEdit(message);
      closeMenu();
    }
    if (type === "copy") {
      navigator.clipboard.writeText(message.content.text);
      closeMenu();
    }
    if (type === "delete") {
      const success = await deleteAction.onDelete(message.created);
      if (success) closeMenu();
    }
  }

  return { content, onClickMenuHandler, openMenu };
}
