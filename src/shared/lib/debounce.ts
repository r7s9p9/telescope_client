type CallbackFunction<T extends unknown[]> = (...args: T) => void;

export function debounce<T extends unknown[]>(
    callback: CallbackFunction<T>,
    delay: number
  ) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: T) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback(...args)}, delay
      );
    };
  };
