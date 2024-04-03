type CallbackFunction<T extends unknown[]> = (...args: T) => void;

export default <T extends unknown[]>(callbackFn: CallbackFunction<T>, delay: number): ((...args: T) => void) => {
  let lastCallTimestamp = 0;
  return (...args: T) => {
    const now = new Date().getTime();
    if (now - lastCallTimestamp >= delay) {
      callbackFn(...args);
      lastCallTimestamp = now;
    }
  };
};