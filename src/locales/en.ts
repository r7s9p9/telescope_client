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

export const langPanel = {
  PROFILE_LABEL: "Profile" as const,
  ROOMS_LABEL: "Rooms" as const,
  FRIENDS_LABEL: "Friends" as const,
  SETTINGS_LABEL: "Settings" as const,
};

export const langProfile = {
  TITLE_SELF: "Your profile" as const,
  TITLE_USER: (username: string) => `@${username} profile`,
  TITLE_NOT_FOUND: "Not found" as const,

  DETAILS_NOT_FOUND: "This profile does not exist or has been deleted" as const,

  USERNAME_LABEL: "Username" as const,
  NAME_LABEL: "Name" as const,
  BIO_LABEL: "Bio" as const,

  INFO_HIDDEN: "Hidden by user privacy settings" as const,

  UPDATE_ACTION: "Update" as const,
  GO_BACK_ACTION: "Go back" as const,
};

export const langProfileNotification = {
  SUCCESS: "Profile information updated successfully" as const,
  INCORRECT_USERID:
    "Such a profile cannot exist. You probably followed the wrong link" as const,
};

export const langRooms = {
  TITLE: "Rooms" as const,
  BUTTON_CREATE_LABEL: "Create room" as const,

  SEARCH_PLACEHOLDER: "Search ..." as const,
  NO_ROOMS_FOUND: "No rooms found" as const,
  FOUND_ITEM_NO_MEMBERS: "No members" as const,
  FOUND_ITEM_ONE_MEMBER: "1 member" as const,
  FOUND_ITEM_MEMBERS: (count: number) => `${count} members`,

  NO_ROOMS_HEAD: "You don't have any rooms yet" as const,
  NO_ROOMS_TAIL:
    "Create your own room or find a public room and join it" as const,
  NO_LAST_MESSAGE: "There is no messages" as const,

  LAST_MESSAGE_AUTHOR_YOU: "You:" as const,
  LAST_MESSAGE_AUTHOR_SERVICE: "Sevice:" as const,
};

export const langTopBar = {
  NO_MEMBERS_TEXT: "no members" as const,
  ONE_MEMBER_TEXT: "1 member" as const,
  MEMBERS_TEXT: "members" as const,
  ROOM_TEXT: "room" as const,
};

export const langBottomBar = {
  JOIN_ACTION: "Join" as const,

  TITLE_EDIT: "Edit message" as const,
  LABEL_CLOSE_EDIT: "Close editing" as const,
  LABEL_SEND: "Send message" as const,
};

export const langBottomBarNotification = {
  UPDATE_MESSAGE_NO_RIGHT:
    "You don't have enough rights to update this message" as const,
  UPDATE_MESSAGE_FAIL:
    "The message could not be updated. Perhaps the room does not exist or is temporarily unavailable" as const,
  SEND_MESSAGE_NO_RIGHT: "You don't have enough rights" as const,
  SEND_MESSAGE_FAIL:
    "The message could not be sent. Perhaps the room does not exist or is temporarily unavailable" as const,
};

export const langMessages = {
  NO_MESSAGES_TEXT: "There are no messages here yet" as const,
  SELF_MESSAGE_TEXT: "You" as const,
  MESSAGE_EDITED_TEXT: "edited" as const,
  CONTEXT_MENU_REPLY_ACTION: "Reply" as const,
  CONTEXT_MENU_EDIT_ACTION: "Edit" as const,
  CONTEXT_MENU_COPY_ACTION: "Copy" as const,
  CONTEXT_MENU_DELETE_ACTION: "Delete" as const,
};

export const langMessagesNotification = {
  DELETE_NO_RIGHT:
    "You don't have enough rights to delete this message" as const,
  DELETE_FAIL:
    "The message could not be deleted. Perhaps the room does not exist or is temporarily unavailable" as const,
};

export const langCreateRoom = {
  POPUP_TITLE: "Create a room" as const,
  NAME_LABEL: "Name" as const,
  TYPE_LABEL: "Type" as const,
  ABOUT_LABEL: "About" as const,
  TYPE_PUBLIC_ITEM: "Public" as const,
  TYPE_PRIVATE_ITEM: "Private" as const,
  TYPE_SINGLE_ITEM: "Single" as const,
  CREATE_ACTION: "Create" as const,
};

