import { useState } from "react";
import { RoomId, UserId } from "../../types";
import {
  compareMessages,
  deleteMessage,
  readAccountBody,
  readMessagesByCreatedRange,
  readMessagesByIndexRange,
  readRoomList,
  sendMessage,
  serverRoute,
  updateMessage,
} from "./api.constants";
import {
  MessageDates,
  MessageType,
  SendMessageFormType,
  accountReadSchema,
  messageReadSchema,
  messageCompareSchema,
  messageDeleteSchema,
  messageSendSchema,
  roomsSchema,
  messageUpdateSchema,
  RoomType,
  roomUpdateInfoSchema,
  RoomInfoUpdate,
  roomInfoSchema,
  AccountReadType,
  logoutSchema,
  LogoutType,
  RoomsType,
  RoomInfoType,
  searchRoomsSchema,
  SearchRoomsType,
  MessageReadType,
  MessageSendType,
  MessageUpdateType,
  MessageDeleteType,
  MessageCompareType,
  authLoginSchema,
  AuthLoginType,
  authCodeSchema,
  AuthCodeType,
  authRegisterSchema,
  AuthRegisterType,
  roomCreateSchema,
  RoomCreateType,
  roomUpdateSchema,
  RoomUpdateType,
  roomDeleteSchema,
  RoomDeleteType,
  roomLeaveSchema,
  roomJoinSchema,
  RoomJoinType,
  roomGetMembersSchema,
  RoomGetMembersType,
  RoomKickMemberType,
  RoomBanMemberType,
  roomKickMemberSchema,
  roomBanMemberSchema,
} from "./api.schema";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants";
import { z } from "zod";
// import { useStore } from "../store/store";
// import { StoreType } from "../store/types";

