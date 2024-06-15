import {
  CodeRequestType,
  CodeResponseType,
  CreateRoomRequestType,
  CreateRoomResponseType,
  DeleteRoomRequestType,
  DeleteRoomResponseType,
  LeaveRoomResponseType,
  LoginRequestType,
  LoginResponseType,
  ReadAccountRequestType,
  ReadAccountResponseType,
  ReadRoomInfoRequestType,
  ReadRoomInfoResponseType,
  ReadRoomsRequestType,
  ReadRoomsResponseType,
  RegisterRequestType,
  RegisterResponseType,
  SearchRoomsRequestType,
  SearchRoomsResponseType,
  UpdateAccountRequestType,
  UpdateAccountResponseType,
  UpdateRoomRequestType,
  UpdateRoomResponseType,
  codeRequestSchema,
  codeResponseSchema,
  createRoomRequestSchema,
  createRoomResponseSchema,
  deleteRoomRequestSchema,
  deleteRoomResponseSchema,
  leaveRoomRequestSchema,
  leaveRoomResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
  readAccountRequestSchema,
  readAccountResponseSchema,
  readRoomInfoRequestSchema,
  readRoomInfoResponseSchema,
  readRoomsRequestSchema,
  readRoomsResponseSchema,
  registerRequestSchema,
  registerResponseSchema,
  searchRoomsRequestSchema,
  searchRoomsResponseSchema,
  updateAccountRequestSchema,
  updateAccountResponseSchema,
  updateRoomRequestSchema,
  updateRoomResponseSchema,
  LeaveRoomRequestType,
  JoinRoomResponseType,
  joinRoomResponseSchema,
  JoinRoomRequestType,
  joinRoomRequestSchema,
  getRoomMembersResponseSchema,
  GetRoomsMembersResponseType,
  getRoomMembersRequestSchema,
  GetRoomMembersRequestType,
  RoomKickMemberResponseType,
  roomKickMemberResponseSchema,
  roomKickMemberRequestSchema,
  RoomKickMemberRequestType,
  RoomBanMemberResponseType,
  roomBanMemberResponseSchema,
  roomBanMemberRequestSchema,
  RoomBanMemberRequestType,
  roomUnbanMemberResponseSchema,
  RoomUnbanMemberResponseType,
  roomUnbanMemberRequestSchema,
  RoomUnbanMemberRequestType,
  GetRoomBlockedUsersResponseType,
  getRoomBlockedUsersRequestSchema,
  getRoomBlockedUsersResponseSchema,
  GetRoomBlockedUsersRequestType,
  RoomSearchUsersToInviteResponseType,
  roomSearchUsersToInviteResponseSchema,
  roomSearchUsersToInviteRequestSchema,
  RoomSearchUsersToInviteRequestType,
  roomInviteUserRequestSchema,
  roomInviteUserResponseSchema,
  RoomInviteUserRequestType,
  RoomInviteUserResponseType,
  getMessagesResponseSchema,
  GetMessagesResponseType,
  GetMessagesRequestType,
  getMessagesRequestSchema,
  sendMessageResponseSchema,
  SendMessageResponseType,
  sendMessageRequestSchema,
  SendMessageRequestType,
  updateMessageResponseSchema,
  UpdateMessageRequestType,
  UpdateMessageResponseType,
  updateMessageRequestSchema,
  deleteMessageRequestSchema,
  deleteMessageResponseSchema,
  DeleteMessageResponseType,
  DeleteMessageRequestType,
  compareMessagesRequestSchema,
  compareMessagesResponseSchema,
  CompareMessagesRequestType,
  CompareMessagesResponseType,
} from "./api.schema";
import { useQuery } from "./api";
import { serverRoute } from "./api.constants";
import { ZodError } from "zod";
import { langError } from "../../locales/en";

function parseZodError(error: ZodError<unknown>) {
  // Returns the name of the last path variable as a key
  // The key value is assigned from the message
  const messages = Object.create(null);
  if (error.issues) {
    for (const issue of error.issues) {
      const key = issue.path.at(-1);
      if (key) messages[key] = issue.message;
    }
  }
  return messages as { [key: string]: string | undefined };
}

