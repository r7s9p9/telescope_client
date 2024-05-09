import { useState } from "react";
import { RoomId } from "../../types";
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
} from "./api.schema";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants";
import { z } from "zod";

const fetcher = async (route: string, body: object) => {
  const result = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return { status: result.status, payload: await result.json() };
};

function useQuery({
  shouldCheckAuth,
  schema,
}: {
  shouldCheckAuth: boolean;
  schema: z.ZodTypeAny;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const run = async (route: string, body: object) => {
    setIsLoading(true);
    const response = await fetcher(route, body);
    const { success, data, error } = validatorFactory(response.payload, schema);
    if (!success) {
      console.error(
        `Response validation error on route ${route}`,
        "\nResponse:",
        response.payload,
        "\nError:",
        error,
      );
      return { validationSuccess: false as const };
    }
    if (shouldCheckAuth && !isAuth(response.status)) {
      navigate(
        { pathname: routes.login.path },
        // { state: { isLoggedOut: true } }, // need other value for !isLogged
      );
    }
    setIsLoading(false);
    return { validationSuccess: true as const, response: data };
  };
  return { isLoading, run };
}

function isAuth(status: number) {
  switch (status) {
    case 401:
      return false as const;
    default:
      return true as const;
  }
}

function validatorFactory(data: object, schema: z.ZodTypeAny) {
  const result = schema.safeParse(data);

  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

// TODO make request validation factory
function updateRoomValidator(payload: object) {
  const result = roomUpdateInfoSchema.safeParse(payload);
  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

export function useQueryLogin() {
  const query = useQuery({ shouldCheckAuth: false, schema: authLoginSchema });

  const run = async (payload: { email: string; password: string }) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.auth.login,
      payload,
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as AuthLoginType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryCode() {
  const query = useQuery({ shouldCheckAuth: false, schema: authCodeSchema });
  const run = async (payload: { email: string; code: string }) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.auth.code,
      payload,
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as AuthCodeType };
  };
  return { run, isLoading: query.isLoading };
}

export function useQueryRegister() {
  const query = useQuery({
    shouldCheckAuth: false,
    schema: authRegisterSchema,
  });
  const run = async (payload: {
    email: string;
    username: string;
    password: string;
  }) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.auth.register,
      payload,
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as AuthRegisterType };
  };
  return { run, isLoading: query.isLoading };
}

export function useQueryLogout() {
  const query = useQuery({ shouldCheckAuth: true, schema: logoutSchema });

  const run = async (sessionId: string | "self") => {
    const { validationSuccess, response } = await query.run(
      serverRoute.session.remove,
      {
        sessionId: sessionId,
      },
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as LogoutType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQuerySelfAccount() {
  const query = useQuery({ shouldCheckAuth: true, schema: accountReadSchema });

  const run = async () => {
    const { validationSuccess, response } = await query.run(
      serverRoute.account.read,
      readAccountBody("self"),
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as AccountReadType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryRooms() {
  const query = useQuery({ shouldCheckAuth: true, schema: roomsSchema });

  const run = async (range: { min: number; max: number }) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.room.getRoomList,
      readRoomList(range),
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as RoomsType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryRoomInfo() {
  const query = useQuery({ shouldCheckAuth: true, schema: roomInfoSchema });

  const run = async (roomId: RoomId) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.room.readInfo,
      {
        roomId,
      },
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as RoomInfoType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryFindRooms() {
  const query = useQuery({ shouldCheckAuth: true, schema: searchRoomsSchema });

  const run = async (q: string, limit = 10, offset = 0) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.room.search,
      {
        limit,
        offset,
        q,
      },
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as SearchRoomsType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryReadMessages() {
  const query = useQuery({ shouldCheckAuth: true, schema: messageReadSchema });

  const run = () => {
    const indexRange = async (
      roomId: RoomId,
      indexRange: { min: number; max: number },
    ) => {
      const { validationSuccess, response } = await query.run(
        serverRoute.message.read,
        readMessagesByIndexRange(roomId, indexRange),
      );
      if (!validationSuccess) return { success: false as const };
      return { success: true as const, data: response as MessageReadType };
    };
    const createdRange = async (
      roomId: RoomId,
      createdRange: { min: number; max?: number },
    ) => {
      const { validationSuccess, response } = await query.run(
        serverRoute.message.read,
        readMessagesByCreatedRange(roomId, createdRange),
      );
      if (!validationSuccess) return { success: false as const };
      return { success: true as const, data: response as MessageReadType };
    };
    return { indexRange, createdRange };
  };

  return { run, isLoading: query.isLoading };
}

export function useQuerySendMessage() {
  const query = useQuery({ shouldCheckAuth: true, schema: messageSendSchema });

  const run = async (roomId: RoomId, content: SendMessageFormType) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.message.send,
      sendMessage(roomId, content),
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as MessageSendType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryUpdateMessage() {
  const query = useQuery({
    shouldCheckAuth: true,
    schema: messageUpdateSchema,
  });

  const run = async (
    roomId: RoomId,
    prevCreated: MessageType["created"],
    content: SendMessageFormType,
  ) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.message.update,
      updateMessage(roomId, prevCreated, content),
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as MessageUpdateType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryDeleteMessage() {
  const query = useQuery({
    shouldCheckAuth: true,
    schema: messageDeleteSchema,
  });

  const run = async (roomId: RoomId, created: MessageType["created"]) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.message.remove,
      deleteMessage(roomId, created),
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as MessageDeleteType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryCompareMessages() {
  const query = useQuery({
    shouldCheckAuth: true,
    schema: messageCompareSchema,
  });

  const run = async (roomId: RoomId, toCompare: MessageDates[]) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.message.compare,
      compareMessages(roomId, toCompare),
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as MessageCompareType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryCreateRoom() {
  const query = useQuery({ shouldCheckAuth: true, schema: roomCreateSchema });

  const run = async (
    name: string,
    type: Omit<RoomType["type"], "service">,
    about: string,
  ) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.room.create,
      {
        roomInfo: {
          name,
          type,
          about,
        },
      },
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as RoomCreateType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryUpdateRoom() {
  const query = useQuery({ shouldCheckAuth: true, schema: roomUpdateSchema });

  const run = async (roomId: RoomId, info: RoomInfoUpdate) => {
    // TODO make request validation factory
    const request = updateRoomValidator(info);
    if (!request.success) return { success: false as const };

    const { validationSuccess, response } = await query.run(
      serverRoute.room.updateInfo,
      {
        roomId,
        info: request.data,
      },
    );
    if (!validationSuccess) return { success: false as const };
    return { success: false as const, data: response as RoomUpdateType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryDeleteRoom() {
  const query = useQuery({ shouldCheckAuth: true, schema: roomDeleteSchema });

  const run = async (roomId: RoomId) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.room.delete,
      {
        roomId,
      },
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as RoomDeleteType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryLeaveRoom() {
  const query = useQuery({ shouldCheckAuth: true, schema: roomLeaveSchema });

  const run = async (roomId: RoomId) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.room.leave,
      {
        roomId,
      },
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as RoomDeleteType };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryJoinRoom() {
  const query = useQuery({ shouldCheckAuth: true, schema: roomJoinSchema });

  const run = async (roomId: RoomId) => {
    const { validationSuccess, response } = await query.run(
      serverRoute.room.join,
      {
        roomId,
      },
    );
    if (!validationSuccess) return { success: false as const };
    return { success: true as const, data: response as RoomJoinType };
  };

  return { run, isLoading: query.isLoading };
}
