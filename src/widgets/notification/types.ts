import { Dispatch } from "react";

export interface NotificationState {
    data: { isShow: boolean; type: "error" | "info"; text: string };
    setData: Dispatch<NotificationState["data"]>;
  }