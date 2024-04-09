import { RoomId, UserId } from "../../types";

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
    code: endpoint + "/api/auth/code"
  },
  session: {
    remove: endpoint + "/api/session/remove"
  },
  account: {
    read: endpoint + "/api/account/read",
    update: endpoint + "/api/account/update",
  },
  room: {
    getRoomList: endpoint + "/api/room/overview-my-rooms",
    readInfo: endpoint + "/api/room/read",
  },
  message: {
    read: endpoint + "/api/message/read",
    add: endpoint + "/api/message/add",
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
  return { range: { min: range.min.toString(), max: range.max.toString()} };
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

export const readMessages = (
  roomId: RoomId,
  range: { min: number; max: number },
) => {
  return {
    roomId: roomId,
    range: range,
  };
};
