import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Home } from "../components/Home/Home.tsx";
import "./index.css";
import { Auth } from "../components/Auth/Auth.tsx";
import { routes } from "../constants.ts";
import { NotifyProvider } from "../shared/features/Notification/Notification.tsx";
import { Chat } from "../components/Home/Chat/Chat.tsx";
import { Rooms } from "../components/Home/Rooms/Rooms.tsx";
import { StoreProvider } from "../shared/store/StoreProvider.tsx";
import { ContextMenuProvider } from "../shared/features/ContextMenu/ContextMenu.tsx";
import { CreateRoom } from "../components/Home/CreateRoom/CreateRoom.tsx";
import { ChatInfo } from "../components/Home/Info/Info.tsx";
import { Profile } from "../components/Home/Profile/Profile.tsx";
import { ConfirmPopupProvider } from "../shared/features/ConfirmPopup/ConfirmPopup.tsx";
import { BlockedUsers } from "../components/Home/Info/Members/Blocked/Blocked.tsx";
import { InviteUsers } from "../components/Home/Info/Members/Invite/Invite.tsx";
import { ErrorHome } from "../components/Home/ErrorHome.tsx";
import { ErrorAuth } from "../components/Auth/ErrorAuth.tsx";
import { ErrorProfile } from "../components/Home/Profile/ErrorProfile.tsx";
import { ErrorRooms } from "../components/Home/Rooms/ErrorRooms.tsx";
import { ErrorCreateRoom } from "../components/Home/CreateRoom/ErrorCreateRoom.tsx";
import { ErrorChat } from "../components/Home/Chat/ErrorChat.tsx";
import { ErrorInfo } from "../components/Home/Info/ErrorInfo.tsx";
import { ErrorBlocked } from "../components/Home/Info/Members/Blocked/ErrorBlocked.tsx";
import { ErrorInvite } from "../components/Home/Info/Members/Invite/ErrorInvite.tsx";
import { NoMatch } from "../components/NoMatch/NoMatch.tsx";
import { WatchdogProvider } from "../shared/api/watchdog/useWatchdog.tsx";
import { Settings } from "../components/Home/Settings/Settings.tsx";
import { Sessions } from "../components/Home/Settings/Sessions/Sessions.tsx";
import { Privacy } from "../components/Home/Settings/Privacy/Privacy.tsx";
import { ErrorSettings } from "../components/Home/Settings/ErrorSettings.tsx";
import { ErrorSessions } from "../components/Home/Settings/Sessions/ErrorSessions.tsx";
import { ErrorPrivacy } from "../components/Home/Settings/Privacy/ErrorPrivacy.tsx";

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
            path={routes.roomsCreateRoom.path}
            id={routes.roomsCreateRoom.id}
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
              path={routes.chatCreateRoom.path}
              id={routes.chatCreateRoom.id}
              element={<CreateRoom />}
              errorElement={<ErrorCreateRoom />}
            />
            <Route
              path={routes.chatInfo.path}
              id={routes.chatInfo.id}
              element={<ChatInfo />}
              errorElement={<ErrorInfo />}
            >
              <Route
                path={routes.chatInfoCreateRoom.path}
                id={routes.chatInfoCreateRoom.id}
                element={<CreateRoom />}
                errorElement={<ErrorCreateRoom />}
              />
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
          path={routes.settings.path}
          id={routes.settings.id}
          element={<Settings />}
          errorElement={<ErrorSettings />}
        />
        <Route
          path={routes.sessions.path}
          id={routes.sessions.id}
          element={<Sessions />}
          errorElement={<ErrorSessions />}
        />
        <Route
          path={routes.privacy.path}
          id={routes.privacy.id}
          element={<Privacy />}
          errorElement={<ErrorPrivacy />}
        />
      </Route>
    </>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <WatchdogProvider>
        <NotifyProvider>
          <ConfirmPopupProvider>
            <ContextMenuProvider>
              <RouterProvider router={router} />
            </ContextMenuProvider>
          </ConfirmPopupProvider>
        </NotifyProvider>
      </WatchdogProvider>
    </StoreProvider>
  </React.StrictMode>,
);
