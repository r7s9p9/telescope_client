import { useLang } from "../features/LangProvider/LangProvider";
import { getNumber, isNumeric } from "./number";

function isDate(value: unknown) {
  if (Object.prototype.toString.call(value) === "[object Date]") return true;
  return false;
}

function toDate(value: string | number | Date) {
  if (isDate(value)) return value as Date;
  return new Date(value);
}

function dateVerifier(value: string | number | Date) {
  if (isDate(value)) return { success: true as const, date: value as Date };

  const timestamp = getNumber(value as string | number);
  if (!isNumeric(timestamp)) return { success: false as const };

  const date = toDate(timestamp);
  if (!isDate(date)) return { success: false as const };

  return { success: true as const, date };
}

function isSameMonth(
  firstValue: string | number | Date,
  secondValue: string | number | Date,
) {
  const firstDate = toDate(firstValue);
  const secondDate = toDate(secondValue);

  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth()
  );
}

function isSameYear(
  firstValue: string | number | Date,
  secondValue: string | number | Date,
) {
  return toDate(firstValue).getFullYear() === toDate(secondValue).getFullYear();
}

function dateFormatter(date: Date, type: "weekday" | "upToMonth" | "upToYear") {
  if (type === "weekday") {
    return date.toLocaleString("default", { weekday: "long" });
  }
  if (type === "upToMonth") {
    return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;
  }
  if (type === "upToYear") {
    return `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
  }
}

function timeFormatter(date: Date) {
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  return hours + ":" + minutes.slice(-2);
}

function relativeTimeFormatter(date: Date) {
  const now = new Date().getTime();
  const then = date.getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return {
      result: `${seconds} second${seconds === 1 ? "" : "s"} ago`,
      range: "seconds" as const,
    };
  } else if (minutes < 60) {
    return {
      result: `${minutes} minute${minutes === 1 ? "" : "s"} ago`,
      range: "minutes" as const,
    };
  } else if (hours < 24) {
    return {
      result: `${hours} hour${hours === 1 ? "" : "s"} ago`,
      range: "hours" as const,
    };
  } else {
    return {
      result: `${days} day${days === 1 ? "" : "s"} ago`,
      range: "days" as const,
    };
  }
}

export function isSameDay(
  firstValue: string | number | Date,
  secondValue: string | number | Date,
) {
  return (
    toDate(firstValue).toDateString() === toDate(secondValue).toDateString()
  );
}

export const formatDate = () => {
  function roomList(value: number | string) {
    const { success, date } = dateVerifier(value);
    if (!success) {
      console.error("Value is not a timestamp or Date object");
      return "Unknown";
    }

    const nowDate = new Date();

    if (isSameDay(date, nowDate)) return timeFormatter(date);

    if (isSameMonth(date, nowDate)) {
      const isInWeek = date.getDate() + 6 >= nowDate.getDate();
      if (isInWeek) return dateFormatter(date, "weekday");
    }

    if (isSameYear(date, nowDate)) {
      return dateFormatter(date, "upToMonth");
    }

    return dateFormatter(date, "upToYear");
  }

  function message(
    lang: ReturnType<typeof useLang>["lang"],
    createdValue: number | string,
    modifiedValue?: number | string,
  ) {
    const created = dateVerifier(createdValue);
    if (!created.success) {
      console.error("Created value is not a timestamp or Date object");
      return "Unknown";
    }

    if (!modifiedValue) return timeFormatter(created.date);

    const modified = dateVerifier(modifiedValue);
    if (!modified.success) {
      console.error("Modified value is not a timestamp or Date object");
      return "Unknown";
    }

    return `${lang.messages.MESSAGE_EDITED_TEXT} ${timeFormatter(modified.date)}`;
  }

  function bubble(value: number | string) {
    const { success, date } = dateVerifier(value);
    if (!success) {
      console.error("Value is not a timestamp or Date object");
      return "Unknown";
    }

    const nowDate = new Date();

    if (isSameYear(date, nowDate)) {
      return dateFormatter(date, "upToMonth");
    }
    return dateFormatter(date, "upToYear");
  }

  function info(value: number | string) {
    const { success, date } = dateVerifier(value);
    if (!success) {
      console.error("Value is not a timestamp or Date object");
      return "Unknown";
    }

    return dateFormatter(date, "upToYear");
  }

  function member(value: number | string) {
    const { success, date } = dateVerifier(value);
    if (!success) {
      console.error("Value is not a timestamp or Date object");
      return { result: "Unknown" };
    }

    const nowDate = new Date();

    if (isSameYear(date, nowDate)) {
      return relativeTimeFormatter(date);
    }

    return { result: dateFormatter(date, "upToYear"), range: "years" };
  }

  function session(value: number | string) {
    const { success, date } = dateVerifier(value);
    if (!success) {
      console.error("Value is not a timestamp or Date object");
      return { result: "Unknown" };
    }

    const nowDate = new Date();

    if (isSameYear(date, nowDate)) {
      return relativeTimeFormatter(date);
    }

    return { result: dateFormatter(date, "upToYear"), range: "years" };
  }

  return { roomList, message, bubble, info, member, session };
};
