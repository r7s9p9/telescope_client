import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page404 from "../pages/page-404.tsx";
import Home from "../pages/home.tsx";
import "./index.css";
import Auth from "../pages/auth.tsx";
import { routes } from "../constants.ts";
import { NotifyProvider } from "../widgets/notification/notification.tsx";
import { Chat } from "../widgets/home/chat/chat.tsx";
import { RoomList } from "../widgets/home/room-list/room-list.tsx";
import { StoreProvider } from "../shared/store/StoreProvider.tsx";

const router = createBrowserRouter([
  {
    path: routes.home.path,
    id: routes.home.id,
    element: <Home />,
    errorElement: <Page404 />,
    children: [
      {
        path: routes.profile.path,
        id: routes.profile.id,
        element: <RoomList />, /////////////////
      },
      {
        path: routes.rooms.path,
        id: routes.rooms.id,
        element: <RoomList />,
      },
      {
        path: routes.createRoom.path,
        id: routes.createRoom.id,
        element: <RoomList />, /////////////////
      },
      {
        path: routes.room.path,
        id: routes.room.id,
        element: (
          <>
            <RoomList />
            <Chat />
          </>
        ),
      },
      {
        path: routes.friends.path,
        id: routes.friends.id,
        element: <RoomList />, /////////////////
      },
      {
        path: routes.settings.path,
        id: routes.settings.id,
        element: <RoomList />, /////////////////
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
    <StoreProvider>
      <NotifyProvider>
        <RouterProvider router={router} />
      </NotifyProvider>
    </StoreProvider>
  </React.StrictMode>,
);
