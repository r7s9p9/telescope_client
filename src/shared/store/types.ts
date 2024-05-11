import { RoomId } from "../../types";
import {
  MessageReadType,
  MessageType,
  RoomInfoType,
  RoomsType,
} from "../api/api.schema";

export type StoreType = {
  rooms: RoomsType;
  chats: Record<
    RoomId,
    | {
        roomId: RoomId;
        messages?: MessageReadType["messages"];
        info: RoomInfoType["info"];
        allCount: number;
        isFirstLoad: boolean;
        isNewMessages: boolean;
        scrollPosition: number;
        editable: { isExist: true; message: MessageType } | { isExist: false };
      }
    | undefined
  >;
};

export type StoreState = {
  store: StoreType;
  setStore: React.Dispatch<React.SetStateAction<StoreType>>;
};
