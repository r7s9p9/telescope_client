import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Params,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Page404 from "../pages/page-404.tsx";
import Home from "../pages/home.tsx";
import "./index.css";
import Auth from "../pages/auth.tsx";
import {
  fetchAddMessage,
  fetchReadMessages,
  fetchSelfAccount,
} from "../shared/api/api.ts";
import { Room } from "../widgets/room-list/room.tsx";
import { roomIdSchema } from "../shared/api/api.schema.ts";
import { RoomId } from "../types.ts";
import { routes } from "../constants.ts";
import { NotifyProvider } from "../widgets/notification/notification.tsx";

// const homeLoader = async () => {
//   const account = await fetchSelfAccount();
//   const roomList = await fetchRoomList({ min: "0", max: "10" });
//   // TODO if (!result.success) <- show error component
//   if (!account.isLogged || !roomList.isLogged) return redirect("/login");

//   return { selfAccount: account.data, roomList: roomList.data };
// };

const roomLoader = async ({ params }: { params: Params<string> }) => {
  const roomId = roomIdSchema.safeParse(params.roomId);
  if (!roomId.success) return redirect(routes.home.path); // bad params

  const result = await fetchReadMessages(params.roomId as RoomId, {
    minCreated: "1000000000000",
    maxCreated: Date.now().toString(),
  });
  if (!result.success || !result.isLogged) return redirect(routes.login.path); // !validation

  return { roomData: result.data };
};

const addMessageAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const formText = formData.get("text");
  if (!formText) return { ok: false as const };

  const roomId = roomIdSchema.safeParse(formData.get("roomId"));
  if (!roomId.success) return redirect("/"); // bad params

  const payload = {
    roomId: roomId.data,
    message: {
      content: { text: formText.toString() },
      //replyTo:
    },
  };

  const a = await fetchAddMessage(payload);
  console.log(a);

  console.log(formData);
  return { ok: true as const };
};

console.log(routes.room);

const router = createBrowserRouter([
  {
    path: routes.home.path,
    id: routes.home.id,
    element: <Home />,
    errorElement: <Page404 />,
    children: [
      {
        path: routes.room.path,
        id: routes.room.id,
        element: <Room />,
        loader: roomLoader,
        children: [
          {
            path: "/room/:roomId/message/add",
            id: "messageAdd",
            action: addMessageAction,
          },
        ],
      },
    ],
  },
  {
    path: routes.login.path,
    id: routes.login.id,
    element: <Auth type={"login"} />,
    errorElement: <Page404 />,
    children: [
      {
        path: routes.code.path,
        id: routes.code.id,
      },
    ],
  },
  {
    path: routes.register.path,
    id: routes.register.id,
    element: <Auth type={"register"} />,
    errorElement: <Page404 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NotifyProvider>
      <RouterProvider router={router} />
    </NotifyProvider>
  </React.StrictMode>,
);
