export const throttle = (func: Function, wait: number) => {
  let inThrottle: boolean,
    lastFunc: ReturnType<typeof setTimeout>,
    lastTimestamp: number;
  return function (this: any) {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      lastTimestamp = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastTimestamp >= wait) {
            func.apply(context, args);
            lastTimestamp = Date.now();
          }
        },
        Math.max(wait - (Date.now() - lastTimestamp), 0),
      );
    }
  };
};
