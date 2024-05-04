import { useEffect, useRef } from "react";

export function useInterval(
  callback: ReturnType<typeof Function>,
  delay: number,
) {
  const savedCallback = useRef<ReturnType<typeof Function>>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current?.();
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
