export const langError = {
  REQUEST_COMMON_MESSAGE:
    "Error on the client side. Reload the page if the problem persists" as const,
  RESPONSE_COMMON_MESSAGE:
    "This functionality is temporarily unavailable. Please try again later" as const,
  UNKNOWN_MESSAGE: "Something went wrong. Please try again later" as const,
};

export const langAuth = {
  EMAIL_LABEL: "Email" as const,
  PASSWORD_LABEL: "Password" as const,
  USERNAME_LABEL: "Username" as const,
  CODE_LABEL: "Code" as const,

  SIGNIN_TITLE: "Login to account" as const,
  SIGNUP_TITLE: "Create an account" as const,
  CODE_TITLE: "Almost done" as const,
  CODE_MESSAGE:
    "Please enter the verification code sent to your telescope account " as const,

  GO_TO_SIGN_UP_TITLE: "Need an account?" as const,
  GO_TO_SIGN_UP_TEXT: "Sign-up" as const,
  GO_TO_SIGN_IN_TITLE: "Need to log in?" as const,
  GO_TO_SIGN_IN_TEXT: "Sign-in" as const,

  BACK_FROM_CODE_TITLE: "Not your account?" as const,
  BACK_FROM_CODE_TEXT: "Return to login" as const,

  SIGN_IN_ACTION: "Sign-in" as const,
  SIGN_UP_ACTION: "Sign-up" as const,
  CODE_ACTION: "Proceed" as const,
};

export const langAuthNotification = {
  INCORRECT_CREDENTIALS:
    "You entered an incorrect username or password" as const,
  BAD_CODE: "You entered an incorrect code" as const,
  EMAIL_EXISTS: "Email already exists" as const,
  USERNAME_EXISTS: "Username already exists" as const,
  OUTDATED_EMAIL: "Email address is no longer valid" as const,
  REGISTER_SUCCESS: "You have successfully registered! Please sign in" as const,
  LOGGED_OUT: "You are logged out of your account" as const,
  SESSION_BLOCKED:
    "This session has been blocked - either from another device, or you have not visited your account from this device for a long time. Please login" as const,
};

export const langProfile = {
  SUCCESS: "Profile information updated successfully" as const,
  INCORRECT_USERID:
    "Such a profile cannot exist. You probably followed the wrong link" as const,
};

export const langRoom = {
  DELETE_SUCCESS: "You have successfully deleted this room" as const,
  LEAVE_SUCCESS: "You have successfully left the room" as const,
  KICK_FAIL: (username: string) =>
    `User ${username} cannot be kicked. Perhaps he is no longer a member of the room` as const,
  KICK_NO_RIGHT: "You don't have enough rights" as const,
  KICK_SUCCESS: (username: string) =>
    `User ${username} successfully kicked out of the room` as const,
  COPY_USERNAME: "Username copied to clipboard" as const,
  BAN_NO_RIGHT: "You don't have enough rights" as const,
  BAN_FAIL: (username: string) =>
    `User ${username} cannot be banned. Perhaps he is no longer a member of the room` as const,
  BAN_SUCCESS: (username: string) =>
    `User ${username} successfully banned from this room` as const,
  UNBAN_NO_RIGHT: "You don't have enough rights" as const,
  UNBAN_FAIL: (username: string) =>
    `User ${username} cannot be unbanned. Perhaps he is no longer banned` as const,
  UNBAN_SUCCESS: (username: string) =>
    `User ${username} successfully unbanned from this room` as const,
  SEARCH_TO_INVITE_NO_RIGHT: "You don't have enough rights" as const,
  INVITE_SUCCESS: (username: string) =>
    `The user ${username} was successfully invited to this room` as const,
  INVITE_NO_RIGHT: "You don't have enough rights" as const,
  INVITE_FAIL: (username: string) =>
    `User ${username} cannot be invited. Perhaps he changed his privacy settings or his account was deleted` as const,
  SEND_MESSAGE_NO_RIGHT: "You don't have enough rights" as const,
  SEND_MESSAGE_FAIL:
    "The message could not be sent. Perhaps the room does not exist or is temporarily unavailable" as const,
  UPDATE_MESSAGE_NO_RIGHT:
    "You don't have enough rights to update this message" as const,
  UPDATE_MESSAGE_FAIL:
    "The message could not be updated. Perhaps the room does not exist or is temporarily unavailable" as const,
  DELETE_MESSAGE_NO_RIGHT:
    "You don't have enough rights to delete this message" as const,
  DELETE_MESSAGE_FAIL:
    "The message could not be deleted. Perhaps the room does not exist or is temporarily unavailable" as const,
};

export const langSession = {
  SESSION_DELETE_FAIL:
    "An error occurred when trying to sign out of your account. Please try again or reload the page" as const,
  SESSION_DELETE_SUCCESS:
    "The selected session was successfully deleted" as const,
};
