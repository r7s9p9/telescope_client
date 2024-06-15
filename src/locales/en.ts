export const langError = {
  REQUEST_COMMON_MESSAGE:
    "Error on the client side. Reload the page if the problem persists." as const,
  RESPONSE_COMMON_MESSAGE:
    "This functionality is temporarily unavailable. Please try again later." as const,
  UNKNOWN_MESSAGE: "Something went wrong. Please try again later." as const,
};

export const langAuth = {
  INCORRECT_CREDENTIALS:
    "You entered an incorrect username or password" as const,
  BAD_CODE: "You entered an incorrect code" as const,
  EMAIL_EXISTS: "Email already exists" as const,
  USERNAME_EXISTS: "Username already exists" as const,
  OUTDATED_EMAIL: "Email address is no longer valid" as const,
  REGISTER_SUCCESS: "You have successfully registered! Please sign in" as const,
  LOGGED_OUT: "You are logged out of your account" as const,
  SESSION_BLOCKED:
    "This session has been blocked - either from another device, or you have not visited your account from this device for a long time. Please login.",
};

export const langProfile = {
  SUCCESS: "Profile information updated successfully" as const,
};

export const langRoom = {
  DELETE_SUCCESS: "You have successfully deleted this room",
  LEAVE_SUCCESS: "You have successfully left the room",
  KICK_FAIL: (username: string) =>
    `User ${username} cannot be kicked. Perhaps he is no longer a member of the room`,
  KICK_NO_RIGHT: "You don't have enough rights",
  KICK_SUCCESS: (username: string) =>
    `User ${username} successfully kicked out of the room`,
  COPY_USERNAME: "Username copied to clipboard",
  BAN_NO_RIGHT: "You don't have enough rights",
  BAN_FAIL: (username: string) =>
    `User ${username} cannot be banned. Perhaps he is no longer a member of the room`,
  BAN_SUCCESS: (username: string) =>
    `User ${username} successfully banned from this room`,
  UNBAN_NO_RIGHT: "You don't have enough rights",
  UNBAN_FAIL: (username: string) =>
    `User ${username} cannot be unbanned. Perhaps he is no longer banned`,
  UNBAN_SUCCESS: (username: string) =>
    `User ${username} successfully unbanned from this room`,
  SEARCH_TO_INVITE_NO_RIGHT: "You don't have enough rights",
  INVITE_SUCCESS: (username: string) =>
    `The user ${username} was successfully invited to this room`,
  INVITE_NO_RIGHT: "You don't have enough rights",
  INVITE_FAIL: (username: string) =>
    `User ${username} cannot be invited. Perhaps he changed his privacy settings or his account was deleted`,
  SEND_MESSAGE_NO_RIGHT: "You don't have enough rights",
  SEND_MESSAGE_FAIL:
    "The message could not be sent. Perhaps the room does not exist or is temporarily unavailable",
  UPDATE_MESSAGE_NO_RIGHT:
    "You don't have enough rights to update this message",
  UPDATE_MESSAGE_FAIL:
    "The message could not be updated. Perhaps the room does not exist or is temporarily unavailable",
  DELETE_MESSAGE_NO_RIGHT:
    "You don't have enough rights to delete this message",
  DELETE_MESSAGE_FAIL:
    "The message could not be deleted. Perhaps the room does not exist or is temporarily unavailable",
};