export const langActions = {
  SHOW_LABEL: "Actions" as const,

  ITEM_COPY_ACTION: "Copy link" as const,

  ITEM_LEAVE_ROOM_ACTION: "Leave room" as const,
  LEAVE_POPUP_QUESTION: "Are you sure you want to leave the room?" as const,
  LEAVE_POPUP_CONFIRM: "Leave" as const,
  LEAVE_POPUP_CANCEL: "Cancel" as const,

  ITEM_DELETE_ROOM_ACTION: "Delete room" as const,
  DELETE_POPUP_QUESTION: "Are you sure you want to delete this room?" as const,
  DELETE_POPUP_CONFIRM: "Delete" as const,
  DELETE_POPUP_CANCEL: "Cancel" as const,
};

export const langActionsNotification = {
  LEAVE_SUCCESS: "You have successfully left the room" as const,
  DELETE_SUCCESS: "You have successfully deleted this room" as const,
};

export const langInfo = {
  TITLE: "Info" as const,
  BUTTON_CLOSE_LABEL: "Close info" as const,
};

export const langProperties = {
  NAME_LABEL: "Name" as const,
  ABOUT_LABEL: "About" as const,
  TYPE_LABEL: "Type" as const,
  CREATOR_LABEL: "Creator" as const,
  CREATED_LABEL: "Created" as const,

  TYPE_PUBLIC_OPTION: "Public" as const,
  TYPE_PRIVATE_OPTION: "Private" as const,
  TYPE_SINGLE_OPTION: "Single" as const,

  BUTTON_EDIT_LABEL: "Edit" as const,
  BUTTON_CANCEL_LABEL: "Cancel edit" as const,
  BUTTON_UPDATE_LABEL: "Update info" as const,
};

export const langMembers = {
  TITLE: "Members" as const,
  NO_MEMBERS: "There are no members in this room yet" as const,
  NAME_HIDDEN: "Name hidden" as const,
  STATUS_YOU: "you" as const,
  STATUS_INVISIBLE: "invisible" as const,
  STATUS_ONLINE: "online" as const,
  STATUS_OFFLINE: "offline" as const,
  LAST_SEEN_TEXT: (str: string) => `Last seen: ${str}` as const,

  CONTEXT_MENU_PROFILE_ACTION: "Go to profile" as const,
  CONTEXT_MENU_COPY_ACTION: "Copy username" as const,
  CONTEXT_MENU_KICK_ACTION: "Kick" as const,
  CONTEXT_MENU_BAN_ACTION: "Ban" as const,
};

export const langMembersNotification = {
  COPY_SUCCESS: "Username copied to clipboard" as const,
  KICK_FAIL: (username: string) =>
    `User ${username} cannot be kicked. Perhaps he is no longer a member of the room` as const,
  KICK_NO_RIGHT: "You don't have enough rights" as const,
  KICK_SUCCESS: (username: string) =>
    `User ${username} successfully kicked out of the room` as const,
  BAN_NO_RIGHT: "You don't have enough rights" as const,
  BAN_FAIL: (username: string) =>
    `User ${username} cannot be banned. Perhaps he is no longer a member of the room` as const,
  BAN_SUCCESS: (username: string) =>
    `User ${username} successfully banned from this room` as const,
};

export const langBlocked = {
  POPUP_TITLE: "Blocked users" as const,
  BUTTON_REFRESH_LABEL: "Refresh" as const,
  NO_BLOCKED: "There are no blocked users in this room" as const,

  STATUS_INVISIBLE: "invisible" as const,
  STATUS_ONLINE: "online" as const,
  STATUS_OFFLINE: "offline" as const,
  LAST_SEEN_TEXT: (str: string) => `Last seen: ${str}` as const,

  CONTEXT_MENU_PROFILE_ACTION: "Go to profile" as const,
  CONTEXT_MENU_COPY_ACTION: "Copy username" as const,
  CONTEXT_MENU_UNBAN_ACTION: "Unban" as const,
};

export const langBlockedNotification = {
  COPY_SUCCESS: "Username copied to clipboard" as const,
  UNBAN_NO_RIGHT: "You don't have enough rights" as const,
  UNBAN_FAIL: (username: string) =>
    `User ${username} cannot be unbanned. Perhaps he is no longer banned` as const,
  UNBAN_SUCCESS: (username: string) =>
    `User ${username} successfully unbanned from this room` as const,
};

