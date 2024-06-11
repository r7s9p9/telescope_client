import { useEffect, useState } from "react";
import { useLoadInfo, useLoadNewerMessages } from "../useChat";
import { useLoadRooms } from "../../Rooms/useRooms";
import { useStore } from "../../../../shared/store/store";
import {
  useQueryJoinRoom,
  useQuerySendMessage,
  useQueryUpdateMessage,
} from "../../../../shared/api/api";
import { RoomId } from "../../../../types";
import { MessageType } from "../../../../shared/api/api.schema";

export function useSend(roomId: RoomId) {
  const loadNewerMessages = useLoadNewerMessages();

  const storeAction = useStore().chat(roomId);
  const storedChat = storeAction.read();
  const storedMessages = storedChat?.messages;
  const editable = storedChat?.editable;

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
        const { success, data } = await queryUpdate.run(
          roomId,
          editable.message.created,
          formData,
        );
        // TODO 500 error
        if (!success) return;
        //
        console.log(data);
        if (data.success && data.access) {
          const updatedMessages = storedMessages.map((message) => {
            if (message.created === editable.message.created) {
              return {
                ...message,
                content: formData,
                modified: data.dates.modified,
              };
            }
            return message;
          }) as MessageType[];

          storeAction.update().data({
            ...storedChat,
            messages: updatedMessages,
          });
          storeAction.update().editable(false);
        }
      } else {
        // If new message writed
        const { success } = await querySend.run(roomId as RoomId, formData);
        // TODO 500 error
        if (success) loadNewerMessages.run();
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

  const run = async () => {
    const { success } = await query.run(roomId);
    if (success) {
      loadRooms.run();
      loadInfo.run();
    }
  };
  return { run, isLoading: query.isLoading };
}
