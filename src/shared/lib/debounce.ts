// eslint-disable-next-line no-unused-vars
type CallbackFunction<T extends unknown[]> = (...args: T) => void;

export function debounce<T extends unknown[]>(
  callback: CallbackFunction<T>,
  delay: number,
) {
  if (typeof callback !== "function") {
    throw new Error("Callback must be a function");
  }

  if (!isFinite(delay) || delay <= 0) {
    throw new Error("Delay must be a positive finite number");
  }

  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.call(null, ...args);
    }, delay);
  };
}
