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
  routesState: {
    sessionRemove: boolean;
    accountRead: boolean;
    accountUpdate: boolean;
    roomGetRoomList: boolean;
    roomSearch: boolean;
    roomReadInfo: boolean;
    roomUpdateInfo: boolean;
    roomCreate: boolean;
    roomDelete: boolean;
    roomLeave: boolean;
    roomJoin: boolean;
    messageRead: boolean;
    messageCompare: boolean;
    messageSend: boolean;
    messageUpdate: boolean;
    messageRemove: boolean;
  };
};

export type StoreState = {
  store: StoreType;
  setStore: React.Dispatch<React.SetStateAction<StoreType>>;
};
