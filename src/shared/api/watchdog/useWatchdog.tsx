import { ReactNode, createContext, useContext, useEffect, useRef } from "react";
import { healthCheck } from "../api";

type RoutesType = Set<string>;

const CHECK_INTERVAL = 15000;

const WatchdogContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  report: (_route: string) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getState: (_route: string) => {
    return { disabled: false };
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const useWatchdog = () => useContext(WatchdogContext);

export function WatchdogProvider({ children }: { children: ReactNode }) {
  const routes = useRef<RoutesType>();

  const create = (route: string) => {
    routes.current = new Set([route]);
  };

  const report = (route: string) => {
    if (!routes.current) {
      create(route);
      return;
    }
    routes.current.add(route);
  };

  const getState = (route: string) => {
    if (!routes.current) return { disabled: false };
    if (routes.current.has(route)) return { disabled: true };
    return { disabled: false };
  };

  const remove = (route: string) => {
    if (!routes.current) return;
    routes.current.delete(route);
  };

  const checker = async () => {
    if (!routes.current) return;
    for (const [route] of routes.current) {
      const { success } = await healthCheck(route);
      if (success) remove(route);
    }
  };

  useEffect(() => {
    setInterval(checker, CHECK_INTERVAL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WatchdogContext.Provider value={{ report, getState }}>
      {children}
    </WatchdogContext.Provider>
  );
}