function validatorFactory(data: object, schema: z.ZodTypeAny) {
  const result = schema.safeParse(data);

  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

// export function useWatchdog() {
//   const stateAction = useStore().routesState();

//   const isActive = (route: keyof StoreType["routesState"]) => {
//     return stateAction.read(route)
//   }

//   const incBadCount = () => {}
//   const resetBadCounter = () => {}
// }

export const fetcher = async (route: string, body: object) => {
  try {
    const result = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (result.status === 404 || result.status === 500) {
      return { success: false as const, error: `status ${result.status}` };
    }
    return {
      success: true as const,
      auth: result.status !== 401 && result.status !== 403,
      ban: result.status === 403,
      payload: await result.json(),
    };
  } catch (error) {
    return { success: false as const, error };
  }
};

export function useQuery({ schema }: { schema: z.ZodTypeAny }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const run = async (route: string, body: object) => {
    setIsLoading(true);
    const response = await fetcher(route, body);
    if (!response.success) {
      console.error(
        `Response error on route ${route}`,
        "\nError:",
        response.error,
      );
      setIsLoading(false);
      return { success: false as const };
    }

    if (!response.auth) {
      // TODO: => state: Ban || Logged out
      navigate(
        { pathname: routes.login.path },
        // { state: { isLoggedOut: true } }, // need other value for !isLogged
      );
      setIsLoading(false);
      return { success: false as const };
    }

    const { success, data, error } = validatorFactory(response.payload, schema);
    if (!success) {
      console.error(
        `Response validation error on route ${route}`,
        "\nResponse:",
        response.payload,
        "\nError:",
        error,
      );
      setIsLoading(false);
      return { success: false as const };
    }

    setIsLoading(false);
    return { success: true as const, response: data };
  };
  return { isLoading, run };
}

// TODO make request validation factory
function updateRoomValidator(payload: object) {
  const result = roomUpdateInfoSchema.safeParse(payload);
  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

export function useQueryLogin() {
  const query = useQuery({ schema: authLoginSchema });

  const run = async (payload: { email: string; password: string }) => {
    const { success, response } = await query.run(
      serverRoute.auth.login,
      payload,
    );
    if (!success) return { success: false as const };
    return { success: true as const, data: response as AuthLoginType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryCode() {
  const query = useQuery({ schema: authCodeSchema });
  const run = async (payload: { email: string; code: string }) => {
    const { success, response } = await query.run(
      serverRoute.auth.code,
      payload,
    );
    if (!success) return { success: false as const };
    return { success: true as const, data: response as AuthCodeType };
  };
  return { run, isLoading: query.isLoading };
}

export function useQueryRegister() {
  const query = useQuery({
    schema: authRegisterSchema,
  });
  const run = async (payload: {
    email: string;
    username: string;
    password: string;
  }) => {
    const { success, response } = await query.run(
      serverRoute.auth.register,
      payload,
    );
    if (!success) return { success: false as const };
    return { success: true as const, data: response as AuthRegisterType };
  };
  return { run, isLoading: query.isLoading };
}

export function useQueryLogout() {
  const query = useQuery({ schema: logoutSchema });

  const run = async (sessionId: string | "self") => {
    const { success, response } = await query.run(serverRoute.session.remove, {
      sessionId: sessionId,
    });
    if (!success) return { success: false as const };
    return { success: true as const, data: response as LogoutType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryAccount() {
  const query = useQuery({ schema: accountReadSchema });

  const run = async (userId: UserId | "self") => {
    const { success, response } = await query.run(
      serverRoute.account.read,
      readAccountBody(userId),
    );
    if (!success) return { success: false as const };
    return { success: true as const, data: response as AccountReadType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryRooms() {
  const query = useQuery({ schema: roomsSchema });

  const run = async (range: { min: number; max: number }) => {
    const { success, response } = await query.run(
      serverRoute.room.getRoomList,
      readRoomList(range),
    );
    if (!success) return { success: false as const };
    return { success: true as const, data: response as RoomsType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryRoomInfo() {
  const query = useQuery({ schema: roomInfoSchema });

  const run = async (roomId: RoomId) => {
    const { success, response } = await query.run(serverRoute.room.readInfo, {
      roomId,
    });
    if (!success) return { success: false as const };
    return { success: true as const, data: response as RoomInfoType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQuerySearchRooms() {
  const query = useQuery({ schema: searchRoomsSchema });

  const run = async (q: string, limit = 10, offset = 0) => {
    const { success, response } = await query.run(serverRoute.room.search, {
      limit,
      offset,
      q,
    });
    if (!success) return { success: false as const };
    return { success: true as const, data: response as SearchRoomsType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryReadMessages() {
  const query = useQuery({ schema: messageReadSchema });

  const run = () => {
    const indexRange = async (
      roomId: RoomId,
      indexRange: { min: number; max: number },
    ) => {
      const { success, response } = await query.run(
        serverRoute.message.read,
        readMessagesByIndexRange(roomId, indexRange),
      );
      if (!success) return { success: false as const };
      return { success: true as const, data: response as MessageReadType };
    };
    const createdRange = async (
      roomId: RoomId,
      createdRange: { min: number; max?: number },
    ) => {
      const { success, response } = await query.run(
        serverRoute.message.read,
        readMessagesByCreatedRange(roomId, createdRange),
      );
      if (!success) return { success: false as const };
      return { success: true as const, data: response as MessageReadType };
    };
    return { indexRange, createdRange };
  };

  return { run, isLoading: query.isLoading };
}

export function useQuerySendMessage() {
  const query = useQuery({ schema: messageSendSchema });

  const run = async (roomId: RoomId, content: SendMessageFormType) => {
    const { success, response } = await query.run(
      serverRoute.message.send,
      sendMessage(roomId, content),
    );
    if (!success) return { success: false as const };
    return { success: true as const, data: response as MessageSendType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryUpdateMessage() {
  const query = useQuery({
    schema: messageUpdateSchema,
  });

  const run = async (
    roomId: RoomId,
    prevCreated: MessageType["created"],
    content: SendMessageFormType,
  ) => {
    const { success, response } = await query.run(
      serverRoute.message.update,
      updateMessage(roomId, prevCreated, content),
    );
    if (!success) return { success: false as const };
    return { success: true as const, data: response as MessageUpdateType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryDeleteMessage() {
  const query = useQuery({
    schema: messageDeleteSchema,
  });

  const run = async (roomId: RoomId, created: MessageType["created"]) => {
    const { success, response } = await query.run(
      serverRoute.message.remove,
      deleteMessage(roomId, created),
    );
    if (!success) return { success: false as const };
    return { success: true as const, data: response as MessageDeleteType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryCompareMessages() {
  const query = useQuery({
    schema: messageCompareSchema,
  });

  const run = async (roomId: RoomId, toCompare: MessageDates[]) => {
    const { success, response } = await query.run(
      serverRoute.message.compare,
      compareMessages(roomId, toCompare),
    );
    if (!success) return { success: false as const };
    return { success: true as const, data: response as MessageCompareType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryCreateRoom() {
  const query = useQuery({ schema: roomCreateSchema });

  const run = async (
    name: string,
    type: Omit<RoomType["type"], "service">,
    about: string,
  ) => {
    const { success, response } = await query.run(serverRoute.room.create, {
      roomInfo: {
        name,
        type,
        about,
      },
    });
    if (!success) return { success: false as const };
    return { success: true as const, data: response as RoomCreateType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryUpdateRoom() {
  const query = useQuery({ schema: roomUpdateSchema });

  const run = async (roomId: RoomId, info: RoomInfoUpdate) => {
    // TODO make request validation factory
    const request = updateRoomValidator(info);
    if (!request.success) return { success: false as const };

    const { success, response } = await query.run(serverRoute.room.updateInfo, {
      roomId,
      info: request.data,
    });
    if (!success) return { success: false as const };
    return { success: false as const, data: response as RoomUpdateType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryDeleteRoom() {
  const query = useQuery({ schema: roomDeleteSchema });

  const run = async (roomId: RoomId) => {
    const { success, response } = await query.run(serverRoute.room.delete, {
      roomId,
    });
    if (!success) return { success: false as const };
    return { success: true as const, data: response as RoomDeleteType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryLeaveRoom() {
  const query = useQuery({ schema: roomLeaveSchema });

  const run = async (roomId: RoomId) => {
    const { success, response } = await query.run(serverRoute.room.leave, {
      roomId,
    });
    if (!success) return { success: false as const };
    return { success: true as const, data: response as RoomDeleteType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryJoinRoom() {
  const query = useQuery({ schema: roomJoinSchema });

  const run = async (roomId: RoomId) => {
    const { success, response } = await query.run(serverRoute.room.join, {
      roomId,
    });
    if (!success) return { success: false as const };
    return { success: true as const, data: response as RoomJoinType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryGetMembers() {
  const query = useQuery({ schema: roomGetMembersSchema });

  const run = async (roomId: RoomId) => {
    const { success, response } = await query.run(serverRoute.room.getMembers, {
      roomId,
    });
    if (!success) return { success: false as const };
    return { success: true as const, data: response as RoomGetMembersType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryKickMember() {
  const query = useQuery({ schema: roomKickMemberSchema });

  const run = async (roomId: RoomId, userId: UserId) => {
    const { success, response } = await query.run(serverRoute.room.kick, {
      roomId,
      userIds: [userId],
    });
    if (!success) return { success: false as const };
    return { success: true as const, data: response as RoomKickMemberType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryBanMember() {
  const query = useQuery({ schema: roomBanMemberSchema });

  const run = async (roomId: RoomId, userId: UserId) => {
    const { success, response } = await query.run(serverRoute.room.ban, {
      roomId,
      userIds: [userId],
    });
    if (!success) return { success: false as const };
    return { success: true as const, data: response as RoomBanMemberType };
  };

  return { run, isLoading: query.isLoading };
}
