import { RoomId } from "../../types";
import { MessageListType, RoomListType } from "./api.schema";

export type AccountRead = {};

export type AccountPrivacyRule =
  | "everybody"
  | "friendOfFriends"
  | "friends"
  | "nobody";

export type StoreType = {
  rooms?: {
    success: boolean;
    data?: RoomListType;
    error?: string;
  };
  chats?: {
    [key: RoomId]: {
      success: boolean;
      access: boolean;
      isEmpty: boolean;
      allCount: number;
      messages?: MessageListType["messages"];
      bottomScrollPosition: number;
    };
  };
};
