import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "../pages/Home.tsx";
import "./index.css";
import Auth from "../pages/Auth.tsx";
import { routes } from "../constants.ts";
import { NotifyProvider } from "../widgets/Notification/Notification.tsx";
import { Chat } from "../widgets/Home/Chat/Chat.tsx";
import { Rooms } from "../widgets/Home/Rooms/Rooms.tsx";
import { StoreProvider } from "../shared/store/StoreProvider.tsx";
import { ContextMenuProvider } from "../widgets/ContextMenu/ContextMenu.tsx";
import { CreateRoom } from "../widgets/Home/CreateRoom/CreateRoom.tsx";
import { ChatInfo } from "../widgets/Home/Info/Info.tsx";
import { Profile } from "../widgets/Home/Profile/Profile.tsx";
import { WIP } from "../widgets/WIP/WIP.tsx";
import { PopupProvider } from "../widgets/Popup/Popup.tsx";
import { BlockedUsers } from "../widgets/Home/Info/Members/Blocked/Blocked.tsx";
import { InviteUsers } from "../widgets/Home/Info/Members/Invite/Invite.tsx";

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
          element={<Profile />}
        />
        <Route
          path={routes.rooms.path}
          id={routes.rooms.id}
          element={<Rooms />}
        >
          <Route
            path={routes.createRoom.path}
            id={routes.createRoom.id}
            element={<CreateRoom />}
          />
          <Route path={routes.chat.path} id={routes.chat.id} element={<Chat />}>
            <Route
              path={routes.chatInfo.path}
              id={routes.chatInfo.id}
              element={<ChatInfo />}
            >
              <Route
                path={routes.chatBlocked.path}
                id={routes.chatBlocked.id}
                element={<BlockedUsers />}
              />
              <Route
                path={routes.chatInvite.path}
                id={routes.chatInvite.id}
                element={<InviteUsers />}
              />
            </Route>
          </Route>
        </Route>
        <Route
          path={routes.friends.path}
          id={routes.friends.id}
          element={<WIP />}
        />
        <Route
          path={routes.settings.path}
          id={routes.settings.id}
          element={<WIP />}
        />
      </Route>
    </>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <NotifyProvider>
        <PopupProvider>
          <ContextMenuProvider>
            <RouterProvider router={router} />
          </ContextMenuProvider>
        </PopupProvider>
      </NotifyProvider>
    </StoreProvider>
  </React.StrictMode>,
);
