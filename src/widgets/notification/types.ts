import { Dispatch } from "react";

export interface NotificationState {
    notification: { isShow: boolean; type: "error" | "info"; text: string };
    setNotification: Dispatch<NotificationState["notification"]>;
  }