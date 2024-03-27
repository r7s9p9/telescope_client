import { Dispatch } from "react";

export type NotifyType = {
  show: {
    info: (text: string) => void;
    error: (text: string) => void;
    }
  hide: () => void;
};

export interface NotifyState {
    data: { isShow: boolean; type: "error" | "info"; text: string };
    setData: Dispatch<NotifyState["data"]>;
  }