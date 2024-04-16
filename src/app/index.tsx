import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "../pages/home.tsx";
import "./index.css";
import Auth from "../pages/auth.tsx";
import { routes } from "../constants.ts";
import { NotifyProvider } from "../widgets/notification/notification.tsx";
import { Chat } from "../widgets/home/chat/chat.tsx";
import { Rooms } from "../widgets/home/rooms/rooms.tsx";
import { StoreProvider } from "../shared/store/StoreProvider.tsx";
import { ContextMenuProvider } from "../widgets/context-menu/ContextMenu.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path={routes.login.path}
        id={routes.login.id}
        element={<Auth type={"login"} />}
      >
        <Route path={routes.code.path} id={routes.code.id} />
      </Route>
      <Route
        path={routes.register.path}
        id={routes.register.id}
        element={<Auth type={"register"} />}
      />
      <Route path={routes.home.path} id={routes.home.id} element={<Home />}>
        <Route
          path={routes.profile.path}
          id={routes.profile.id}
          element={<Rooms />}
        />
        <Route
          path={routes.rooms.path}
          id={routes.rooms.id}
          element={<Rooms />}
        >
          <Route
            path={routes.chat.path}
            id={routes.chat.id}
            element={<Chat />}
          />
        </Route>
        {/* <Route
          path={routes.createRoom.path}
          id={routes.createRoom.id}
          element={<RoomList />}
        />
        <Route
          path={routes.friends.path}
          id={routes.friends.id}
          element={<RoomList />}
        />
        <Route
          path={routes.settings.path}
          id={routes.settings.id}
          element={<RoomList />}
        /> */}
      </Route>
    </>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <NotifyProvider>
        <ContextMenuProvider>
          <RouterProvider router={router} />
        </ContextMenuProvider>
      </NotifyProvider>
    </StoreProvider>
  </React.StrictMode>,
);
