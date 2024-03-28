import { IconExclamationCircle, IconInfoCircle } from "@tabler/icons-react";
import { NotifyState, NotifyType } from "./types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const NotifyContext = createContext<NotifyType>({
  show: {
    info: () => {},
    error: () => {},
  },
  hide: () => {},
});

const NotifyViewContext = createContext<NotifyState["data"]>({
  isShow: false,
  text: "",
  type: "info",
});

export const useNotify = () => useContext(NotifyContext);

export function NotifyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<NotifyState["data"]>({
    isShow: false,
    type: "info",
    text: "",
  });

  const show = {
    info: (text: string) => setData({ isShow: true, type: "info", text }),
    error: (text: string) => setData({ isShow: true, type: "error", text }),
  };
  const hide = () => setData((data) => ({ ...data, isShow: false }));

  useEffect(() => {
    if (data.isShow) setTimeout(() => hide(), 3000);
  }, [data.isShow]);

  return (
    <NotifyContext.Provider value={{ show, hide }}>
      <NotifyViewContext.Provider value={data}>
        {children}
      </NotifyViewContext.Provider>
    </NotifyContext.Provider>
  );
}
export const NotifyStack = () => {
  const data = useContext(NotifyViewContext);

  let Icon;
  switch (data.type) {
    case "info":
      Icon = <IconInfoCircle className="text-green-600 m-2" size={24} />;
      break;
    case "error":
      Icon = <IconExclamationCircle className="text-red-600 m-2" size={24} />;
      break;
  }

  return (
    <div
      className={`${data.type === "info" ? "border-green-600" : "border-red-600"} absolute p-2 w-1/2 left-1/4 bg-slate-100 border-2 rounded-xl flex justify-between items-center shadow-xl duration-500`}
      style={{
        transform: data.isShow ? `translateY(50%)` : `translateY(-150%)`,
      }}
    >
      {Icon}
      <p className="text-center">{data.text}</p>
      {Icon}
    </div>
  );
};