export const langInvite = {
  POPUP_TITLE: "Invite users" as const,
  SEARCH_PLACEHOLDER: "Enter user nickname..." as const,
  NO_USERS: "There are no users for this request" as const,

  NAME_HIDDEN: "Name hidden" as const,
  STATUS_INVISIBLE: "invisible" as const,
  STATUS_ONLINE: "online" as const,
  STATUS_OFFLINE: "offline" as const,
  LAST_SEEN_TEXT: (str: string) => `Last seen: ${str}` as const,

  CONTEXT_MENU_PROFILE_ACTION: "Go to profile" as const,
  CONTEXT_MENU_COPY_ACTION: "Copy username" as const,
  CONTEXT_MENU_INVITE_ACTION: "Invite" as const,
};

export const langInviteNotification = {
  COPY_SUCCESS: "Username copied to clipboard" as const,
  SEARCH_TO_INVITE_NO_RIGHT: "You don't have enough rights" as const,
  INVITE_SUCCESS: (username: string) =>
    `The user ${username} was successfully invited to this room` as const,
  INVITE_NO_RIGHT: "You don't have enough rights" as const,
  INVITE_FAIL: (username: string) =>
    `User ${username} cannot be invited. Perhaps he changed his privacy settings or his account was deleted` as const,
};

export const langSettings = {
  ITEM_PROFILE: "My profile" as const,
  ITEM_PRIVACY: "Privacy" as const,
  ITEM_SESSIONS: "Sessions" as const,
  ITEM_LANG: "Language" as const,
  ITEM_LOGOUT: "Logout" as const,

  LOGOUT_POPUP_QUESTION: "Are you sure you want to log out?" as const,
  LOGOUT_POPUP_CONFIRM: "Logout" as const,
  LOGOUT_POPUP_CANCEL: "Cancel" as const,
};

export const langPrivacy = {
  TITLE_HEAD: "Privacy settings" as const,
  TITLE_TAIL: "Who can..." as const,

  ITEM_NAME: "See my name" as const,
  ITEM_BIO: "See my bio" as const,
  ITEM_LAST_SEEN: "See when I was online" as const,
  ITEM_PROFILE_PHOTOS: "See my profile photos" as const,
  ITEM_FRIENDS: "See my friends" as const,
  ITEM_CAN_BE_FRIEND: "Can be my friend" as const,
  ITEM_INVITE: "Invite me to the room" as const,

  ITEM_OPTION_EVERYBODY: "Everybody" as const,
  ITEM_OPTION_FRIENDS_OF_FRIENDS: "Friends of friends" as const,
  ITEM_OPTION_FRIENDS: "Friends" as const,
  ITEM_OPTION_NOBODY: "Nobody" as const,

  BUTTON_UPDATE_LABEL: "Update" as const,
  BUTTON_GO_BACK_LABEL: "Go back" as const,
};

export const langPrivacyNotification = {
  SUCCESS: "Profile information updated successfully" as const,
};

export const langSessions = {
  TITLE: "Sessions" as const,
  NO_CURRENT_SESSION:
    "Sorry, but this functionality is currently unavailable. Please try again later" as const,
  DEVICE_ITEM: "Device" as const,
  BROWSER_ITEM: "Browser" as const,
  LAST_SEEN_TEXT: (str: string) => `Last seen: ${str}` as const,
  STATUS_THIS_DEVICE: "This device" as const,
  STATUS_BLOCKED: "Blocked" as const,
  STATUS_ONLINE: "Online" as const,

  BUTTON_DELETE_LABEL: "Delete session" as const,
  DELETE_POPUP_QUESTION:
    "Are you sure you want to delete this session?" as const,
  DELETE_POPUP_CONFIRM: "Delete" as const,
  DELETE_POPUP_CANCEL: "Cancel" as const,

  BUTTON_GO_BACK_LABEL: "Go back" as const,
};

export const langSessionsNotification = {
  SESSION_DELETE_FAIL:
    "An error occurred when trying to sign out of your account. Please try again or reload the page" as const,
  SESSION_DELETE_SUCCESS:
    "The selected session was successfully deleted" as const,
};

export const langNoMatch = {
  TITLE: "Error 404" as const,
  SUBTITLE: "Apparently this page does not exist" as const,
  MESSAGE_HEAD: "However, you can always go" as const,
  MESSAGE_TAIL: "home" as const,
};

export const langErrorBoundary = {
  TITLE: "Something went wrong" as const,
  MESSAGE:
    "Refresh the page, and if this does not help and the problem persists, write to us by email" as const,
};
