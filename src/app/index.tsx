import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Home } from "../widgets/Home/Home.tsx";
import "./index.css";
import Auth from "../widgets/Auth/Auth.tsx";
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
import { ErrorHome } from "../widgets/Home/ErrorHome.tsx";
import { ErrorAuth } from "../widgets/Auth/ErrorAuth.tsx";
import { ErrorProfile } from "../widgets/Home/Profile/ErrorProfile.tsx";
import { ErrorRooms } from "../widgets/Home/Rooms/ErrorRooms.tsx";
import { ErrorCreateRoom } from "../widgets/Home/CreateRoom/ErrorCreateRoom.tsx";
import { ErrorChat } from "../widgets/Home/Chat/ErrorChat.tsx";
import { ErrorInfo } from "../widgets/Home/Info/ErrorInfo.tsx";
import { ErrorBlocked } from "../widgets/Home/Info/Members/Blocked/ErrorBlocked.tsx";
import { ErrorInvite } from "../widgets/Home/Info/Members/Invite/ErrorInvite.tsx";
import { NoMatch } from "../widgets/NoMatch/NoMatch.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="*" element={<NoMatch />} />
      <Route
        path={routes.login.path}
        id={routes.login.id}
        element={<Auth type={"login"} />}
        errorElement={<ErrorAuth />}
      >
        <Route path={routes.code.path} id={routes.code.id} />
      </Route>
      <Route
        path={routes.register.path}
        id={routes.register.id}
        element={<Auth type={"register"} />}
        errorElement={<ErrorAuth />}
      />
      <Route
        path={routes.home.path}
        id={routes.home.id}
        element={<Home />}
        errorElement={<ErrorHome />}
      >
        <Route
          path={routes.profile.path}
          id={routes.profile.id}
          element={<Profile />}
          errorElement={<ErrorProfile />}
        />
        <Route
          path={routes.rooms.path}
          id={routes.rooms.id}
          element={<Rooms />}
          errorElement={<ErrorRooms />}
        >
          <Route
            path={routes.createRoom.path}
            id={routes.createRoom.id}
            element={<CreateRoom />}
            errorElement={<ErrorCreateRoom />}
          />
          <Route
            path={routes.chat.path}
            id={routes.chat.id}
            element={<Chat />}
            errorElement={<ErrorChat />}
          >
            <Route
              path={routes.chatInfo.path}
              id={routes.chatInfo.id}
              element={<ChatInfo />}
              errorElement={<ErrorInfo />}
            >
              <Route
                path={routes.chatBlocked.path}
                id={routes.chatBlocked.id}
                element={<BlockedUsers />}
                errorElement={<ErrorBlocked />}
              />
              <Route
                path={routes.chatInvite.path}
                id={routes.chatInvite.id}
                element={<InviteUsers />}
                errorElement={<ErrorInvite />}
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
