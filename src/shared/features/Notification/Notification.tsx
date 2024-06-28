import { IconExclamationCircle, IconInfoCircle } from "@tabler/icons-react";
import { NotifyState, NotifyType } from "./types";
import { Text } from "../../ui/Text/Text";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Paper } from "../../ui/Paper/Paper";

const NOTIFICATION_SHOW_TIME = 5000;

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

// eslint-disable-next-line react-refresh/only-export-components
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
    if (data.isShow) setTimeout(hide, NOTIFICATION_SHOW_TIME);
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

  const iconProps = {
    className: "text-slate-600 shrink-0",
    strokeWidth: "1.5",
    size: 24,
  };

  let Icon;
  switch (data.type) {
    case "info":
      Icon = <IconInfoCircle {...iconProps} />;
      break;
    case "error":
      Icon = <IconExclamationCircle {...iconProps} />;
      break;
  }

  return (
    <Paper
      rounded="lg"
      padding={4}
      className={`${data.type === "info" ? "ring-slate-400" : "ring-red-600"} absolute z-50 m-4 md:m-0 md:w-1/2 left-0 top-0 md:left-1/4 ring-2 flex justify-between items-center gap-4 duration-300 ease-in-out shadow-md bg-slate-50 `}
      style={{
        transform: data.isShow ? `translateY(25%)` : `translateY(-150%)`,
      }}
    >
      {Icon}
      <Text size="md" font="light" className="text-center break-words">
        {data.text}
      </Text>

      {Icon}
    </Paper>
  );
};
