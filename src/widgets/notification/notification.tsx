import {
  IconExclamationCircle,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { NotificationState } from "./types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type ShowType = (type: "info" | "error", text: string) => void;

export const NotificationContext = createContext<ShowType>(() => undefined);
export const useNotification = () => useContext(NotificationContext);

export function NotificationStack({ children }: { children: ReactNode }) {
  const [data, setData] = useState<NotificationState["data"]>({
    isShow: false,
    type: "info",
    text: "",
  });

  const show = (type: "info" | "error", text: string) =>
    setData({ isShow: true, type, text });
  const hide = () => setData({ ...data, isShow: false });

  useEffect(() => {
    if (data.isShow) {
      setTimeout(() => {
        setData({ ...data, isShow: false });
      }, 3000);
    }
  }, [data.isShow]);

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
    <>
      <NotificationContext.Provider value={show}>
        {children}
      </NotificationContext.Provider>
      <div
        className={`${data.type === "info" ? "border-green-600" : "border-red-600"} absolute w-5/6 place-self-start bg-slate-100 border-2 rounded-xl flex justify-center items-center shadow-xl duration-500`}
        style={{
          transform: data.isShow ? `translateY(50%)` : `translateY(-150%)`,
          filter: data.isShow ? `blur(0px)` : `blur(4px)`,
        }}
      >
        <div className="w-full flex flex-row m-2 justify-between  items-center">
          {Icon}
          <p className="text-center">{data.text}</p>
          <button
            onClick={hide}
            className="p-1 m-2 rounded-full border-2 border-slate-200 hover:bg-slate-200"
          >
            <IconX size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
