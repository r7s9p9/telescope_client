import { validate as uuidValidate } from "uuid";
import { RoomId, UserId } from "../../types";

export const checkUserId = (uuid: string): uuid is UserId => {
  return uuidValidate(uuid);
};

export const checkRoomId = (uuid: string): uuid is RoomId => {
  return uuidValidate(uuid);
};
