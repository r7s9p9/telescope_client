import parser from "ua-parser-js";

export function parseUserAgent(ua: string) {
  const parsedUserAgent = parser(ua);
  return {
    device: (parsedUserAgent.device.type || "desktop") as
      | "console"
      | "mobile"
      | "tablet"
      | "smarttv"
      | "wearable"
      | "embedded",
    browser: parsedUserAgent.browser.name || "unknown",
  };
}
