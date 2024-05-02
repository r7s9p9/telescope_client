import { RoomId, UserId } from "../../types";
import { MessageDates, MessageType, SendMessageFormType } from "./api.schema";

export const privacyRule = {
  everybody: "everybody" as const,
  nobody: "nobody" as const,
  friends: "friends" as const,
  friendOfFriends: "friendOfFriends" as const,
};

export const roomTypeValues = {
  public: "public" as const,
  private: "private" as const,
  single: "single" as const,
};

export const roomInfoFields = {
  name: "name" as const,
  creatorId: "creatorId" as const,
  type: "type" as const,
  about: "about" as const,
};

export type ReadRoomInfoValues = (typeof roomInfoFields)[
  | "name"
  | "creatorId"
  | "type"
  | "about"];

export const endpoint = "http://localhost:3000" as const;

export const serverRoute = {
  auth: {
    register: endpoint + "/api/auth/register",
    login: endpoint + "/api/auth/login",
    code: endpoint + "/api/auth/code",
  },
  session: {
    remove: endpoint + "/api/session/remove",
  },
  account: {
    read: endpoint + "/api/account/read",
    update: endpoint + "/api/account/update",
  },
  room: {
    getRoomList: endpoint + "/api/room/overview-my-rooms",
    search: endpoint + "/api/room/search",
    readInfo: endpoint + "/api/room/read-info",
    updateInfo: endpoint + "/api/room/update",
    create: endpoint + "/api/room/create",
    delete: endpoint + "/api/room/delete",
    leave: endpoint + "/api/room/leave",
    join: endpoint + "/api/room/join"
  },
  message: {
    read: endpoint + "/api/message/read",
    compare: endpoint + "/api/message/compare",
    send: endpoint + "/api/message/add",
    update: endpoint + "/api/message/update",
    remove: endpoint + "/api/message/remove",
  },
};

export const readAccountBody = (userId: UserId | "self") => {
  return {
    userId: userId,
    toRead: {
      general: ["username", "name", "bio"],
    },
  };
};

export const readRoomList = (range: { min: number; max: number }) => {
  return { range: { min: range.min, max: range.max } };
};

export const readRoomInfo = (
  roomIdArr: RoomId[],
  toRead: Array<ReadRoomInfoValues>,
) => {
  return {
    roomIdArr: roomIdArr,
    toRead: toRead,
  };
};

export const readMessagesByIndexRange = (
  roomId: RoomId,
  indexRange: { min: number; max: number },
) => {
  return {
    roomId,
    indexRange,
  };
};

export const readMessagesByCreatedRange = (
  roomId: RoomId,
  createdRange: { min: number; max?: number },
) => {
  return {
    roomId,
    createdRange,
  };
};

export const compareMessages = (roomId: RoomId, toCompare: MessageDates[]) => {
  return {
    roomId,
    toCompare,
  };
};

export const sendMessage = (roomId: RoomId, content: SendMessageFormType) => {
  return { roomId, message: { content } };
};

export const updateMessage = (
  roomId: RoomId,
  prevCreated: MessageType["created"],
  content: SendMessageFormType,
) => {
  return { roomId, message: { content, created: prevCreated } };
};

export const deleteMessage = (
  roomId: RoomId,
  created: MessageType["created"],
) => {
  return { roomId, created };
};
