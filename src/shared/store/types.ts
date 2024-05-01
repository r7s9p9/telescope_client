import { RoomId } from "../../types";
import {
  MessageListType,
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
        messages: { allCount: number; items?: MessageListType["messages"] };
        info: RoomInfoType["info"];
        isFirstLoad: boolean;
        scrollPosition: number;
        editable: { isExist: true; message: MessageType } | { isExist: false };
      }
    | undefined
  >;
};

export type CallbackType = {
  reloadRooms: () => void;
};

export type StoreState = {
  store: StoreType;
  setStore: React.Dispatch<React.SetStateAction<StoreType>>;
};
