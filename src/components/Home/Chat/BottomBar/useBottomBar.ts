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
import { useNotify } from "../../../Notification/Notification";
import { langError, langRoom } from "../../../../locales/en";

export function useSend(roomId: RoomId) {
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

  useEffect(() => {
    if (editable?.isExist && editable.message.content.text) {
      setFormData({ text: editable.message.content.text });
    }
  }, [editable]);

  const onSubmit = async () => {
    if (
      formData.text &&
      !querySend.isLoading &&
      !queryUpdate.isLoading &&
      storedMessages
    ) {
      // If message edited
      if (editable?.isExist) {
        const { success, response, requestError, responseError } =
          await queryUpdate.run({
            roomId,
            message: { content: formData, created: editable.message.created },
          });

        if (!success) {
          notify.show.error(
            requestError?.text || responseError || langError.UNKNOWN_MESSAGE,
          );
          return;
        }

        if (!response.access) {
          notify.show.error(langRoom.UPDATE_MESSAGE_NO_RIGHT);
          return;
        }

        if (!response.success) {
          notify.show.error(langRoom.UPDATE_MESSAGE_FAIL);
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

        // TODO make request error showing in UI

        if (!success) {
          notify.show.error(
            requestError?.text || responseError || langError.UNKNOWN_MESSAGE,
          );
          return;
        }
        if (!response.access) {
          notify.show.error(langRoom.SEND_MESSAGE_NO_RIGHT);
          return;
        }
        if (!response.success) {
          notify.show.error(langRoom.SEND_MESSAGE_FAIL);
        }

        loadNewerMessages.run();
      }
      resetFormData();
    }
  };

  return {
    formData,
    setFormData,
    onSubmit,
    isLoading: querySend.isLoading || queryUpdate.isLoading,
  };
}

export function useJoin(roomId: RoomId) {
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
        requestError || responseError || langError.UNKNOWN_MESSAGE,
      );
      return;
    }

    // TODO:
    // BAN ?
    if (response.success) {
      await loadRooms.run();
      await loadInfo.run();
    } else {
      notify.show.error(langError.UNKNOWN_MESSAGE);
    }
  };
  return { run, isLoading: query.isLoading };
}