export function useQueryLogin() {
  const query = useQuery({
    disableRequestValidationLogging: true,
    requestSchema: loginRequestSchema,
    responseSchema: loginResponseSchema,
  });

  const run = async (payload: LoginRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.auth.login,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? parseZodError(requestError as ZodError)
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as LoginResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryCode() {
  const query = useQuery({
    disableRequestValidationLogging: true,
    requestSchema: codeRequestSchema,
    responseSchema: codeResponseSchema,
  });

  const run = async (payload: CodeRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.auth.code,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? parseZodError(requestError as ZodError)
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as CodeResponseType,
    };
  };
  return { run, isLoading: query.isLoading };
}

export function useQueryRegister() {
  const query = useQuery({
    disableRequestValidationLogging: true,
    requestSchema: registerRequestSchema,
    responseSchema: registerResponseSchema,
  });
  const run = async (payload: RegisterRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.auth.register,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? parseZodError(requestError as ZodError)
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as RegisterResponseType,
    };
  };
  return { run, isLoading: query.isLoading };
}

// export function useQueryLogout() {
//   const query = useQuery({ responseSchema: logoutSchema });

//   const run = async (sessionId: string | "self") => {
//     const { success, response } = await query.run(serverRoute.session.remove, {
//       sessionId: sessionId,
//     });
//     if (!success) return { success: false as const };
//     return { success: true as const, data: response as LogoutType };
//   };

//   return { run, isLoading: query.isLoading };
// }

