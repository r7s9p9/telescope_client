import React from "react";
import { GetMessagesResponseType, RoomId } from "../api/api.schema";
import {
  MessageType,
  ReadRoomInfoResponseType,
  ReadRoomsResponseType,
} from "../api/api.schema";

export type StoreType = {
  rooms: ReadRoomsResponseType;
  chats: Record<
    RoomId,
    | {
        roomId: RoomId;
        messages?: GetMessagesResponseType["messages"];
        info: ReadRoomInfoResponseType["info"];
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
