import { validate as uuidValidate } from "uuid";
import { UserId, RoomId } from "../api/api.schema";

export const checkUserId = (uuid?: string): uuid is UserId => {
  if (!uuid) return false;
  return uuidValidate(uuid);
};

export const checkRoomId = (uuid?: string): uuid is RoomId => {
  if (!uuid) return false;
  return uuidValidate(uuid);
};
