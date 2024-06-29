import { Dispatch } from "react";

export type NotifyType = {
  show: {
    // eslint-disable-next-line no-unused-vars
    info: (text: string) => void;
    // eslint-disable-next-line no-unused-vars
    error: (text: string) => void;
  };
  hide: () => void;
};

export interface NotifyState {
  data: { isShow: boolean; type: "error" | "info"; text: string };
  setData: Dispatch<NotifyState["data"]>;
}
