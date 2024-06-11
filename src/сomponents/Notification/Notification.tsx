import { IconExclamationCircle, IconInfoCircle } from "@tabler/icons-react";
import { NotifyState, NotifyType } from "./types";
import { Text } from "../../shared/ui/Text/Text";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Paper } from "../../shared/ui/Paper/Paper";

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
      Icon = (
        <IconInfoCircle
          className="text-slate-600"
          strokeWidth="1.5"
          size={24}
        />
      );
      break;
    case "error":
      Icon = (
        <IconExclamationCircle
          className="text-slate-600"
          strokeWidth="1.5"
          size={24}
        />
      );
      break;
  }

  return (
    <Paper
      rounded="lg"
      shadow="md"
      padding={4}
      className={`${data.type === "info" ? "ring-green-600" : "ring-red-600"} bg-slate-50 absolute z-50 w-1/2 left-1/4 ring-2 flex justify-between items-center duration-300 ease-in-out`}
      style={{
        transform: data.isShow ? `translateY(50%)` : `translateY(-150%)`,
      }}
    >
      {Icon}
      <Text size="md" font="light" className="text-center">
        {data.text}
      </Text>
      {Icon}
    </Paper>
  );
};
