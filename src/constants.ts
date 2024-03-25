export const routes = {
    register: { path: "/register" as const, id: "register" },
    login: { path: "/login" as const, id: "login" },
    code: { path: "/login/code" as const, id: "code" },

    home: { path: "/" as const, id: "home" },
    room: { path: "/room/:roomId" as const, id: "room" }
}