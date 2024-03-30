import { validate as uuidValidate } from "uuid";
import { RoomId, UserId } from "../../types";

export const checkUserId = (uuid: any): uuid is UserId => {
  return uuidValidate(uuid);
};

export const checkRoomId = (uuid: any): uuid is RoomId => {
  return uuidValidate(uuid);
};