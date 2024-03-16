import { RoomId } from "../../types";
import {
  readAccountBody,
  readMessages,
  readRoomList,
  serverRoute,
} from "./api.constants";
import {
  accountReadSchema,
  messageReadSchema,
  roomListSchema,
} from "./api.schema";

const fetcher = async (
  route: (typeof serverRoute)["account"]["read" | "update"],
  body: object,
) => {
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

export async function fetchSelfAccount() {
  const result = await fetcher(
    serverRoute.account.read,
    readAccountBody("self"),
  );
  const isLogged = isAuth(result.status);
  if (!isLogged) return { success: true as const, isLogged: false as const };

  const { success, data } = accountDataValidator(result.payload);
  if (!success) return { success: false as const, isLogged: true as const };
  return { success: true as const, isLogged: true as const, data };
}

function roomListDataValidator(payload: object) {
  const result = roomListSchema.safeParse(payload);

  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

export async function fetchRoomList(range: { min: string; max: string }) {
  const result = await fetcher(
    serverRoute.room.getRoomList,
    readRoomList(range),
  );

  const isLogged = isAuth(result.status);
  if (!isLogged) return { success: true as const, isLogged: false as const };
  const { success, data } = roomListDataValidator(result.payload);

  if (!success) return { success: false as const, isLogged: true as const };
  return { success: true as const, isLogged: true as const, data };
}

function messagesValidator(payload: object) {
  const result = messageReadSchema.safeParse(payload);

  if (!result.success) return { success: false as const, error: result.error };
  return { success: true as const, data: result.data };
}

export async function fetchReadMessages(
  roomId: RoomId,
  range: { minCreated: string; maxCreated: string },
) {
  const result = await fetcher(
    serverRoute.message.read,
    readMessages(roomId, range),
  );

  const isLogged = isAuth(result.status);
  if (!isLogged) return { success: true as const, isLogged: false as const };
  const { success, data } = messagesValidator(result.payload);

  if (!success) return { success: false as const, isLogged: true as const };
  return { success: true as const, isLogged: true as const, data };
}

export async function fetchAddMessage(payload: {
  roomId: RoomId;
  message: { replyTo?: string; content: { text: string } };
}) {
  const result = await fetcher(serverRoute.message.add, payload);

  const isLogged = isAuth(result.status);
  if (!isLogged) return { success: true as const, isLogged: false as const };
  //const { success, data } = messagesValidator(result.payload);

  //if (!success) return { success: false as const, isLogged: true as const };
  //return { success: true as const, isLogged: true as const, data };
  console.log(result);
}
