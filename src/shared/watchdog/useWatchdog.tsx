import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { healthCheck } from "../api/api";

type RoutesType = Map<string, { disabled: boolean }>;

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
    routes.current = new Map();
    routes.current.set(route, { disabled: true });
  };

  const report = (route: string) => {
    if (!routes.current) {
      create(route);
      return;
    }
    routes.current.set(route, { disabled: true });
  };

  const getState = (route: string) => {
    if (!routes.current) return { disabled: false };
    const state = routes.current.get(route);
    if (!state) return { disabled: false };
    if (state.disabled) return { disabled: true };
    return { disabled: false };
  };

  const reset = (route: string) => {
    if (!routes.current) return;
    routes.current.set(route, { disabled: false });
  };

  const checker = useCallback(async () => {
    if (!routes.current) return;
    for (const [route, state] of routes.current) {
      if (!state.disabled) continue;
      const { success } = await healthCheck(route);
      if (success) reset(route);
    }
  }, []);

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
