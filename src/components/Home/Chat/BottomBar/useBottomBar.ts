import { useEffect, useState } from "react";
import { useLoadInfo, useLoadNewerMessages } from "../useChat";
import { useLoadRooms } from "../../Rooms/useRooms";
import { useStore } from "../../../../shared/store/store";
import {
  useQueryJoinRoom,
  useQuerySendMessage,
  useQueryUpdateMessage,
} from "../../../../shared/api/api.model";
import { RoomId } from "../../../../shared/api/api.schema";
import { MessageType } from "../../../../shared/api/api.schema";
import { useNotify } from "../../../../shared/features/Notification/Notification";
import { useLang } from "../../../../shared/features/LangProvider/LangProvider";

export function useSend(roomId: RoomId) {
  const { lang } = useLang();
  const loadNewerMessages = useLoadNewerMessages();

  const storeAction = useStore().chat(roomId);
  const storedChat = storeAction.read();
  const storedMessages = storedChat?.messages;
  const editable = storedChat?.editable;
  const notify = useNotify();

  const querySend = useQuerySendMessage();
  const queryUpdate = useQueryUpdateMessage();

  const [formData, setFormData] = useState({ text: "" });
  const resetFormData = () => setFormData({ text: "" });

  const onSubmit = async () => {
    if (
      formData.text &&
      !querySend.isLoading &&
      !queryUpdate.isLoading &&
      storedMessages
    ) {
      if (editable?.isExist) {
        // If the message is being edited
        const { success, response, requestError, responseError } =
          await queryUpdate.run({
            roomId,
            message: { content: formData, created: editable.message.created },
          });

        if (!success) {
          notify.show.error(
            requestError?.text || responseError || lang.error.UNKNOWN_MESSAGE,
          );
          return;
        }

        if (!response.access) {
          notify.show.error(lang.bottomBarNotification.UPDATE_MESSAGE_NO_RIGHT);
          return;
        }

        if (!response.success) {
          notify.show.error(lang.bottomBarNotification.UPDATE_MESSAGE_FAIL);
          return;
        }

        const updatedMessages = storedMessages.map((message) => {
          if (message.created === editable.message.created) {
            return {
              ...message,
              content: formData,
              modified: response.dates.modified,
            };
          }
          return message;
        }) as MessageType[];

        storeAction.update().data({
          ...storedChat,
          messages: updatedMessages,
        });
        storeAction.update().editable(false);
      } else {
        // If new message writed
        const { success, response, requestError, responseError } =
          await querySend.run({
            roomId: roomId as RoomId,
            message: { content: { text: formData.text } },
          });

        if (!success) {
          notify.show.error(
            requestError?.text || responseError || lang.error.UNKNOWN_MESSAGE,
          );
          return;
        }
        if (!response.access) {
          notify.show.error(lang.bottomBarNotification.SEND_MESSAGE_NO_RIGHT);
          return;
        }
        if (!response.success) {
          notify.show.error(lang.bottomBarNotification.SEND_MESSAGE_FAIL);
        }

        loadNewerMessages.run();
      }
      resetFormData();
    }
  };

  // If the message is marked as editable,
  // we copy its text into the input value
  useEffect(() => {
    if (editable?.isExist && editable.message.content.text) {
      setFormData({ text: editable.message.content.text });
    }
  }, [editable]);

  return {
    formData,
    setFormData,
    onSubmit,
    isLoading: querySend.isLoading || queryUpdate.isLoading,
  };
}

export function useJoin(roomId: RoomId) {
  const { lang } = useLang();
  const query = useQueryJoinRoom();
  const loadInfo = useLoadInfo();
  const loadRooms = useLoadRooms();
  const notify = useNotify();

  const run = async () => {
    const { success, response, requestError, responseError } = await query.run({
      roomId: roomId as RoomId,
    });
    if (!success) {
      notify.show.error(
        requestError || responseError || lang.error.UNKNOWN_MESSAGE,
      );
      return;
    }

    // TODO:
    // BAN ?
    if (response.success) {
      await loadRooms.run();
      await loadInfo.run();
    } else {
      notify.show.error(lang.error.UNKNOWN_MESSAGE);
    }
  };
  return { run, isLoading: query.isLoading };
}
