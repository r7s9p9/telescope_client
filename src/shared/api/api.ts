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
} from "./api.schema";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants";

const fetcher = async (route: string, body: any) => {
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

function useQuery() {
  const [isLoading, setIsLoading] = useState(false);

  const run = async (route: string, body: any) => {
    setIsLoading(true);
    const response = await fetcher(route, body);
    setIsLoading(false);
    return { response, request: { route, body } };
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

function accountDataValidator(payload: object) {
  const result = accountReadSchema.safeParse(payload);

  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

function roomsValidator(payload: object) {
  const result = roomsSchema.safeParse(payload);
  console.log(result);
  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

function readMessagesValidator(payload: object) {
  const result = messageReadSchema.safeParse(payload);

  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

function sendMessageValidator(payload: object) {
  const result = messageSendSchema.safeParse(payload);

  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

function updateMessageValidator(payload: object) {
  const result = messageUpdateSchema.safeParse(payload);

  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

function deleteMessageValidator(payload: object) {
  const result = messageDeleteSchema.safeParse(payload);

  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

function compareMessagesValidator(payload: object) {
  const result = messageCompareSchema.safeParse(payload);

  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

export function useQuerySelfAccount() {
  const query = useQuery();
  const navigate = useNavigate();

  const run = async () => {
    const { response } = await query.run(
      serverRoute.account.read,
      readAccountBody("self"),
    );
    const isLogged = isAuth(response.status);
    if (!isLogged) {
      navigate(
        { pathname: routes.login.path },
        // { state: { isLoggedOut: true } }, // need other value for !isLogged
      );
    }

    const { success, data } = accountDataValidator(response.payload);

    if (!success) return { success: false as const };
    return { success: true as const, data };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryLogout() {
  const query = useQuery();

  const run = async (sessionId: string | "self") => {
    const { response } = await query.run(serverRoute.session.remove, {
      sessionId: sessionId,
    });
    return { success: !!response.payload.success };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryRooms() {
  const query = useQuery();
  const navigate = useNavigate();

  const run = async (range: { min: number; max: number }) => {
    const { response } = await query.run(
      serverRoute.room.getRoomList,
      readRoomList(range),
    );

    const isLogged = isAuth(response.status);
    if (!isLogged) {
      navigate(
        { pathname: routes.login.path },
        // { state: { isLoggedOut: true } }, // need other value for !isLogged
      );
    }

    const { success, data } = roomsValidator(response.payload);
    if (!success) return { success: false as const };
    return { success: true as const, data };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryReadMessages() {
  const query = useQuery();
  const navigate = useNavigate();

  const run = () => {
    const indexRange = async (
      roomId: RoomId,
      indexRange: { min: number; max: number },
    ) => {
      const { response } = await query.run(
        serverRoute.message.read,
        readMessagesByIndexRange(roomId, indexRange),
      );

      const isLogged = isAuth(response.status);
      if (!isLogged) {
        navigate(
          { pathname: routes.login.path },
          // { state: { isLoggedOut: true } }, // need other value for !isLogged
        );
      }

      const { success, data } = readMessagesValidator(response.payload);

      if (!success) return { success: false as const };
      return { success: true as const, data };
    };
    const createdRange = async (
      roomId: RoomId,
      createdRange: { min: number; max?: number },
    ) => {
      const { response } = await query.run(
        serverRoute.message.read,
        readMessagesByCreatedRange(roomId, createdRange),
      );

      const isLogged = isAuth(response.status);
      if (!isLogged) {
        navigate(
          { pathname: routes.login.path },
          // { state: { isLoggedOut: true } }, // need other value for !isLogged
        );
      }

      const { success, data } = readMessagesValidator(response.payload);
      if (!success) return { success: false as const };
      return { success: true as const, data };
    };
    return { indexRange, createdRange };
  };

  return { run, isLoading: query.isLoading };
}

export function useQuerySendMessage() {
  const query = useQuery();
  const navigate = useNavigate();

  const run = async (roomId: RoomId, content: SendMessageFormType) => {
    const { response } = await query.run(
      serverRoute.message.send,
      sendMessage(roomId, content),
    );

    const isLogged = isAuth(response.status);
    if (!isLogged) {
      navigate(
        { pathname: routes.login.path },
        // { state: { isLoggedOut: true } }, // need other value for !isLogged
      );
    }

    const { success, data } = sendMessageValidator(response.payload);

    if (!success) return { success: false as const };
    return data;
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryUpdateMessage() {
  const query = useQuery();
  const navigate = useNavigate();

  const run = async (
    roomId: RoomId,
    prevCreated: MessageType["created"],
    content: SendMessageFormType,
  ) => {
    const { response } = await query.run(
      serverRoute.message.update,
      updateMessage(roomId, prevCreated, content),
    );

    const isLogged = isAuth(response.status);
    if (!isLogged) {
      navigate(
        { pathname: routes.login.path },
        // { state: { isLoggedOut: true } }, // need other value for !isLogged
      );
    }

    const { success, data } = updateMessageValidator(response.payload);

    if (!success) return { success: false as const };
    return data;
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryDeleteMessage() {
  const query = useQuery();
  const navigate = useNavigate();

  const run = async (roomId: RoomId, created: MessageType["created"]) => {
    const { response } = await query.run(
      serverRoute.message.remove,
      deleteMessage(roomId, created),
    );

    const isLogged = isAuth(response.status);
    if (!isLogged) {
      navigate(
        { pathname: routes.login.path },
        // { state: { isLoggedOut: true } }, // need other value for !isLogged
      );
    }

    const { success, data } = deleteMessageValidator(response.payload);

    if (!success) return { success: false as const };
    return data;
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryCompareMessages() {
  const query = useQuery();
  const navigate = useNavigate();

  const run = async (roomId: RoomId, toCompare: MessageDates[]) => {
    const { response } = await query.run(
      serverRoute.message.compare,
      compareMessages(roomId, toCompare),
    );

    const isLogged = isAuth(response.status);
    if (!isLogged) {
      navigate(
        { pathname: routes.login.path },
        // { state: { isLoggedOut: true } }, // need other value for !isLogged
      );
    }

    const { success, data } = compareMessagesValidator(response.payload);
    if (!success) return { success: false as const };
    return { success: true as const, data };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryLogin() {
  const query = useQuery();

  const run = async (payload: { email: string; password: string }) => {
    const { response } = await query.run(serverRoute.auth.login, payload);
    if (!response.payload.success)
      return { success: false as const, isCodeNeeded: false as const };
    if (response.payload.code)
      return { success: true as const, isCodeNeeded: true as const };
    return { success: true as const, isCodeNeeded: false as const };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryCode() {
  const query = useQuery();
  const run = async (payload: { email: string; code: string }) => {
    const { response } = await query.run(serverRoute.auth.code, payload);
    return { success: !!response.payload.success };
    // Without !! no work
  };
  return { run, isLoading: query.isLoading };
}

export function useQueryRegister() {
  const query = useQuery();
  const run = async (payload: {
    email: string;
    username: string;
    password: string;
  }) => {
    const { response } = await query.run(serverRoute.auth.register, payload);
    if (!response.payload.success) {
      if (response.payload.errorCode) {
        return {
          success: false as const,
          errorCode: response.payload.errorCode,
        };
      }
      return { success: false as const };
    }
    return { success: true as const };
  };
  return { run, isLoading: query.isLoading };
}

export function useQueryCreateRoom() {
  const query = useQuery();

  const run = async (
    name: string,
    type: Omit<RoomType["type"], "service">,
    about: string,
  ) => {
    const { response } = await query.run(serverRoute.room.create, {
      roomInfo: {
        name,
        type,
        about,
      },
    });
    if (response.payload.success)
      return {
        success: true as const,
        roomId: response.payload.roomId as RoomId,
      };
    return { success: false as const };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryUpdateRoom() {
  const query = useQuery();

  const run = async (
    roomId: RoomId,
    info: {
      name?: string;
      type?: Omit<RoomType["type"], "service">;
      about?: string;
      creatorId?: UserId;
    },
  ) => {
    const { response } = await query.run(serverRoute.room.updateInfo, {
      roomId,
      info,
    });
    if (response.payload.success)
      return {
        success: true as const,
        roomId: response.payload.roomId as RoomId,
      };
    return { success: false as const };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryDeleteRoom() {
  const query = useQuery();

  const run = async (roomId: RoomId) => {
    const { response } = await query.run(serverRoute.room.delete, {
      roomId,
    });
    if (response.payload.success)
      return {
        success: true as const,
        roomId: response.payload.roomId as RoomId,
      };
    return { success: false as const };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryLeaveRoom() {
  const query = useQuery();

  const run = async (roomId: RoomId) => {
    const { response } = await query.run(serverRoute.room.leave, {
      roomId,
    });
    if (response.payload.success)
      return {
        success: true as const,
        roomId: response.payload.roomId as RoomId,
      };
    return { success: false as const };
  };

  return { run, isLoading: query.isLoading };
}
