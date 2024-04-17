import { RoomId } from "../../types";
import { MessageListType, RoomType, RoomsType } from "../api/api.schema";

export type StoreType = {
  rooms?: RoomsType;
  chats?: {
    [key: RoomId]: {
      success: boolean;
      access: boolean;
      allCount: number;
      messages?: MessageListType["messages"];
      name?: RoomType["name"];
      type: RoomType["type"];
      userCount: RoomType["userCount"];
      scrollPosition: number;
    };
  };
};

export type StoreState = {
  store: StoreType;
  setStore: React.Dispatch<React.SetStateAction<StoreType>>;
};
