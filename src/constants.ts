export const routes = {
  register: { path: "/register" as const, id: "register" as const },
  login: { path: "/login" as const, id: "login" as const },
  code: { path: "/login/code" as const, id: "code" as const },

  home: { path: "/" as const, id: "home" },
  profile: { path: "/profile/" as const, id: "profile" as const },
  rooms: { path: "/rooms/" as const, id: "rooms" as const },
  createRoom: { path: "/rooms/create" as const, id: "createRoom" as const },
  chat: { path: "/rooms/:roomId" as const, id: "chat" as const },
  chatInfo: { path: "/rooms/:roomId/info" as const, id: "roomInfo" as const },

  friends: { path: "/friends/" as const, id: "friends" as const },
  settings: { path: "/settings/" as const, id: "settings" as const },
};