export function useQueryAccount() {
  const query = useQuery({
    requestSchema: readAccountRequestSchema,
    responseSchema: readAccountResponseSchema,
  });

  const run = async (payload: ReadAccountRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.account.read,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as ReadAccountResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryUpdateAccount() {
  const query = useQuery({
    disableRequestValidationLogging: true,
    requestSchema: updateAccountRequestSchema,
    responseSchema: updateAccountResponseSchema,
  });

  const run = async (payload: UpdateAccountRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.account.update,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? parseZodError(requestError as ZodError)
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as UpdateAccountResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryRooms() {
  const query = useQuery({
    requestSchema: readRoomsRequestSchema,
    responseSchema: readRoomsResponseSchema,
  });

  const run = async (payload: ReadRoomsRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.getRoomList,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as ReadRoomsResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryRoomInfo() {
  const query = useQuery({
    requestSchema: readRoomInfoRequestSchema,
    responseSchema: readRoomInfoResponseSchema,
  });

  const run = async (payload: ReadRoomInfoRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.readInfo,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as ReadRoomInfoResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQuerySearchRooms() {
  const query = useQuery({
    disableRequestValidationLogging: true,
    requestSchema: searchRoomsRequestSchema,
    responseSchema: searchRoomsResponseSchema,
  });

  const run = async (payload: SearchRoomsRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.search,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? parseZodError(requestError as ZodError)
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as SearchRoomsResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryCreateRoom() {
  const query = useQuery({
    disableRequestValidationLogging: true,
    requestSchema: createRoomRequestSchema,
    responseSchema: createRoomResponseSchema,
  });

  const run = async (payload: CreateRoomRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.create,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? parseZodError(requestError as ZodError)
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as CreateRoomResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryUpdateRoom() {
  const query = useQuery({
    disableRequestValidationLogging: true,
    requestSchema: updateRoomRequestSchema,
    responseSchema: updateRoomResponseSchema,
  });

  const run = async (payload: UpdateRoomRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.updateInfo,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? parseZodError(requestError as ZodError)
          : undefined,
        responseError,
      };
    }

    return {
      success: false as const,
      response: response as UpdateRoomResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryDeleteRoom() {
  const query = useQuery({
    requestSchema: deleteRoomRequestSchema,
    responseSchema: deleteRoomResponseSchema,
  });

  const run = async (payload: DeleteRoomRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.delete,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as DeleteRoomResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryLeaveRoom() {
  const query = useQuery({
    requestSchema: leaveRoomRequestSchema,
    responseSchema: leaveRoomResponseSchema,
  });

  const run = async (payload: LeaveRoomRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.leave,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as LeaveRoomResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryJoinRoom() {
  const query = useQuery({
    requestSchema: joinRoomRequestSchema,
    responseSchema: joinRoomResponseSchema,
  });

  const run = async (payload: JoinRoomRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.join,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as JoinRoomResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryGetMembers() {
  const query = useQuery({
    requestSchema: getRoomMembersRequestSchema,
    responseSchema: getRoomMembersResponseSchema,
  });

  const run = async (payload: GetRoomMembersRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.getMembers,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as GetRoomsMembersResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryKickMember() {
  const query = useQuery({
    requestSchema: roomKickMemberRequestSchema,
    responseSchema: roomKickMemberResponseSchema,
  });

  const run = async (payload: RoomKickMemberRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.kick,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as RoomKickMemberResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryBanMember() {
  const query = useQuery({
    requestSchema: roomBanMemberRequestSchema,
    responseSchema: roomBanMemberResponseSchema,
  });

  const run = async (payload: RoomBanMemberRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.ban,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as RoomBanMemberResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryUnbanUserInRoom() {
  const query = useQuery({
    requestSchema: roomUnbanMemberRequestSchema,
    responseSchema: roomUnbanMemberResponseSchema,
  });

  const run = async (payload: RoomUnbanMemberRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.unban,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as RoomUnbanMemberResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryGetBlockedUsersInRoom() {
  const query = useQuery({
    requestSchema: getRoomBlockedUsersRequestSchema,
    responseSchema: getRoomBlockedUsersResponseSchema,
  });

  const run = async (payload: GetRoomBlockedUsersRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.blockedUsers,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as GetRoomBlockedUsersResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQuerySearchUsersToInvite() {
  const query = useQuery({
    disableRequestValidationLogging: true,
    requestSchema: roomSearchUsersToInviteRequestSchema,
    responseSchema: roomSearchUsersToInviteResponseSchema,
  });

  const run = async (payload: RoomSearchUsersToInviteRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.searchUsersToInvite,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? parseZodError(requestError as ZodError)
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as RoomSearchUsersToInviteResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryInviteUser() {
  const query = useQuery({
    requestSchema: roomInviteUserRequestSchema,
    responseSchema: roomInviteUserResponseSchema,
  });

  const run = async (payload: RoomInviteUserRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.room.invite,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as RoomInviteUserResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryReadMessages() {
  const query = useQuery({
    requestSchema: getMessagesRequestSchema,
    responseSchema: getMessagesResponseSchema,
  });

  const run = async (payload: GetMessagesRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.message.read,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as GetMessagesResponseType,
    };
  };
  return { run, isLoading: query.isLoading };
}

export function useQueryCompareMessages() {
  const query = useQuery({
    requestSchema: compareMessagesRequestSchema,
    responseSchema: compareMessagesResponseSchema,
  });

  const run = async (payload: CompareMessagesRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.message.compare,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as CompareMessagesResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQuerySendMessage() {
  const query = useQuery({
    requestSchema: sendMessageRequestSchema,
    responseSchema: sendMessageResponseSchema,
  });

  const run = async (payload: SendMessageRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.message.send,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? parseZodError(requestError as ZodError)
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as SendMessageResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryUpdateMessage() {
  const query = useQuery({
    disableRequestValidationLogging: true,
    requestSchema: updateMessageRequestSchema,
    responseSchema: updateMessageResponseSchema,
  });

  const run = async (payload: UpdateMessageRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.message.update,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? parseZodError(requestError as ZodError)
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as UpdateMessageResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}

export function useQueryDeleteMessage() {
  const query = useQuery({
    requestSchema: deleteMessageRequestSchema,
    responseSchema: deleteMessageResponseSchema,
  });

  const run = async (payload: DeleteMessageRequestType) => {
    const { success, response, requestError, responseError } = await query.run(
      serverRoute.message.remove,
      payload,
    );

    if (!success) {
      return {
        success: false as const,
        requestError: requestError
          ? langError.REQUEST_COMMON_MESSAGE
          : undefined,
        responseError,
      };
    }

    return {
      success: true as const,
      response: response as DeleteMessageResponseType,
    };
  };

  return { run, isLoading: query.isLoading };
}
