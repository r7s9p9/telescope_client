export const privacyRule = {
  everybody: "everybody" as const,
  nobody: "nobody" as const,
  friends: "friends" as const,
  friendOfFriends: "friendOfFriends" as const,
};

const endpoint = "http://localhost:3000" as const;

export const serverRoute = {
  // for tests only
  test: {
    401: endpoint + "/api/401",
    403: endpoint + "/api/403",
    404: endpoint + "/api/404",
    500: endpoint + "/api/500",
    empty: endpoint + "/api/empty",
    null: endpoint + "/api/null",
  },
  //
  auth: {
    register: endpoint + "/api/auth/register",
    login: endpoint + "/api/auth/login",
    code: endpoint + "/api/auth/code",
  },
  session: {
    read: endpoint + "/api/session/read",
    remove: endpoint + "/api/session/remove",
  },
  account: {
    read: endpoint + "/api/account/read",
    update: endpoint + "/api/account/update",
  },
  room: {
    getRoomList: endpoint + "/api/room/overview-my-rooms",
    search: endpoint + "/api/room/search",
    readInfo: endpoint + "/api/room/read-info",
    updateInfo: endpoint + "/api/room/update",
    create: endpoint + "/api/room/create",
    delete: endpoint + "/api/room/delete",
    leave: endpoint + "/api/room/leave",
    join: endpoint + "/api/room/join",
    getMembers: endpoint + "/api/room/members",
    kick: endpoint + "/api/room/kick",
    ban: endpoint + "/api/room/block",
    unban: endpoint + "/api/room/unblock",
    blockedUsers: endpoint + "/api/room/blocked-users",
    searchUsersToInvite: endpoint + "/api/room/search-users-to-invite",
    invite: endpoint + "/api/room/invite",
  },
  message: {
    read: endpoint + "/api/message/read",
    compare: endpoint + "/api/message/compare",
    send: endpoint + "/api/message/add",
    update: endpoint + "/api/message/update",
    remove: endpoint + "/api/message/remove",
  },
};
