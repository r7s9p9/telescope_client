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
import Welcome from "../pages/welcome.tsx";
import {
  fetchAddMessage,
  fetchReadMessages,
  fetchRoomList,
  fetchSelfAccount,
} from "../shared/api/api.account.ts";
import { Room } from "../widgets/room-list/room.tsx";
import { roomIdSchema } from "../shared/api/api.schema.ts";
import { RoomId } from "../types.ts";

const homeLoader = async () => {
  const account = await fetchSelfAccount();
  const roomList = await fetchRoomList({ min: "0", max: "10" });
  // TODO if (!result.success) <- show error component
  if (!account.isLogged || !roomList.isLogged) return redirect("/welcome");

  return { selfAccount: account.data, roomList: roomList.data };
};

const roomLoader = async ({ params }: { params: Params<string> }) => {
  const roomId = roomIdSchema.safeParse(params.roomId);
  if (!roomId.success) return redirect("/"); // bad params

  const result = await fetchReadMessages(params.roomId as RoomId, {
    minCreated: "1000000000000",
    maxCreated: Date.now().toString(),
  });
  if (!result.success) return redirect("/"); // !validation
  if (!result.isLogged) return redirect("/welcome");

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: homeLoader,
    id: "home",
    errorElement: <Page404 />,
    children: [
      {
        path: "/room/:roomId",
        element: <Room />,
        loader: roomLoader,
        id: "room",
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
    path: "/welcome",
    element: <Welcome />,
    errorElement: <Page404 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
